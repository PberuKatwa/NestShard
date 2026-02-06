/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.addColumn('users', {
    file_id: {
      type: 'integer',
      notNull: false,
      references: '"files"',
      onDelete: 'SET NULL',
    },
  });

  pgm.addColumn('blogs', {
    file_id: {
      type: 'integer',
      notNull: false,
      references: '"files"',
      onDelete: 'SET NULL',
    },
  });

  pgm.addColumn('properties', {
    file_id: {
      type: 'integer',
      notNull: false,
      references: '"files"',
      onDelete: 'SET NULL',
    },
  });

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.dropColumn('users', 'file_id');
  pgm.dropColumn('properties', 'file_id');
  pgm.dropColumn('blogs', 'file_id');
};
