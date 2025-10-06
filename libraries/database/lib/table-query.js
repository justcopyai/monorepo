/**
 * TableQuery - Fluent query builder for database operations
 */
class TableQuery {
  constructor(db, tableName) {
    this.db = db;
    this.tableName = tableName;
    this.conditions = {};
    this.filterConditions = {};
    this.limitValue = 100;
  }

  /**
   * Add WHERE condition (uses indexes for fast queries)
   * @param {string} field - Field name to query
   * @param {*} value - Value to match
   * @returns {TableQuery}
   */
  where(field, value) {
    this.conditions[field] = value;
    return this;
  }

  /**
   * Add FILTER condition (applied after index query)
   * @param {string} field - Field name to filter
   * @param {*} value - Value to match
   * @returns {TableQuery}
   */
  filter(field, value) {
    this.filterConditions[field] = value;
    return this;
  }

  /**
   * Limit number of results
   * @param {number} count - Max results to return
   * @returns {TableQuery}
   */
  limit(count) {
    this.limitValue = count;
    return this;
  }

  /**
   * Execute query and get all results
   * @returns {Promise<Array>}
   */
  async get() {
    // Auto-detect which index to use
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

  /**
   * Get first result only
   * @returns {Promise<Object|null>}
   */
  async first() {
    const results = await this.limit(1).get();
    return results[0] || null;
  }

  /**
   * Get a single record by ID
   * @param {string} id - Record ID
   * @returns {Promise<Object|null>}
   */
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

  /**
   * Insert a new record
   * @param {Object} data - Record data
   * @returns {Promise<Object>}
   */
  async insert(data) {
    // Extract userId from data
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

  /**
   * Update a record
   * @param {string} userId - User ID (for ownership verification)
   * @param {Object} data - Updated data
   * @returns {Promise<Object>}
   */
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

  /**
   * Delete a record
   * @param {string} userId - User ID (for ownership verification)
   * @returns {Promise<void>}
   */
  async delete(userId) {
    const recordId = this.conditions.id;
    if (!recordId) {
      throw new Error('Record ID required for delete (use .where("id", recordId))');
    }

    return this.db._request('DELETE', `/db/${this.tableName}/${recordId}`, {
      userId
    });
  }

  /**
   * Count records (currently returns all and counts - can be optimized)
   * @returns {Promise<number>}
   */
  async count() {
    const results = await this.get();
    return results.length;
  }
}

module.exports = TableQuery;
