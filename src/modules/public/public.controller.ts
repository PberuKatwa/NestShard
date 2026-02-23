import { Controller,Inject } from "@nestjs/common";
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



}
