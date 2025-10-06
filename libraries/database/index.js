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
 * // Auth
 * const { user, token } = await db.auth.register({
 *   email: 'user@example.com',
 *   password: 'password123',
 *   name: 'John Doe'
 * });
 *
 * // Database
 * const items = await db.table('items')
 *   .where('userId', user.userId)
 *   .get();
 */

const JustCopyDB = require('./lib/client');

module.exports = {
  JustCopyDB,
  // Export for named imports
  default: JustCopyDB
};
