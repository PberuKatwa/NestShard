import { Inject, Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { PostgresConfig } from "src/databases/postgres.config";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";

@Injectable()
export class UsersModel{
  private readonly pool: Pool | null;

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly pgConfig: PostgresConfig
  ) { }

  async createTable():Promise<string> {
    try {

      this.logger.warn(`Attempting to create users table`)

      const query = `
        CREATE TABLE IF NOT EXISTS users(
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL,
          password VARCHAR NOT NULL,
          created_at TIMESTAMPTZ,
          updated_at TIMESTAMPTZ
        );
      `
      const pgPool = this.pgConfig.getPool();
      await pgPool.query(query);
      this.logger.info(`Successfully created users table`);

      return "users";

    } catch (error) {
      throw error;
    }
  }

}
