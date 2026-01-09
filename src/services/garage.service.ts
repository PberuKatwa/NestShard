import { Inject, Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import path from 'path';
import { S3_CLIENT } from '../storage/garage.storage';
import { APP_LOGGER } from 'src/logger/logger.provider';
import type { AppLogger } from "../logger/winston.logger"

@Injectable()
export class GarageService {
  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    private readonly configService: ConfigService,

    @Inject(APP_LOGGER) private readonly logger:AppLogger
  ) {}

  async uploadFile(file: Express.Multer.File) {

    try{

      const bucket = this.configService.get<string>('garageBucket');
      const timestamp = Date.now();
      const ext = path.extname(file.originalname)
      const key = `${randomUUID()}-${timestamp}.${ext}`

      await this.s3.send(
        new PutObjectCommand({
          Bucket:bucket,
          Key:key,
          Body:file.buffer,
          ContentType:file.mimetype
        })
      )

      return {
        key,
        size:file.size,
        mimeType:file.mimetype
      }

    }catch(error:any){
      throw error;
    }
}
}
