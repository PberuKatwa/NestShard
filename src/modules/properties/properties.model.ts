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

      const query = `

        CREATE TABLE IF NOT EXISTS properties(
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          price BIGINT NOT NULL,
          is_rental BOOLEAN DEFAULT TRUE,
          image_url VARCHAR NOT NULL,
          location TEXT NOT NULL,
          description TEXT NOT NULL,
          status row_status DEFAULT 'active',
          created_by INTEGER,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

          FOREIGN KEY (created_by)
            REFERENCES users(id)
            ON DELETE SET NULL
        );

        DROP TRIGGER IF EXISTS update_properties_timestamp ON properties;

        CREATE TRIGGER update_properties_timestamp
        BEFORE UPDATE ON properties
        FOR EACH ROW
        EXECUTE FUNCTION set_timestamp();

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

  async getAllProperties( pageInput:number, limitInput:number ){
    try {

      this.logger.warn(`Trying to fetch all properties from database.`)
      const page = pageInput ? pageInput : 1;
      const limit = limitInput ? limitInput : 10;
      const offset = (page -1) * limit

      const dataQuery = ` SELECT id,name,price,is_rental,image_url,location,description
        FROM properties
        WHERE status!= 'trash'
        ORDER BY id ASC
        LIMIT $1 OFFSET $2;
      `;
      const countQuery = `
        SELECT COUNT(*)
        FROM properties
        WHERE status!= 'trash';
      `;

      const pgPool = this.pgConfig.getPool();
      const [dataResult, countResult] = await Promise.all([
        pgPool.query(dataQuery, [limit, offset]),
        pgPool.query(countQuery)
      ]);

      this.logger.info(`Successfullly fetched properties`)
      return {
        properties: dataResult.rows,
        totalCount: parseInt(countResult.rows[0].count),
        currentPage: page,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
      };

    } catch (error) {
      throw error;
    }
  }

  async getProperty(id: number) {
    try {

      this.logger.warn(`Attempting to fetch blog with id:${id}`)

      const pgPool = this.pgConfig.getPool();
      const result = await pgPool.query(`
        SELECT id,name,price,is_rental,image_url,location,description
        FROM properties
        WHERE id=$1 AND status!= 'trash' ;
        `
        , [id])
      const property = result.rows[0];

      return property;

    } catch (error) {
      throw error;
    }
  }

  async trashProperty(id:number) {
    try {

      this.logger.warn(`Attempting to trash property with id:${id}`)
      const pool = this.pgConfig.getPool();
      const query = `
        UPDATE properties
        SET status=$1
        WHERE id=$2
        RETURNING id,name,price,is_rental,image_url,location,description,status ;
      `;
      const result = await pool.query(query, ['trash', id]);
      const property = result.rows[0];
      this.logger.info(`Successfully trashed property`)

      return property;
    } catch (error) {
      throw error;
    }
  }

  async updateProperty( id:number, name:string, price:number, description:string, imageUrl:string ) {
    try {

      this.logger.warn(`Attempting to update property`);

      const pool = this.pgConfig.getPool();
      const query = `
        UPDATE properties
        SET name=$1, price=$2, description=$3, image_url=$4
        WHERE id=$5
        RETURNING id,name,price,is_rental,image_url,location,description,status;
      `;

      const result = await pool.query(query,[name,price,description,imageUrl,id]);
      const property = result.rows[0];

      return property;
    } catch (error) {
      throw error;
    }
  }

}
