import { Inject, Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { PostgresConfig } from "src/databases/postgres.config";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";
import { property } from "src/types/properties.types";

@Injectable()
export class PropertiesModel {
  private readonly pool: Pool;

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly pgConfig:PostgresConfig
  ) {
  };

  async createTable() {
    try {

      this.logger.warn(`Attempting to create properties table.`)
      // CREATE TYPE property_status AS ENUM('ACTIVE','TRASH','PENDING');

      const query = `

        CREATE TABLE IF NOT EXISTS properties(
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          price BIGINT NOT NULL,
          is_rental BOOLEAN DEFAULT TRUE,
          image_url VARCHAR NOT NULL,
          location TEXT NOT NULL,
          description TEXT NOT NULL,
          status property_status DEFAULT 'ACTIVE',
          created_by INTEGER,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

          FOREIGN KEY (created_by)
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

      `;

      const pgPool = this.pgConfig.getPool();
      await pgPool.query(query)
      this.logger.info(`Successfully created properties table.`)
      return 'properties'

    } catch (error) {
      throw error;
    }
  }

  async createProperty(
    name: string,
    price: number,
    isRental: boolean,
    imageUrl: string,
    location: string,
    description: string,
    userId:number
  ) {
    try {

      this.logger.warn(`Attempting to create property`)

      const query = `
        INSERT INTO properties ( name, price, is_rental, image_url, location, description, created_by )
        VALUES ( $1, $2, $3, $4, $5, $6, $7 )
        RETURNING id, name, image_url, description;
      `;

      const pgPool = this.pgConfig.getPool();
      const result = await pgPool.query(query, [name, price, isRental, imageUrl, location, description, userId]);
      const property = result.rows[0];

      this.logger.info(`Successfully created property`);

      return property;


    } catch (error) {
      throw error;
    }
  }

  async getAllProperties():Promise < Array<property> >{
    try {

      this.logger.warn(`Trying to fetch all properties from database.`)

      const query = ` SELECT name,price,is_rental,image_url,location,description FROM properties; `;
      const pgPool = this.pgConfig.getPool();
      const result = await pgPool.query(query);
      const properties:Array<property> = result.rows;

      this.logger.info(`Successfully fetched properties`)
      return properties;

    } catch (error) {
      throw error;
    }
  }

}
