/**
 * JustCopyAuth - Authentication client for JustCopy published applications
 * Provides user authentication with zero configuration.
 */

class JustCopyAuth {
  constructor(config = {}) {
    this.apiUrl = config.apiUrl || process.env.JUSTCOPY_API_URL || 'https://api.justcopy.ai/api/customer-backend';
    this.apiKey = config.apiKey || process.env.JUSTCOPY_API_KEY;
    this.applicationId = config.applicationId || process.env.APPLICATION_ID;

    if (!this.apiKey) {
      console.warn('⚠️  JUSTCOPY_API_KEY not set. Auth operations will fail.');
    }

    console.log('✅ JustCopyAuth initialized');
  }

  async register({ email, password, name }) {
    return this._request('POST', '/auth/register', {
      email,
      password,
      name
    });
  }

  async login({ email, password }) {
    return this._request('POST', '/auth/login', {
      email,
      password
    });
  }

  async verify(token) {
    try {
      const result = await this._request('POST', '/auth/verify', { token });
      return result.user;
    } catch {
      return null;
    }
  }

  async logout(token) {
    return this._request('POST', '/auth/logout', { token });
  }

  async me(token) {
    return this.verify(token);
  }

  async _request(method, path, data) {
    const fetch = require('node-fetch');

    const url = `${this.apiUrl}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Project-API-Key': this.apiKey
    };

    const options = { method, headers };

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
}

module.exports = { JustCopyAuth };
