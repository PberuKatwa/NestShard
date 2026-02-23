import { Controller,Inject, Get, Query } from "@nestjs/common";
import { PropertiesModel } from "../properties/properties.model";
import { BlogModel } from "../blog/blog.model";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";

@Controller('public')
export class PublicController{

  constructor(
    private readonly properties: PropertiesModel,
    private readonly blog: BlogModel,
    @Inject(APP_LOGGER) private readonly logger:AppLogger
  ) { }

  @Get('properties')
  async getProperties(
    @Query('page') page: number,
    @Query('limit') limit:number
  ) {
    try {

    } catch (error: any) {

      let message = "Unknown error";
      let stack = null;

      this.logger.error(`Error in fetching properties for public api`, {
        errorMessage: error.message,
        errorStack:error.stack
      })
    }
  }

}
