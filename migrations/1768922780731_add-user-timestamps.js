/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
 export const up = (pgm) => {
   // First add the columns if they don't exist
   pgm.addColumn('users', {
     created_at: {
       type: 'TIMESTAMPTZ',
       notNull: true,
       default: pgm.func('CURRENT_TIMESTAMP'),
     },
   });

   pgm.addColumn('users', {
     updated_at: {
       type: 'TIMESTAMPTZ',
       notNull: true,
       default: pgm.func('CURRENT_TIMESTAMP'),
     },
   });

   // Create function to update updated_at
   pgm.sql(`
     CREATE OR REPLACE FUNCTION update_updated_at_column()
     RETURNS TRIGGER AS $$
     BEGIN
       NEW.updated_at = CURRENT_TIMESTAMP;
       RETURN NEW;
     END;
     $$ language 'plpgsql';
   `);

   // Create trigger
   pgm.sql(`
     CREATE TRIGGER update_users_updated_at
     BEFORE UPDATE ON users
     FOR EACH ROW
     EXECUTE FUNCTION update_updated_at_column();
   `);
 };

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
 export const down = (pgm) => {
   // Drop trigger first
   pgm.sql(`DROP TRIGGER IF EXISTS update_users_updated_at ON users;`);
   pgm.sql(`DROP FUNCTION IF EXISTS update_updated_at_column;`);

   // Then drop columns
   pgm.dropColumn('users', 'updated_at');
   pgm.dropColumn('users', 'created_at');
 };
