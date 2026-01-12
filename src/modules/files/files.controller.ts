import { Get, Controller,Res, Inject } from "@nestjs/common";
import { GarageService } from "src/services/garage.service";
import type { Response } from "express";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";
import type { ApiResponse } from "src/types/api.types";

@Controller('files')
export class FilesController{

  constructor(
    private readonly garageService: GarageService,
    @Inject(APP_LOGGER) private readonly logger: AppLogger
  ) {}

  @Get()
  async listS3Files( @Res() res:Response ) {
    try {
      const files = await this.garageService.listFiles()

      const response: ApiResponse< Array<any>  > = {
        success: true,
        message: `Successfully fetched files of length:${files.length}`,
        data:files
      }

      return res.status(200).json(response)
    } catch (error) {

      this.logger.error(`Error in listing S3 files form bucket`, error)
      const response: ApiResponse<Array<any> > = {
        success: false,
        message:error.message
      }

      return res.status(500).json(response)
    }
  }

}
