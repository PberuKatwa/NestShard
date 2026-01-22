import { Inject, Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { PostgresConfig } from "src/databases/postgres.config";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";

@Injectable()
export class PropertiesModel {
  private readonly pool: Pool;

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly pgConfig:PostgresConfig
  ) {
    this.pool = this.pgConfig.getPool()
  };

  async createTable( name:string, price:number, imageUrl:string, location:string, description:string, size:string ) {

  }

}
