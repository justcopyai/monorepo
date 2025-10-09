/**
 * JustCopyAuth - Authentication client for JustCopy published applications
 *
 * Provides user authentication with zero configuration.
 * Works standalone or alongside @justcopy/database.
 */
class JustCopyAuth {
  /**
   * Create a new auth client
   * @param {Object} config - Optional configuration
   * @param {string} config.apiUrl - API base URL (defaults to env var)
   * @param {string} config.apiKey - Project API key (defaults to env var)
   * @param {string} config.applicationId - Application ID (defaults to env var)
   */
  constructor(config = {}) {
    this.apiUrl = config.apiUrl || process.env.JUSTCOPY_API_URL || 'https://api.justcopy.ai/api/customer-backend';
    this.apiKey = config.apiKey || process.env.JUSTCOPY_API_KEY;
    this.applicationId = config.applicationId || process.env.APPLICATION_ID;

    // Validate required configuration
    if (!this.apiKey) {
      console.warn('⚠️  JUSTCOPY_API_KEY not set. Auth operations will fail.');
    }

    if (!this.applicationId) {
      console.warn('⚠️  APPLICATION_ID not set. Auth operations may fail.');
    }

    console.log('✅ JustCopyAuth initialized');
  }

  /**
   * Register a new user
   * @param {Object} params
   * @param {string} params.email - User email
   * @param {string} params.password - User password
   * @param {string} params.name - User name
   * @returns {Promise<{user: Object, token: string}>}
   */
  async register({ email, password, name }) {
    return this._request('POST', '/auth/register', {
      email,
      password,
      name
    });
  }

  /**
   * Login user
   * @param {Object} params
   * @param {string} params.email - User email
   * @param {string} params.password - User password
   * @returns {Promise<{user: Object, token: string}>}
   */
  async login({ email, password }) {
    return this._request('POST', '/auth/login', {
      email,
      password
    });
  }

  /**
   * Verify token and get user info
   * @param {string} token - Auth token
   * @returns {Promise<Object|null>} User object or null if invalid
   */
  async verify(token) {
    try {
      const result = await this._request('POST', '/auth/verify', { token });
      return result.user;
    } catch {
      return null;
    }
  }

  /**
   * Logout user (invalidate token)
   * @param {string} token - Auth token to invalidate
   * @returns {Promise<void>}
   */
  async logout(token) {
    return this._request('POST', '/auth/logout', { token });
  }

  /**
   * Get current user from token (alias for verify)
   * @param {string} token - Auth token
   * @returns {Promise<Object|null>}
   */
  async me(token) {
    return this.verify(token);
  }

  /**
   * Internal request handler
   * @private
   */
  async _request(method, path, data) {
    // Use node-fetch for Node.js environments
    const fetch = globalThis.fetch || require('node-fetch');

    const url = `${this.apiUrl}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Project-API-Key': this.apiKey
    };

    const options = {
      method,
      headers
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
      options.body = JSON.stringify(data);
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
      console.error(`[JustCopyAuth] ${method} ${path} failed:`, error.message);
      throw error;
    }
  }

  /**
   * Test auth service connection
   * @returns {Promise<boolean>}
   */
  async testConnection() {
    try {
      // Try a lightweight request
      await this._request('POST', '/auth/verify', { token: 'test' });
      return true;
    } catch (error) {
      // We expect this to fail with invalid token, but connection works
      if (error.message.includes('Request failed')) {
        return false;
      }
      return true; // Service is responding
    }
  }
}

module.exports = JustCopyAuth;
