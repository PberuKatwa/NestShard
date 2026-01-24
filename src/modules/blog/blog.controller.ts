import { Controller, Inject, Post, Req, Res } from "@nestjs/common";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";
import type { ApiResponse } from "src/types/api.types";

@Controller('blogs')
export class BlogController{

  constructor(
    @Inject(APP_LOGGER) private readonly logger:AppLogger

  ) { }

  @Post('')
  async createPost( @Req() req:Request, @Res() res:Response ):Promise<ApiResponse> {
    try {

    } catch (error) {

      this.logger.error(`error in creating blog post`, error)

      const response: ApiResponse = {
        success: false,
        message:`${error}`
      }

      return response;

    }
  }

}
