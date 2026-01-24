import { Controller, Inject, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request,Response } from "express";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";
import type { ApiResponse } from "src/types/api.types";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CurrentUser } from "../users/decorators/user.decorator";
import { BlogModel } from "./blog.model";

@Controller('blogs')
export class BlogController{

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly blog:BlogModel

  ) { }

  @Post('')
  @UseGuards(AuthGuard)
  async createPost(
    @CurrentUser() user:any,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response> {
    try {

      const { title, content } = req.body;

      const blog = await this.blog.createBlog(title, user.userId, content);

      const response:ApiResponse = {
        success: true,
        message: `Successfully created post`,
        data:blog
      }

      return res.status(200).json(response)
    } catch (error) {

      this.logger.error(`error in creating blog post`, error)

      const response: ApiResponse = {
        success: false,
        message:`${error}`
      }

      return res.status(500).json(response);

    }
  }

}
