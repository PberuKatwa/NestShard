import { Inject, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import path from 'path';
import { S3_CLIENT } from '../storage/garage.storage';
import { APP_LOGGER } from 'src/logger/logger.provider';
import type { AppLogger } from '../logger/winston.logger';
import type { listFilesRes, keyFileFetchRes } from 'src/types/storage.types';

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

  async uploadFile(file: Express.Multer.File): Promise<{
    key: string;
    size: number;
    mimeType: string;
  }> {

    try{

      this.logger.info(`Beginnning upload of file from garage service`)

      const timestamp = Date.now();
      const ext = path.extname(file.originalname)
      const key = `${randomUUID()}-${timestamp}${ext}`

      this.logger.warn(`Attempting upload of file:${key} and bucket:${this.bucket}`)

      await this.s3.send(
        new PutObjectCommand({
          Bucket:this.bucket,
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

  async listFiles():Promise< Array<listFilesRes> > {
    try {

      this.logger.info(`Attempting to list files from s3.`)
      const response = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: this.bucket
        })
      )

      if (!response.Contents || response.Contents.length === 0) throw new Error(`No files found in the bucket:${this.bucket}.`)

      const files = response.Contents.map(
        function (file) {

          if (!file.Key) throw new Error(`No file  key was found`)
          if (!file.LastModified) throw new Error(`No file LastModified was found`)
          if (!file.ETag) throw new Error(`No file ETag was found`)
          if (!file.Size) throw new Error(`No file Size was found`)
          if (!file.StorageClass) throw new Error(`No file StorageClass was found`)

          const fileData: listFilesRes = {
            key: file.Key,
            lastModified: file.LastModified,
            etag: file.ETag,
            size: file.Size,
            storageClass:file.StorageClass
          }
          return fileData

        }
      )

      this.logger.info(`Successfully fetched ${files.length} files from bucket:${this.bucket}`)

      return files

    } catch (error) {
      throw error;
    }
  }

  async fetchFileByKey(key: string): Promise< keyFileFetchRes > {
    try {

      this.logger.warn(`Attempting to fetch file from bucket:${this.bucket} with key:${key}`)
      const file = await this.s3.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key:key
        })
      )

      if (!file) throw new Error(`No file with key:${key} was found`)
      if (!file.Body) throw new Error(`No file body with key:${key} was found`)
      if (!file.ContentType) throw new Error(`No file content with key:${key} was found`)
      if (!file.ContentLength) throw new Error(`No file content length with key:${key} was found`)
      if (!file.LastModified) throw new Error(`No file LastModified with key:${key} was found`)

      this.logger.info(`Successfully fetched file with key:${key} for s3.`)

      return {
        stream: file.Body as Readable,
        contentType: file.ContentType,
        contentLength: file.ContentLength,
        lastModified:file.LastModified
      }

    } catch (error) {
      throw error;
    }
  }
}
