import { Controller, Inject, Get, Query, Res, ParseIntPipe } from "@nestjs/common";
import type { Request, Response } from "express";
import { PropertiesModel } from "../properties/properties.model";
import { BlogModel } from "../blog/blog.model";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";
import { AllProperties, Property, PropertyApiResponse } from "src/types/properties.types";
import { GarageService } from "../garage/garage.service";

@Controller('public')
export class PublicController{

  constructor(
    private readonly properties: PropertiesModel,
    private readonly blog: BlogModel,
    private readonly garage:GarageService,
    @Inject(APP_LOGGER) private readonly logger:AppLogger
  ) { }

  @Get('properties')
  async getProperties(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Res() res:Response
  ) {
    try {

      const allProperties: AllProperties = await this.properties.getAllProperties(page, limit);

      const { properties, pagination } = allProperties;
      const propertiesMap = await Promise.all(
        properties.map(
          async (property: Property) => {

            let signedUrl:string | null = null
            if (property.file_url) {
              signedUrl = await this.garage.getSignedFileURl(property.file_url)
            }

            const result = {
              ...property,
              signedUrl
            }

            return result;
        }
      )
      )

      const response: PropertyApiResponse = {
        success: true,
        message: "Successsfully fetched properties",
        data: {
          properties:propertiesMap,
          pagination
        }
      }

      return res.status(200).json(response)
    } catch (error: unknown) {

      let message = "Unknown error";
      let stack:string | null = null;

      if (error instanceof Error) {
        message = error.message;
        stack = error.stack ?? null;
      }

      this.logger.error(`Error in fetching properties for public api`, {
        errorMessage: message,
        errorStack:stack
      })

      const response: PropertyApiResponse = {
        success: false,
        message:message
      }

      return res.status(500).json(response)
    }
  }

}
