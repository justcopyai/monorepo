/**
 * JustCopyDB - Database client for JustCopy published applications
 * Provides persistent data storage with zero configuration.
 */

class TableQuery {
  constructor(db, tableName) {
    this.db = db;
    this.tableName = tableName;
    this.conditions = {};
    this.filterConditions = {};
    this.limitValue = 100;
  }

  where(field, value) {
    this.conditions[field] = value;
    return this;
  }

  filter(field, value) {
    this.filterConditions[field] = value;
    return this;
  }

  limit(count) {
    this.limitValue = count;
    return this;
  }

  async get() {
    const indexField = Object.keys(this.conditions)[0];
    const indexValue = this.conditions[indexField];

    return this.db._request('POST', '/db/query', {
      tableName: this.tableName,
      index: indexField,
      value: indexValue,
      filter: Object.keys(this.filterConditions).length > 0 ? this.filterConditions : undefined,
      limit: this.limitValue
    });
  }

  async first() {
    const results = await this.limit(1).get();
    return results[0] || null;
  }

  async find(id) {
    try {
      return await this.db._request('GET', `/db/${this.tableName}/${id}`);
    } catch (error) {
      if (error.message.includes('not found')) {
        return null;
      }
      throw error;
    }
  }

  async insert(data) {
    const userId = data.userId;
    if (!userId) {
      throw new Error('userId is required for insert operations');
    }

    return this.db._request('POST', '/db/create', {
      tableName: this.tableName,
      userId,
      data
    });
  }

  async update(userId, data) {
    const recordId = this.conditions.id;
    if (!recordId) {
      throw new Error('Record ID required for update (use .where("id", recordId))');
    }

    return this.db._request('PUT', `/db/${this.tableName}/${recordId}`, {
      userId,
      data
    });
  }

  async delete(userId) {
    const recordId = this.conditions.id;
    if (!recordId) {
      throw new Error('Record ID required for delete (use .where("id", recordId))');
    }

    return this.db._request('DELETE', `/db/${this.tableName}/${recordId}`, {
      userId
    });
  }

  async count() {
    const results = await this.get();
    return results.length;
  }
}

class JustCopyDB {
  constructor(config = {}) {
    // Use base URL and append service path
    const baseUrl = config.apiUrl || process.env.JUSTCOPY_API_URL || 'https://api.justcopy.ai/api';
    this.apiUrl = `${baseUrl}/customer-backend`;
    this.apiKey = config.apiKey || process.env.JUSTCOPY_API_KEY;
    this.applicationId = config.applicationId || process.env.APPLICATION_ID;

    if (!this.apiKey) {
      console.warn('⚠️  JUSTCOPY_API_KEY not set. Database operations will fail.');
    }

    if (!this.applicationId) {
      console.warn('⚠️  APPLICATION_ID not set. Database operations may fail.');
    }

    console.log('✅ JustCopyDB initialized with API:', this.apiUrl);
  }

  async defineTable(name, schema = {}) {
    const indexes = {};
    const indexFields = Object.keys(schema.indexes || {});
    if (indexFields.length > 0) {
      indexes.idx1 = indexFields[0];
    }
    if (indexFields.length > 1) {
      indexes.idx2 = indexFields[1];
    }

    const response = await this._request('POST', '/db/define-schema', {
      tableName: name,
      indexes
    });

    console.log(`✅ Table "${name}" schema defined with indexes:`, indexes);
    return response;
  }

  table(name) {
    return new TableQuery(this, name);
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
      console.error(`[JustCopyDB] ${method} ${path} failed:`, error.message);
      throw error;
    }
  }

  async testConnection() {
    try {
      await this._request('GET', '/db/schema/users');
      return true;
    } catch (error) {
      console.error('[JustCopyDB] Connection test failed:', error.message);
      return false;
    }
  }
}

module.exports = { JustCopyDB };
