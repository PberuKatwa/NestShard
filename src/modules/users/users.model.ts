import { Inject, Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { PostgresConfig } from "src/databases/postgres.config";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";
import * as bcrypt from "bcrypt";

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
          email TEXT NOT NULL UNIQUE,
          password VARCHAR NOT NULL,
          access_token TEXT,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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
      `;

      const pgPool = this.pgConfig.getPool();
      await pgPool.query(query);
      this.logger.info(`Successfully created users table`);

      return "users";

    } catch (error) {
      throw error;
    }
  }

  async createUser( firstName:string, lastName:string, email:string, password:string ):Promise<any> {
    try {

      this.logger.warn(`Atttempting to create user with name:${firstName} with email:${email}.`)

      const hashedPassword = await bcrypt.hash(password, 10)

      const query = `
        INSERT INTO users ( first_name, last_name, email, password )
        VALUES( $1, $2, $3, $4 )
        RETURNING id, first_name, last_name, email;
      `

      const pgPool = this.pgConfig.getPool();
      const result = await pgPool.query(query, [firstName, lastName, email.toLowerCase(), hashedPassword ]);
      const user = result.rows[0]

      this.logger.info(`Successfully created user`)

      return user

    } catch (error) {
      throw error;
    }
  }

  async validateUserPassword( email:string, password:string ):Promise<boolean> {
    try {

      const query = `SELECT email, password FROM users WHERE email =$1;`;

      const pgPool = this.pgConfig.getPool()
      const result = await pgPool.query(query, [email])
      const user = result.rows[0];

      if (!user) throw new Error(`Invalid email or password`)
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) throw new Error(`Invalid password`);

      return true

    } catch (error) {
      throw error;
    }
  }

}
