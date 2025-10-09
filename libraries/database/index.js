/**
 * @justcopy/database - Database client for JustCopy published applications
 *
 * @example
 * const { JustCopyDB } = require('@justcopy/database');
 * const db = new JustCopyDB();
 *
 * // Define schemas
 * await db.defineTable('users', {
 *   indexes: {
 *     email: 'unique',
 *     status: 'filter'
 *   }
 * });
 *
 * // Database operations
 * const items = await db.table('items')
 *   .where('userId', user.userId)
 *   .get();
 *
 * // For authentication, use @justcopy/auth package
 * const { JustCopyAuth } = require('@justcopy/auth');
 * const auth = new JustCopyAuth();
 * const { user, token } = await auth.register({ email, password, name });
 */

const JustCopyDB = require('./lib/client');

module.exports = {
  JustCopyDB,
  // Export for named imports
  default: JustCopyDB
};
