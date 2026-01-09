import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Inject,
  Res
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GarageService } from '../services/garage.service';
import { APP_LOGGER } from 'src/logger/logger.provider';
import type { AppLogger } from 'src/logger/winston.logger';
import type { Response } from 'express';

@Controller('uploads')
export class UploadController {
  constructor(
    private readonly garageService: GarageService,
    @Inject(APP_LOGGER) private readonly logger:AppLogger
    
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File , @Res() res:Response,
  ) {
    try{

      if(!file){
        return res.status(404).json({
          success:false,
          message:'Please provide a file'
        })
      }

      const fileResponse = await this.garageService.uploadFile(file);

      return res.status(200).json({
        success:true,
        message:`File with key:${fileResponse.key} successfully uploaded`,
        data:fileResponse
      })

    }catch(error){
      this.logger.error(`Error in uploading file`, error)
      return res.status(500).json({
        success:true,
        message:error.message
      })
    }

  }
}
