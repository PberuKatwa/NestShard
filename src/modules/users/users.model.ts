import { Inject, Injectable } from "@nestjs/common";
import { PostgresConfig } from "src/databases/postgres.config";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";

@Injectable()
export class UsersModel{

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly pgConfig:PostgresConfig
  ) { }

  async createTable():Promise<string> {
    try {

      this.logger.warn(`Attempting to create users table`)

      const query = `
        CREATE TABLE IF NOT EXISTS users(
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT,
          password VARCHAR NOT NULL,
        );
      `

    } catch (error) {
      throw error;
    }
  }

}
