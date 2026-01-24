import { Injectable,Inject } from "@nestjs/common";
import { Pool } from "pg";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";

@Injectable()
export class BlogModel{

  private readonly pgPool:Pool;
  constructor(
    @Inject(APP_LOGGER) private readonly logger:AppLogger,
    pgPool:Pool
  ) {
    this.pgPool = pgPool;
  }

  async createTable() {

    this.logger.warn(`Attempting to create blogs table`);
    const query = `

      CREATE TABLE blogs IF NOT EXISTS(
        id SERIAL PRIMARY KEY,
        title VARCHAR(240) NOT NULL,
        author_id INTEGER NOT NULL,
        slug VARCHAR(240),
        created_at TIMESTAMPZ NOT NULL,
        updated_at TIMESTAMPZ NOT NULL
      )

    `

  }

}
