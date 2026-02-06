/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.dropColumn('users', 'image_url');
  pgm.dropColumn('blogs', 'image_url');
  pgm.dropColumn('properties', 'image_url');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.addColumn('users', { image_url: { type: 'varchar(2048)' } });
  pgm.addColumn('blogs', { image_url: { type: 'varchar(2048)' } });
  pgm.addColumn('properties', { image_url: { type: 'varchar(2048)' } });
};
