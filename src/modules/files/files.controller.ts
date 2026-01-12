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
  ) {

  }

}
