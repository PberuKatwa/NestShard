import { Body, Controller, Inject, Post, Req, Res, Get, HttpException, HttpStatus, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import type { AppLogger } from "src/logger/winston.logger";
import { APP_LOGGER } from "src/logger/logger.provider";
import { UsersModel } from "../users/users.model";
import type { ApiResponse } from "src/types/api.types";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { AuthGuard } from "./guards/auth.guard";
import { CurrentUser } from "../users/decorators/user.decorator";
import { DecodedUser, LoginUserResponse, User } from "src/types/users.types";

@Controller('auth')
export class AuthController{

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly user:UsersModel
  ) { }

  @Post('register')
  async createUser(
    @Body() createUserDto: RegisterUserDto
  ): Promise<ApiResponse> {
    try {

      const { firstName, lastName, email, password } = createUserDto;

      const user = await this.user.createUser(firstName, lastName, email, password)

      const response: ApiResponse = {
        success: true,
        message: `Successfully created user with email ${email}`,
        data:user
      }

      return response

    } catch (error) {

      this.logger.error(`Error in creating user`, error)

      const response: ApiResponse = {
        success: false,
        message: `${error.message}`,
      }

      throw new HttpException(response,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post('login')
  async loginUser(@Body() userDto: LoginUserDto):Promise<ApiResponse> {
    try {
      const { email, password } = userDto;

      const result = await this.user.validateUserPassword(email, password);

      const response: LoginUserResponse = {
        success: true,
        message: `Successfully logged in user ${email}`,
        data:result
      }

      return response

    } catch (error) {
      this.logger.error(`Error in logging in user`, error)
      const response: ApiResponse = {
        success: false,
        message: `${error.message}`,
      }
      throw new HttpException(response,HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile( @CurrentUser() currentUser:any ): Promise<ApiResponse> {
    try {

      const response: ApiResponse = {
        success: true,
        message:"Successfully obtained user profile"
      }

      return response

    } catch (error) {

      this.logger.error(`Error in getting user profile`, error)
      const response: ApiResponse = {
        success: false,
        message: `${error.message}`,
      }
      throw new HttpException(response, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  @UseGuards(AuthGuard)
  @Post('update')
  async updateUser(@Req() req:Request, @Res() res:Response) {
    try {

      const data: User = req.body;

      const { id, email, first_name, last_name } = data;

      if (image_url === undefined) throw new Error(`Error in undefin`);

      const response = await this.user.updateUser(id, first_name, last_name, email, image_url);

    } catch (error) {

      const response: ApiResponse = {
        success: true,
        message:`${error}`
      }

      this.logger.error(`Error in updating user`, error)

      return res.status(500).json(response)

    }
  }

}
