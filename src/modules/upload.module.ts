import { Module } from '@nestjs/common';
import { UploadController } from '../controllers/upload.controller';
import { GarageModule } from '../modules/garage.module';
import { AppLoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [GarageModule, AppLoggerModule],
  controllers: [UploadController],
})
export class UploadModule {}
