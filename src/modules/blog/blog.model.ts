import { Injectable,Inject } from "@nestjs/common";
import { Pool } from "pg";
import { PostgresConfig } from "src/databases/postgres.config";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";

@Injectable()
export class BlogModel{

  constructor(
    @Inject(APP_LOGGER) private readonly logger:AppLogger,
    private readonly pgConfig:PostgresConfig
  ) {}

  async createTable() {
    try {

      this.logger.warn(`Attempting to create blogs table`);
      const query = `

        CREATE TABLE IF NOT EXISTS blogs (
          id SERIAL PRIMARY KEY,
          title VARCHAR(240) NOT NULL,
          author_id INTEGER NOT NULL,
          slug VARCHAR(240),
          status property_status DEFAULT 'ACTIVE',
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL,

          FOREIGN KEY(author_id)
            REFERENCES users(id)
            ON DELETE SET NULL
        );

        -- Add trigger for automatic updated_at
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        DROP TRIGGER IF EXISTS update_users_updated_at ON users;
        CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `

      await this.pgConfig.getPool().query(query)
      this.logger.info(`Successfully created blogs table.`)

      return "blogs"

    } catch (error) {
      throw error;
    }
  }

}
