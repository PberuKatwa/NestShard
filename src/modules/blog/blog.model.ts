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

  async getAllBolgs( pageInput:number, limitInput:number ) {
    try {

      this.logger.warn(`Attempting to fetch all blogs`);

      const page = pageInput ? pageInput : 1;
      const limit = limitInput ? limitInput : 10;

      const dataQuery = `
      SELECT id, title, author_id,content
      FROM blogs
      ORDER BY created_at ASC
      LIMIT $1 OFFSET $2;
      `;
      const countQuery = `SELECT COUNT (*) FROM blogs;`;

      const pgPool = this.pgConfig.getPool()
      const [dataResult, paginationResult] = await Promise.all([
        pgPool.query(dataQuery, [page, limit]),
        pgPool.query(countQuery)
      ])

      const totalCount = parseInt(paginationResult.rows[0].count)

      this.logger.info(`Successfully fetched ${paginationResult.rows[0].count} blogs`)

      return {
        blogs: dataResult.rows,
        totalCount: totalCount,
        currentPage: page,
        totalPages:Math.ceil(totalCount/limit)
      }

    } catch (error) {
      throw error;
    }
  }

  async getBlog(blogId: number) {
    try {

      this.logger.warn(`Attempting to fetch blog with id:${blogId}`)

      const pgPool = this.pgConfig.getPool();
      const result = await pgPool.query(`SELECT id,title,author_id,content FROM blogs WHERE id=$1;`, [blogId])
      const blog = result.rows[0];

      return blog;

    } catch (error) {
      throw error;
    }
  }

  async updateBlog(blogId: number, title:string, content:string) {
    try {
      this.logger.warn(`Attempting to update blog`)

      const pgPool = this.pgConfig.getPool();
      const query = ` UPDATE blogs SET title=$1, content=$2 WHERE id=$3 RETURNING id,title,content; `;
      const result = await pgPool.query(query, [title, content, blogId]);
      const blog = result.rows[0];

      return blog;

    } catch (error) {
      throw error;
    }
  }

}
