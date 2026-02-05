import { Inject, Injectable } from "@nestjs/common";
import { PostgresConfig } from "src/databases/postgres.config";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";
import { File } from "../../types/files.types";

@Injectable()
export class FilesModel {
  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly pgConfig: PostgresConfig,
  ) {}

  async createTable(): Promise<string> {
    try {
      this.logger.warn(`Attempting to create files table`);

      const query = `
        CREATE TABLE IF NOT EXISTS files (
          id SERIAL PRIMARY KEY,
          uploaded_by INTEGER NOT NULL,
          file_name TEXT NOT NULL,
          file_url TEXT NOT NULL,
          file_size BIGINT NOT NULL,
          mime_type TEXT,
          status row_status DEFAULT 'active',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

          FOREIGN KEY (uploaded_by)
            REFERENCES users(id)
            ON DELETE SET NULL
        );

        DROP TRIGGER IF EXISTS update_files_timestamp ON files;

        CREATE TRIGGER update_files_timestamp
        BEFORE UPDATE ON files
        FOR EACH ROW
        EXECUTE FUNCTION set_timestamp();
      `;

      const pgPool = this.pgConfig.getPool();
      await pgPool.query(query);
      this.logger.info(`Successfully created files table`);

      return "files";
    } catch (error) {
      this.logger.error(`Failed to create files table: ${error.message}`);
      throw error;
    }
  }

  async saveFile(userId:Number, fileName:string, fileUrl:string, fileSize:number, mimeType:string): Promise<File> {
    try {
      this.logger.warn(`Storing metadata for file: ${fileName}`);

      const query = `
        INSERT INTO files (user_id, file_name, file_url, file_size, mime_type)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, user_id , file_name,file_url, file_size, mime_type;
      `;

      const pgPool = this.pgConfig.getPool();
      const result = await pgPool.query(query, [userId, fileName, fileUrl, fileSize, mimeType]);
      const file:File = result.rows[0];

      this.logger.info(`File metadata saved successfully with ID.`);
      return file;
    } catch (error) {
      this.logger.error(`Error saving file metadata: ${error.message}`);
      throw error;
    }
  }

  async fetchFilesByUserId(userId: number): Promise<AppFile[]> {
    try {
      const query = `
        SELECT id, user_id as "userId", file_name as "fileName",
               file_url as "fileUrl", file_size as "fileSize",
               mime_type as "mimeType", status, created_at as "createdAt"
        FROM files
        WHERE user_id = $1 AND status = 'active'
        ORDER BY created_at DESC;
      `;

      const pgPool = this.pgConfig.getPool();
      const result = await pgPool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      this.logger.error(`Error fetching files for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(id: number): Promise<boolean> {
    try {
      // Soft delete approach to match your 'row_status' pattern
      const query = `UPDATE files SET status = 'deleted' WHERE id = $1`;
      const pgPool = this.pgConfig.getPool();
      await pgPool.query(query, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
