/**
 * @justcopy/auth - Authentication client for JustCopy published applications
 *
 * @example
 * const { JustCopyAuth } = require('@justcopy/auth');
 * const auth = new JustCopyAuth();
 *
 * // Register
 * const { user, token } = await auth.register({
 *   email: 'user@example.com',
 *   password: 'password123',
 *   name: 'John Doe'
 * });
 *
 * // Login
 * const { user, token } = await auth.login({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 *
 * // Verify token
 * const user = await auth.verify(token);
 *
 * // Logout
 * await auth.logout(token);
 */

const JustCopyAuth = require('./lib/client');

module.exports = {
  JustCopyAuth,
  // Export for named imports
  default: JustCopyAuth
};
