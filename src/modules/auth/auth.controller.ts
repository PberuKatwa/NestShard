import { Controller, Inject, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import type { AppLogger } from "src/logger/winston.logger";
import { APP_LOGGER } from "src/logger/logger.provider";
import { UsersModel } from "../users/users.model";

@Controller('auth')
export class AuthController{

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly user:UsersModel
  ) { }

  async createUser( @Req() req:Request, @Res() res:Response ) {
    try {

    } catch(error) {
      this.logger.error(`Error in creating user`, error)
    }
  }

}
