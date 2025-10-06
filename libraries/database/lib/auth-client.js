/**
 * AuthClient - Handles authentication operations
 */
class AuthClient {
  constructor(db) {
    this.db = db;
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
    return this.db._request('POST', '/auth/register', {
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
    return this.db._request('POST', '/auth/login', {
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
      const result = await this.db._request('POST', '/auth/verify', { token });
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
    return this.db._request('POST', '/auth/logout', { token });
  }

  /**
   * Get current user from token (alias for verify)
   * @param {string} token - Auth token
   * @returns {Promise<Object|null>}
   */
  async me(token) {
    return this.verify(token);
  }
}

module.exports = AuthClient;
