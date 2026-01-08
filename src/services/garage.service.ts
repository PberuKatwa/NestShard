import { Inject, Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { S3_CLIENT } from '../storage/garage.storage';

@Injectable()
export class GarageService {
  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    const bucket = this.configService.get<string>('garageBucket');

    const key = `${randomUUID()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      key,
      size: file.size,
      mimeType: file.mimetype,
    };
  }
}
