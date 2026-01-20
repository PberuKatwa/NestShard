import { Controller, Inject, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import type { AppLogger } from "src/logger/winston.logger";
import { APP_LOGGER } from "src/logger/logger.provider";
import { UsersModel } from "../users/users.model";
import type { ApiResponse } from "src/types/api.types";

@Controller('auth')
export class AuthController{

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly user:UsersModel
  ) { }

  @Post('register')
  async createUser( @Req() req:Request, @Res() res:Response ):Promise<Response> {
    try {

      const { firstName, lastName, email, password } = req.body;

      const user = await this.user.createUser(firstName, lastName, email, password)

      const response: ApiResponse = {
        success: true,
        message: `Successfully created user with email ${email}`,
        data:user
      }

      return res.status(200).json(response)

    } catch (error) {

      this.logger.error(`Error in creating user`, error)

      const response: ApiResponse = {
        success: true,
        message: `${error.message}`,
      }

      return res.status(500).json(response)

    }
  }

}
