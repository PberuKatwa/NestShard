import { Get, Controller,Res, Inject } from "@nestjs/common";
import { GarageService } from "src/services/garage.service";
import type { Response } from "express";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";

@Controller('files')
export class FilesController{

  private readonly garageService: GarageService;
  @Inject(APP_LOGGER) private readonly logger: AppLogger;

  constructor(
  ) {}

  @Get()
  async listS3Files( @Res() res:Response ) {
    try {
      const response = await this.garageService.listFiles()
      console.log(`This is the list response`)
    } catch (error) {
      this.logger.error(`Error in listing S3 files form bucket`, error)
      return res.status(500).json({
        success: false,
        message:error.message
      })
    }
  }

}
