const AuthClient = require('./auth-client');
const TableQuery = require('./table-query');

/**
 * JustCopyDB - Main database client for JustCopy published applications
 *
 * Usage:
 *   const { JustCopyDB } = require('@justcopy/database');
 *   const db = new JustCopyDB(); // Auto-configured from env vars
 *
 *   // Define tables
 *   await db.defineTable('users', { indexes: { email: 'unique', status: 'filter' } });
 *
 *   // Auth operations
 *   const { user, token } = await db.auth.register({ email, password, name });
 *
 *   // Database operations
 *   const items = await db.table('items').where('userId', userId).get();
 */
class JustCopyDB {
  /**
   * Create a new database client
   * @param {Object} config - Optional configuration
   * @param {string} config.apiUrl - API base URL (defaults to env var)
   * @param {string} config.apiKey - Project API key (defaults to env var)
   * @param {string} config.projectId - Project ID (defaults to env var)
   */
  constructor(config = {}) {
    this.apiUrl = config.apiUrl || process.env.JUSTCOPY_API_URL || 'https://api.justcopy.ai/api/customer-backend';
    this.apiKey = config.apiKey || process.env.JUSTCOPY_API_KEY;
    this.applicationId = config.applicationId || process.env.APPLICATION_ID;

    // Validate required configuration
    if (!this.apiKey) {
      console.warn('⚠️  JUSTCOPY_API_KEY not set. Database operations will fail.');
    }

    if (!this.applicationId) {
      console.warn('⚠️  APPLICATION_ID not set. Database operations may fail.');
    }

    // Initialize auth client
    this.auth = new AuthClient(this);

    console.log('✅ JustCopyDB initialized');
  }

  /**
   * Define a table schema with indexes
   * @param {string} name - Table name
   * @param {Object} schema - Schema configuration
   * @param {Object} schema.indexes - Index definitions (e.g., { email: 'unique', status: 'filter' })
   * @returns {Promise<Object>}
   */
  async defineTable(name, schema = {}) {
    const indexes = {};

    // Map simple string values to index slots
    const indexFields = Object.keys(schema.indexes || {});
    if (indexFields.length > 0) {
      indexes.idx1 = indexFields[0];
    }
    if (indexFields.length > 1) {
      indexes.idx2 = indexFields[1];
    }
    // idx3 is always 'createdAt' (handled by backend)

    const response = await this._request('POST', '/db/define-schema', {
      tableName: name,
      indexes
    });

    console.log(`✅ Table "${name}" schema defined with indexes:`, indexes);
    return response;
  }

  /**
   * Get table query builder
   * @param {string} name - Table name
   * @returns {TableQuery}
   */
  table(name) {
    return new TableQuery(this, name);
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
      console.error(`[JustCopyDB] ${method} ${path} failed:`, error.message);
      throw error;
    }
  }

  /**
   * Test database connection
   * @returns {Promise<boolean>}
   */
  async testConnection() {
    try {
      // Try to get schema for a test table
      await this._request('GET', '/db/schema/users');
      return true;
    } catch (error) {
      console.error('[JustCopyDB] Connection test failed:', error.message);
      return false;
    }
  }
}

module.exports = JustCopyDB;
