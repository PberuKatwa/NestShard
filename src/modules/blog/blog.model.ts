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
          content TEXT NOT NULL,
          status property_status DEFAULT 'ACTIVE',
          created_at TIMESTAMPTZ,
          updated_at TIMESTAMPTZ,

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

  async createBlog( title:string, authorId:number, content:string) {
    try {
      this.logger.warn(`Attempting to create blog post`)

      const query = `
        INSERT INTO blogs (title,author_id,content)
        VALUES($1,$2,$3)
        RETURNING id,title,author_id,content;
      `

      const pool = this.pgConfig.getPool();
      const result = await pool.query(query,[title,authorId,content]);
      const blog = result.rows[0];

      return blog;
    } catch (error) {
      throw error;
    }
  }

  async getAllBolgs( page:number, limit:number ) {
    try {

      this.logger.warn(`Attempting to fetch all blogs`);

      const dataQuery = `
      SELECT id, title, author_id,content
      FROM blogs
      ORDER BY created_at ASC
      LIMIT $1 OFFSET $2;
      `;

      const countQuery = ``;

    } catch (error) {
      throw error;
    }
  }

}
