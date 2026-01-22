import {
  Body, Controller, Inject, Post, Req,
  Res, Get, HttpException, HttpStatus,
  UseGuards, UseInterceptors, UploadedFile,
  ParseFilePipe, MaxFileSizeValidator, FileTypeValidator
} from "@nestjs/common";
import type { Request, Response } from "express";
import type { AppLogger } from "src/logger/winston.logger";
import { APP_LOGGER } from "src/logger/logger.provider";
import { UsersModel } from "../users/users.model";
import type { ApiResponse } from "src/types/api.types";
import { AuthGuard } from "../auth/guards/auth.guard";
import { PropertiesModel } from "./properties.model";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('properties')
export class PropertyController{

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly properties:PropertiesModel
  ) { }

  @Post('')
  @UseInterceptors( FileInterceptor('image') )
  async createProperty(
    @Body() body:any,
    @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 5242880 }),
            new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
          ],
        }),
      )
      file: Express.Multer.File,
  ) {
    try {

      const { name, price, isRental, imageUrl, location, description } = body;

    } catch (error) {
      this.logger.error(`Error in creating property`, error)

      const response: ApiResponse = {
        success: false,
        message: `${error.message}`,
      }

      throw new HttpException(response,HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

}
