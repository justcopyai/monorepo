/**
 * JustCopyStorage - Main storage client for JustCopy published applications
 *
 * Usage:
 *   const { JustCopyStorage } = require('@justcopy/storage');
 *   const storage = new JustCopyStorage(); // Auto-configured from env vars
 *
 *   // Upload file
 *   const file = await storage.upload(fileBuffer, {
 *     fileName: 'photo.jpg',
 *     folder: 'avatars',
 *     userId: user.id
 *   });
 *
 *   // Get download URL
 *   const url = await storage.getUrl(file.id);
 *
 *   // List files
 *   const { files } = await storage.list({ userId: user.id });
 *
 *   // Delete file
 *   await storage.delete(file.id);
 */
class JustCopyStorage {
  /**
   * Create a new storage client
   * @param {Object} config - Optional configuration
   * @param {string} config.apiUrl - API base URL (defaults to env var)
   * @param {string} config.apiKey - Project API key (defaults to env var)
   * @param {string} config.applicationId - Application ID (defaults to env var)
   */
  constructor(config = {}) {
    // Use base URL and append service path
    const baseUrl = config.apiUrl || process.env.JUSTCOPY_API_URL || 'https://api.justcopy.ai/api';
    this.apiUrl = `${baseUrl}/customer-filesystem`;
    this.apiKey = config.apiKey || process.env.JUSTCOPY_API_KEY;
    this.applicationId = config.applicationId || process.env.APPLICATION_ID;

    // Validate required configuration
    if (!this.apiKey) {
      console.warn('⚠️  JUSTCOPY_API_KEY not set. Storage operations will fail.');
    }

    if (!this.applicationId) {
      console.warn('⚠️  APPLICATION_ID not set. Storage operations may fail.');
    }

    console.log('✅ JustCopyStorage initialized with API:', this.apiUrl);
  }

  /**
   * Upload a file
   * @param {Buffer|Blob} fileData - File data (Buffer in Node.js, Blob in browser)
   * @param {Object} options - Upload options
   * @param {string} options.fileName - Original file name
   * @param {string} options.userId - User ID who owns the file
   * @param {string} options.folder - Optional folder path
   * @param {boolean} options.isPublic - Public access (default: false)
   * @param {boolean} options.generateThumbnails - Generate thumbnails for images (default: false)
   * @param {string[]} options.tags - Optional tags
   * @param {Object} options.metadata - Custom metadata
   * @returns {Promise<Object>} File metadata
   */
  async upload(fileData, options = {}) {
    const {
      fileName,
      userId = 'anonymous',
      folder = '',
      isPublic = false,
      generateThumbnails = false,
      tags = [],
      metadata = {},
    } = options;

    if (!fileName) {
      throw new Error('fileName is required');
    }

    // Create FormData for multipart upload
    const FormData = globalThis.FormData || require('form-data');
    const formData = new FormData();

    // Add file
    if (typeof window !== 'undefined' && fileData instanceof Blob) {
      // Browser environment
      formData.append('file', fileData, fileName);
    } else {
      // Node.js environment
      formData.append('file', fileData, {
        filename: fileName,
        contentType: this._detectContentType(fileName),
      });
    }

    // Add metadata
    formData.append('userId', userId);
    formData.append('folder', folder);
    formData.append('isPublic', String(isPublic));
    formData.append('generateThumbnails', String(generateThumbnails));
    formData.append('tags', tags.join(','));
    formData.append('metadata', JSON.stringify(metadata));

    const response = await this._request('POST', '/customer-filesystem/upload', formData, {
      'X-Project-API-Key': this.apiKey,
    });

    return response.file;
  }

  /**
   * Get file download URL
   * @param {string} fileId - File ID
   * @returns {Promise<string>} Presigned download URL
   */
  async getUrl(fileId) {
    const response = await this._request('GET', `/customer-filesystem/files/${fileId}`);
    return response.file.downloadUrl;
  }

  /**
   * Get file metadata with download URL
   * @param {string} fileId - File ID
   * @returns {Promise<Object>} File metadata with download URL
   */
  async get(fileId) {
    const response = await this._request('GET', `/customer-filesystem/files/${fileId}`);
    return response.file;
  }

  /**
   * List files with filtering
   * @param {Object} options - List options
   * @param {string} options.userId - Filter by user ID
   * @param {string} options.folder - Filter by folder
   * @param {string} options.mimeType - Filter by MIME type
   * @param {string[]} options.tags - Filter by tags
   * @param {number} options.limit - Results per page (default: 20)
   * @param {string} options.cursor - Pagination cursor
   * @returns {Promise<Object>} Files and pagination info
   */
  async list(options = {}) {
    const { userId, folder, mimeType, tags, limit = 20, cursor } = options;

    const queryParams = new URLSearchParams();
    if (userId) queryParams.append('userId', userId);
    if (folder) queryParams.append('folder', folder);
    if (mimeType) queryParams.append('mimeType', mimeType);
    if (tags && tags.length > 0) queryParams.append('tags', tags.join(','));
    if (limit) queryParams.append('limit', String(limit));
    if (cursor) queryParams.append('cursor', cursor);

    const response = await this._request('GET', `/customer-filesystem/files?${queryParams.toString()}`);
    return {
      files: response.files,
      pagination: response.pagination,
    };
  }

  /**
   * Delete a file
   * @param {string} fileId - File ID
   * @param {string} userId - User ID (for ownership verification)
   * @param {Object} options - Delete options
   * @param {boolean} options.hard - Permanent deletion (default: false, soft delete)
   * @returns {Promise<void>}
   */
  async delete(fileId, userId, options = {}) {
    const { hard = false } = options;

    const queryParams = new URLSearchParams();
    queryParams.append('userId', userId);
    if (hard) queryParams.append('hard', 'true');

    await this._request('DELETE', `/customer-filesystem/files/${fileId}?${queryParams.toString()}`);
  }

  /**
   * Get storage quota information
   * @returns {Promise<Object>} Quota information
   */
  async getQuota() {
    const response = await this._request('GET', '/customer-filesystem/quota');
    return response.quota;
  }

  /**
   * Internal request handler
   * @private
   */
  async _request(method, path, body, customHeaders = {}) {
    // Use node-fetch for Node.js environments
    const fetch = globalThis.fetch || require('node-fetch');

    const url = `${this.apiUrl}${path}`;
    const headers = {
      'X-Project-API-Key': this.apiKey,
      ...customHeaders,
    };

    // Don't set Content-Type for FormData (browser/node-fetch handle it)
    if (!(body instanceof (globalThis.FormData || require('form-data')))) {
      headers['Content-Type'] = 'application/json';
    }

    const options = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
      if (body instanceof (globalThis.FormData || require('form-data'))) {
        options.body = body;
      } else {
        options.body = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        let errorMessage = 'Request failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Handle empty responses (like DELETE)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return null;
    } catch (error) {
      console.error(`[JustCopyStorage] ${method} ${path} failed:`, error.message);
      throw error;
    }
  }

  /**
   * Detect content type from file name
   * @private
   */
  _detectContentType(fileName) {
    const ext = fileName.split('.').pop()?.toLowerCase();

    const mimeTypes = {
      // Images
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      // Videos
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      avi: 'video/x-msvideo',
      webm: 'video/webm',
      // Documents
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      txt: 'text/plain',
      json: 'application/json',
    };

    return mimeTypes[ext || ''] || 'application/octet-stream';
  }
}

module.exports = JustCopyStorage;
