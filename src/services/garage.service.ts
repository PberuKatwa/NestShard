import { Inject, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import path from 'path';
import { S3_CLIENT } from '../storage/garage.storage';
import { APP_LOGGER } from 'src/logger/logger.provider';
import type { AppLogger } from '../logger/winston.logger';

@Injectable()
export class GarageService {
  private readonly bucket: string;

  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    private readonly configService: ConfigService,

    @Inject(APP_LOGGER) private readonly logger:AppLogger

  ) {
    const bucket = this.configService.get<string>('garageBucket');
    if (!bucket) throw new Error(`No s3 bucket was found`);
    this.bucket = bucket
  }

  async uploadFile(file: Express.Multer.File) {

    try{

      this.logger.info(`Beginning upload of file from garage service`)

      const bucket = this.configService.get<string>('garageBucket');
      const timestamp = Date.now();
      const ext = path.extname(file.originalname)
      const key = `${randomUUID()}-${timestamp}${ext}`

      this.logger.warn(`Attempting upload of file:${key} and bucket:${bucket}`)

      await this.s3.send(
        new PutObjectCommand({
          Bucket:bucket,
          Key:key,
          Body:file.buffer,
          ContentType:file.mimetype
        })
      )

      this.logger.info(`Successfully uploaded file:${key}`)

      return {
        key,
        size:file.size,
        mimeType:file.mimetype
      }

    }catch(error:any){
      throw error;
    }
  }

  async listFiles() {
    try {

      this.logger.info(`Attempting to list files from s3.`)
      const response = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: this.bucket
        })
      )

      console.log("filessss", response)

      if (!response.Contents || response.Contents.length === 0) throw new Error(`No files found in the bucket:${this.bucket}.`)

      const files = response.Contents.map(
        function (file) {
          return {
            key: file.Key,
            lastModified: file.LastModified,
            etag: file.ETag,
            size: file.Size,
            storageClass:file.StorageClass
          }
        }
      )

      this.logger.info(`Files of length:${files.length} were found in bucket:${this.bucket}`)

      return files


    } catch (error) {
      throw error;
    }
  }
}
