import { Get, Controller, Res, Req, Inject, Post, UploadedFile, UseInterceptors, Param } from "@nestjs/common";
import { GarageService } from "src/services/garage.service";
import type { Response, Request } from "express";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";
import type { ApiResponse } from "src/types/api.types";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('files')
export class FilesController{

  constructor(
    private readonly garageService: GarageService,
    @Inject(APP_LOGGER) private readonly logger: AppLogger
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFiles(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    try {

      if(!file){
        return res.status(404).json({
          success:false,
          message:'Please provide a file'
        })
      }

      const uploadResponse = await this.garageService.uploadFile(file)

      const response: ApiResponse = {
        success:true,
        message:`File with key:${uploadResponse.key} successfully uploaded`,
        data:uploadResponse
      }

      return res.status(200).json(response)

    } catch (error) {
      this.logger.error(`Error in uploading file`, error)

      const response: ApiResponse<Array<any> > = {
        success: false,
        message:error.message
      }

      return res.status(500).json(response)
    }

  }

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

  @Get(':key')
  async getFile(
    @Param('key') key: string,
    @Res() res: Response,
  ) {

    try {

      const file = await this.garageService.fetchFileByKey(key);

      res.setHeader('Content-Type', file.contentType || 'application/octet-stream');
      res.setHeader('Content-Length', file.contentLength);
      res.setHeader('Content-Disposition', `inline; filename="${key}"`);
      file.stream.pipe(res);

    } catch (error) {

      this.logger.error(`Error in fetching files by key`, error)
      const response: ApiResponse<Array<any> > = {
        success: false,
        message:error.message
      }

      return res.status(500).json(response)
    }
  }


}
