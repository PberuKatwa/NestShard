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
import { GarageService } from "../garage/garage.service";
import { CurrentUser } from "../users/decorators/user.decorator";
import { property } from "src/types/properties.types";


@Controller('properties')
export class PropertyController{

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly properties: PropertiesModel,
    private readonly garage: GarageService
  ) { }

  @Post('')
  @UseGuards(AuthGuard)
  @UseInterceptors( FileInterceptor('image') )
  async createProperty(
    @CurrentUser() user:any,
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

      const { name, price, isRental, location, description } = body;

      const { key } = await this.garage.uploadFile(file);
      const property = await this.properties.createProperty(name, price, isRental, key, location, description, user.userId)

      const response: ApiResponse = {
        success: true,
        message: "Successfully created property ",
        data:property
      }

      return response


    } catch (error) {
      this.logger.error(`Error in creating property`, error)

      const response: ApiResponse = {
        success: false,
        message: `${error.message}`,
      }

      throw new HttpException(response,HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  @Get('all/:page/:limit')
  @UseGuards(AuthGuard)
  async getAllProperty(@Req() req:Request, @Res() res:Response):Promise<Response> {
    try {

      const { page, limit } = req.params;
      const { properties, totalCount, currentPage, totalPages } = await this.properties.getAllProperties(parseInt(page), parseInt(limit));

      const propertiesMap = await Promise.all(
        properties.map(
         async (property: property) => {
          return {
            ...property,
            url:await this.garage.getSignedFileURl(property.image_url)
          }
        }
      )
      )

      const response: ApiResponse = {
        success: true,
        message: "Successsfully fetched properties",
        data: {
          properties:propertiesMap,
          pagination: {
            totalCount,
            currentPage,
            totalPages
          }
        }
      }
      return res.status(200).json(response)

    } catch (error) {

      this.logger.error(`Error in getting all properties from database`, error)
      const response: ApiResponse = {
        success: false,
        message:`${error}`
      }
      return res.status(500).json(response)

    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getProperty( @Req() req:Request, @Res() res:Response ) {
    try {

      const { id } = req.params;

      const property = await this.properties.getProperty(parseInt(id));
      const imageUrl = await this.garage.getSignedFileURl(property.image_url)

      const response: ApiResponse = {
        success: true,
        message: "Successfully fetched property",
        data: {
          property: property,
          imageUrll:imageUrl
        }
      }

      return res.status(200).json(response);

    } catch (error) {

      this.logger.error(`Error in getting all properties from database`, error)
      const response: ApiResponse = {
        success: false,
        message:`${error}`
      }
      return res.status(500).json(response)
    }
  }

}
