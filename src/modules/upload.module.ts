import { Module } from '@nestjs/common';
import { UploadController } from '../controllers/upload.controller';
import { GarageModule } from '../modules/garage.module';

@Module({
  imports: [GarageModule],
  controllers: [UploadController],
})
export class UploadModule {}
