import { Get, Controller, Res, Req, Inject, Post, Param, UseGuards } from "@nestjs/common";
import { GarageService } from "../garage/garage.service";
import type { Response, Request } from "express";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";
import type { ApiResponse } from "src/types/api.types";
import { AuthGuard } from "../auth/guards/auth.guard";
import { FilesModel } from "./files.model";
import { CurrentUser } from "../users/decorators/user.decorator";
import { SingleFileAPiResponse,File } from "src/types/files.types";


@Controller('files')
@UseGuards(AuthGuard)
export class FilesController{

  constructor(
    private readonly garageService: GarageService,
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly files:FilesModel
  ) { }

  @Post('upload')
  async handleUpload(@Req() req: Request, @CurrentUser() currentUser: any):Promise<SingleFileAPiResponse> {

      const fileSize = parseInt(req.headers['content-length'] || '0');
      const busboy = require('busboy')({ headers: req.headers });

      if (fileSize > 20 * 1024 * 1024) throw new Error(`File is too large, maximum size is 20MB`);
      if (!req.headers['content-type']?.includes('multipart/form-data')) throw new Error(`Invalid file format`);

      return new Promise(
        (resolve, reject) => {
          busboy.on('file', async (name, fileStream, info) => {
            try {

              const { filename, mimeType } = info;
              const chunks: Buffer[] = [];
              for await (const chunk of fileStream) {
                chunks.push(chunk);
              }

              const mockFile = {
                buffer: Buffer.concat(chunks),
                originalname: filename,
                mimetype: mimeType,
                size: fileSize
              } as Express.Multer.File;

              const { key } = await this.garageService.uploadFile(mockFile);
              const file:File = await this.files.saveFile(currentUser.userId, filename, key, fileSize, mimeType);

              const response: SingleFileAPiResponse = {
                success: true,
                message: `Successfully uploaded large file with key:${key}.`,
                data:file
              }

              resolve(response);
            } catch (error) {
              reject(error);
            }
          })

          busboy.on('error', (error) => reject(error));
          req.pipe(busboy);
        }
      )
  }

  @Post('upload/multi-stream')
  async handleMultiUpload(@Req() req: Request, @CurrentUser() currentUser:any) {
    const fileSize = parseInt(req.headers['content-length'] || '0');
    const busboy = require('busboy')({ headers: req.headers });

    return new Promise((resolve, reject) => {

      busboy.on('file', async (name, fileStream, info) => {
        try {

          const { filename, mimeType } = info;

          if (fileSize > 100 * 1024 * 1024) {

            const key = await this.garageService.uploadMultiPart(fileStream, filename, mimeType);

            const file2 = await this.files.saveFile(currentUser.userId, filename, key, fileSize, mimeType);
            console.log("fileeee", file2);
            console.log("fileeee", file2);

            const response: ApiResponse = {
              success: true,
              message: `Successfully uploaded large file with key:${key}.`,
              data: {
                key: key,
                fileSize:fileSize
              }
            }
            resolve(response);

          } else {

            const chunks: Buffer[] = [];

            for await (const chunk of fileStream) {
              chunks.push(chunk);
            }

            const mockFile = {
              buffer: Buffer.concat(chunks),
              originalname: filename,
              mimetype: mimeType,
              size: fileSize
            } as Express.Multer.File;

            const { key } = await this.garageService.uploadFile(mockFile);

            const file2 = await this.files.saveFile(currentUser.userId, filename, key, fileSize, mimeType);
            console.log("fileeee", file2);
            console.log("fileeee", file2);

            const response: ApiResponse = {
              success: true,
              message: `Successfully uploaded large file with key:${key}.`,
              data: {
                key: key,
                fileSize:fileSize
              }
            }

            resolve(response);

          }
        } catch (err) {
          reject(err);
        }
      });

      busboy.on('error', (err) => reject(err));

      req.pipe(busboy);
    });
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

  @Post('upload/stream')
  async upload(@Req() req: Request, @Res() res:Response) {
    try {
      const busboy = require('busboy')({ headers: req.headers });

      await new Promise(
        (resolve, reject) =>{
          busboy.on('file',(name, fileStream, info)=> {
            const { filename, mimeType } = info;
            this.garageService.uploadMultiPart(fileStream, filename, mimeType)
              .then(resolve)
              .catch(reject);
          });
          req.pipe(busboy);
        }
      )

      const response: ApiResponse = {
        success: true,
        message:`Successfully uploaded large files`
      }

      return res.status(200).json(response)

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
