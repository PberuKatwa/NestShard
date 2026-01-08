import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GarageService } from '../services/garage.service';

@Controller('uploads')
export class UploadController {
  constructor(private readonly garageService: GarageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.garageService.uploadFile(file);
  }
}
