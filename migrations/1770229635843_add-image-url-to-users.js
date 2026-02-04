/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
 exports.up = (pgm) => {
   pgm.addColumn('users', {
     image_url: {
       type: 'varchar(2048)', // Standard length for long URLs
       notNull: false         // This makes it nullable
     },
   });
 };

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
 exports.down = (pgm) => {
   pgm.dropColumn('users', 'image_url');
 };
