export const up = (pgm) => {
  // 1. First, set the DEFAULT for future rows
  pgm.alterColumn('users', 'created_at', {
    default: pgm.func('CURRENT_TIMESTAMP'),
  });
  pgm.alterColumn('users', 'updated_at', {
    default: pgm.func('CURRENT_TIMESTAMP'),
  });

  // 2. BACKFILL: Update existing rows that have NULL values
  // This satisfies the "NOT NULL" requirement coming next
  pgm.sql(`UPDATE "users" SET "created_at" = NOW() WHERE "created_at" IS NULL;`);
  pgm.sql(`UPDATE "users" SET "updated_at" = NOW() WHERE "updated_at" IS NULL;`);

  // 3. Now apply the NOT NULL constraint safely
  pgm.alterColumn('users', 'created_at', { notNull: true });
  pgm.alterColumn('users', 'updated_at', { notNull: true });

  // 4. Create or Update the Function
  pgm.sql(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  // 5. Setup the Trigger
  pgm.sql(`DROP TRIGGER IF EXISTS update_users_updated_at ON users;`);
  pgm.sql(`
    CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TRIGGER IF EXISTS update_users_updated_at ON users;`);
  pgm.alterColumn('users', 'created_at', { notNull: false, default: null });
  pgm.alterColumn('users', 'updated_at', { notNull: false, default: null });
};
