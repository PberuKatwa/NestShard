import { Injectable,Inject } from "@nestjs/common";
import { Pool } from "pg";
import { PostgresConfig } from "src/databases/postgres.config";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";
import { AllBlogs, Blog, BlogPayload, CreateBlogPayload, FullBlog } from "src/types/blog.types";

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
          file_id INTEGER,
          slug VARCHAR(240),
          content TEXT NOT NULL,
          status row_status DEFAULT 'active',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

          FOREIGN KEY(author_id)
            REFERENCES users(id)
            ON DELETE SET NULL,

          FOREIGN KEY(file_id)
            REFERENCES files(id)
            ON DELETE SET NULL

        );

        DROP TRIGGER IF EXISTS update_blog_timestamp ON blogs;
        CREATE TRIGGER update_blog_timestamp
        BEFORE UPDATE ON blogs
        FOR EACH ROW
        EXECUTE FUNCTION set_timestamp();

      `

      await this.pgConfig.getPool().query(query)
      this.logger.info(`Successfully created blogs table.`)

      return "blogs"

    } catch (error) {
      throw error;
    }
  }

  async createBlog( payload:CreateBlogPayload):Promise<Blog> {
    try {
      this.logger.warn(`Attempting to create blog post`)

      const { title, authorId, content, fileId } = payload;
      const query = `
        INSERT INTO blogs (title,author_id,content, file_id)
        VALUES($1,$2,$3,$4)
        RETURNING id,title;
      `

      const pool = this.pgConfig.getPool();
      const result = await pool.query(query,[title,authorId,content,fileId]);
      const blog:Blog = result.rows[0];

      this.logger.info(`Successfully created blog`)

      return blog;
    } catch (error) {
      throw error;
    }
  }

  async getAllBlogs( pageInput:number, limitInput:number ):Promise<AllBlogs> {
    try {

      this.logger.warn(`Attempting to fetch blogs from page:${pageInput} and limit:${limitInput}`);

      const page = pageInput ? pageInput : 1;
      const limit = limitInput ? limitInput : 10;
      const offset = (page -1) * limit

      const dataQuery = `
      SELECT
        b.id,
        b.title,
        b.author_id,
        b.content,
        b.file_id
        f.file_url as file_url
      FROM blogs b
      LEFT JOIN files f ON b.file_id = f.id
      WHERE b.status!= 'trash'
      ORDER BY b.created_at DESC
      LIMIT $1 OFFSET $2;
      `;
      const countQuery = `SELECT COUNT (*)
        FROM blogs
        WHERE status!= 'trash';
      `;

      const pgPool = this.pgConfig.getPool()
      const [dataResult, paginationResult] = await Promise.all([
        pgPool.query(dataQuery, [limit, offset]),
        pgPool.query(countQuery)
      ])

      const totalCount = parseInt(paginationResult.rows[0].count)

      this.logger.info(`Successfully fetched ${totalCount} blogs`)

      return {
        blogs: dataResult.rows,
        pagination: {
          totalCount: totalCount,
          currentPage: page,
          totalPages:Math.ceil(totalCount/limit)
        }
      }

    } catch (error) {
      throw error;
    }
  }

  async getBlog(blogId: number):Promise<FullBlog> {
    try {

      this.logger.warn(`Attempting to fetch blog with id:${blogId}`)

      const pgPool = this.pgConfig.getPool();
      const result = await pgPool.query(`
        SELECT
          b.id,
          b.title,
          b.author_id,
          b.content,
          b.file_id,
          f.file_url as file_url
        FROM blogs b

        WHERE id=$1 AND status!= 'trash' ;`,
        [blogId]
      );
      const blog:FullBlog = result.rows[0];

      if (!blog || blog === undefined) throw new Error(`No blog was found`);

      this.logger.info(`Successfully fetched individual blog`)

      return blog;

    } catch (error) {
      throw error;
    }
  }

  async updateBlog(blogId: number, title:string, content:string):Promise<Blog> {
    try {
      this.logger.warn(`Attempting to update blog`)

      const pgPool = this.pgConfig.getPool();
      const query = ` UPDATE blogs SET title=$1, content=$2 WHERE id=$3
                      RETURNING id,title,author_id,content,image_url ;
                    `;
      const result = await pgPool.query(query, [title, content, blogId]);
      const blog = result.rows[0];
      this.logger.info(`Successfully updated blogs`)

      return blog;

    } catch (error) {
      throw error;
    }

  }

  async trashBlog(id:number):Promise<Blog> {
    try {

      this.logger.warn(`Attempting to trash blog with id:${id}`)
      const pool = this.pgConfig.getPool();
      const query = ` UPDATE blogs SET status=$1 WHERE id=$2
        RETURNING id,title,author_id,content,image_url ;
        `;
      const result = await pool.query(query, ['trash', id]);
      const blog:Blog = result.rows[0];
      this.logger.info(`Successfully trashed blog`)

      return blog
    } catch (error) {
      throw error;
    }
  }

}
