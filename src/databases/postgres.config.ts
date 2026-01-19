import { Inject, Injectable } from "@nestjs/common";
import { Pool, PoolConfig } from "pg";
import { APP_LOGGER } from 'src/logger/logger.provider';
import type { AppLogger } from '../logger/winston.logger';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PostgresConfig {

  private static pool: Pool | null = null;

  constructor(
    private readonly configService: ConfigService,
    @Inject(APP_LOGGER) private readonly logger: AppLogger
  ) { }

  async connect(): Promise<Pool> {
    try {

      if (PostgresConfig.pool) {
        return PostgresConfig.pool;
      }

      this.logger.info(`Connecting to PostgreSQL: ${this.configService.get<string>('pgHost')}:${this.configService.get<string>('pgPort')}`);

      const poolConfig: PoolConfig = {
        user: this.configService.get<string>('pgUser'),
        host: this.configService.get<string>('pgHost'),
        database: this.configService.get<string>('pgDatabase'),
        password: this.configService.get<string>('pgPassword'),
        port: Number(this.configService.get<string>('pgPort') ),
      };

      const pool = new Pool(poolConfig);

      const client = await pool.connect();
      await client.query("SELECT 1");
      client.release();

      PostgresConfig.pool = pool;
      this.logger.info(`PostgreSQL successfully connected`);
      return PostgresConfig.pool;
    } catch (error) {
      throw error;
    }
  }


  static getPool(): Pool {
    if (!PostgresConfig.pool) {
      throw new Error("Postgres pool has not been initialized. Call connect() first.");
    }
    return PostgresConfig.pool;
  }

}
