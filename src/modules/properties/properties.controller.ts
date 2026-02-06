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
import { AllProperties, Property, PropertyPayload } from "src/types/properties.types";


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
    file: Express.Multer.File
  ) {
    try {

      const { name, price, isRental, fileId, location, description } = body;
      const payload: PropertyPayload = { name, price, isRental, location, description, fileId, userId: user.userId };
      const property = await this.properties.createProperty(payload)

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
      const allProperties:AllProperties = await this.properties.getAllProperties(parseInt(page), parseInt(limit));

      const { properties, pagination } = allProperties;
      const propertiesMap = await Promise.all(
        properties.map(
          async (property: Property) => {
          return {
            ...property,
            // signedUrl:await this.garage.getSignedFileURl(property.image_url)
          }
        }
      )
      )

      const response: ApiResponse = {
        success: true,
        message: "Successsfully fetched properties",
        data: {
          properties:propertiesMap,
          pagination
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

  @Post('trash/:id')
  @UseGuards(AuthGuard)
  async trashProperty(@Req() req:Request, @Res() res:Response) {
    try {

      const { id } = req.params;

      const property:Property = await this.properties.trashProperty(parseInt(id))

      const response: ApiResponse = {
        success: true,
        message: 'Successfully trashed property',
        data:property
      }

      return res.status(200).json(response)
    } catch (error) {

      this.logger.error(`error in trashing property`, error)
      const response: ApiResponse = {
        success: false,
        message:`${error}`
      }
      return res.status(500).json(response);
    }
  }

  @Post('update')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateProperty(
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
    @Res() res:Response
  ) {
    try {

      const { id, name, price, description } = body;
      const { key } = await this.garage.uploadFile(file);
      const property = await this.properties.updateProperty(id, name, price, description, key )

      const response: ApiResponse = {
        success: true,
        message: "Successfully updated property ",
        data:property
      }

      return res.status(200).json(response)

    } catch (error) {
      this.logger.error(`error in updating property`, error)
      const response: ApiResponse = {
        success: false,
        message:`${error}`
      }
      return res.status(500).json(response);    }
  }

}
