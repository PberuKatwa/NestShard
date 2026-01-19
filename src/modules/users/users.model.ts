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
    private readonly pgConfig: PostgresConfig,
    pool:Pool
  ) {
    this.pool = PostgresConfig.getPool()
  }

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

      await this.pool?.query(query)

    } catch (error) {
      throw error;
    }
  }

}
