/**
 * JustCopyStorage - File storage client for JustCopy published applications
 *
 * Provides persistent file storage with zero configuration.
 * Files are stored in S3 with metadata in DynamoDB.
 */
class JustCopyStorage {
  constructor(config = {}) {
    // Use base URL and append service path
    const baseUrl = config.apiUrl || process.env.JUSTCOPY_API_URL || 'https://api.justcopy.ai/api';
    this.apiUrl = `${baseUrl}/customer-filesystem`;
    this.apiKey = config.apiKey || process.env.JUSTCOPY_API_KEY;
    this.applicationId = config.applicationId || process.env.APPLICATION_ID;

    if (!this.apiKey) {
      console.warn('⚠️  JUSTCOPY_API_KEY not set. Storage operations will fail.');
    }

    console.log('✅ JustCopyStorage initialized with API:', this.apiUrl);
  }

  /**
   * Upload a file
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

    const FormData = require('form-data');
    const formData = new FormData();

    // Add file
    formData.append('file', fileData, {
      filename: fileName,
      contentType: this._detectContentType(fileName),
    });

    // Add metadata
    formData.append('userId', userId);
    formData.append('folder', folder);
    formData.append('isPublic', String(isPublic));
    formData.append('generateThumbnails', String(generateThumbnails));
    formData.append('tags', tags.join(','));
    formData.append('metadata', JSON.stringify(metadata));

    const response = await this._request('POST', '/upload', formData);
    return response.file;
  }

  /**
   * Get file download URL
   */
  async getUrl(fileId) {
    const response = await this._request('GET', `/files/${fileId}`);
    return response.file.downloadUrl;
  }

  /**
   * Get file metadata with download URL
   */
  async get(fileId) {
    const response = await this._request('GET', `/files/${fileId}`);
    return response.file;
  }

  /**
   * List files with filtering
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

    const response = await this._request('GET', `/files?${queryParams.toString()}`);
    return {
      files: response.files,
      pagination: response.pagination,
    };
  }

  /**
   * Delete a file
   */
  async delete(fileId, userId, options = {}) {
    const { hard = false } = options;

    const queryParams = new URLSearchParams();
    queryParams.append('userId', userId);
    if (hard) queryParams.append('hard', 'true');

    await this._request('DELETE', `/files/${fileId}?${queryParams.toString()}`);
  }

  /**
   * Get storage quota information
   */
  async getQuota() {
    const response = await this._request('GET', '/quota');
    return response.quota;
  }

  /**
   * Internal request handler
   */
  async _request(method, path, body) {
    const fetch = require('node-fetch');
    const url = `${this.apiUrl}${path}`;
    const headers = { 'X-Project-API-Key': this.apiKey };

    // Don't set Content-Type for FormData (node-fetch handles it)
    if (!(body && body.constructor && body.constructor.name === 'FormData')) {
      headers['Content-Type'] = 'application/json';
    }

    const options = { method, headers };

    if (body && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
      if (body.constructor && body.constructor.name === 'FormData') {
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
   */
  _detectContentType(fileName) {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes = {
      jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
      gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
      mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm',
      pdf: 'application/pdf', txt: 'text/plain', json: 'application/json',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }
}

module.exports = { JustCopyStorage };
