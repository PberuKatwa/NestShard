import { Body, Controller, Inject, Post, Req, Res, Get, HttpException, HttpStatus, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import type { AppLogger } from "src/logger/winston.logger";
import { APP_LOGGER } from "src/logger/logger.provider";
import { UsersModel } from "../users/users.model";
import type { ApiResponse } from "src/types/api.types";
import { AuthGuard } from "../auth/guards/auth.guard";
import { PropertiesModel } from "./properties.model";


@Controller('properties')
export class PropertyController{

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly properties:PropertiesModel
  ) { }

  @Post('')
  async createProperty() {
    try {

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
