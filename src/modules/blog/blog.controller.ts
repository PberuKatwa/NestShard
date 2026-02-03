import { Controller, Inject, Post, Req, Res, UseGuards, Get } from "@nestjs/common";
import type { Request,Response } from "express";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";
import type { ApiResponse } from "src/types/api.types";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CurrentUser } from "../users/decorators/user.decorator";
import { BlogModel } from "./blog.model";
import { AllBlogs, AllBlogsApiResponse, Blog, BlogPayload, SingleBlogApiResponse } from "src/types/blog.types";

@Controller('blogs')
@UseGuards(AuthGuard)
export class BlogController{

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly blog:BlogModel

  ) { }

  @Post('')
  async createPost(
    @CurrentUser() user:any,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response> {
    try {

      const { title, content } = req.body;

      const payload: BlogPayload = {
        title,
        authorId: user.userId,
        content
      }

      const blog = await this.blog.createBlog(payload);

      const response:SingleBlogApiResponse = {
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

  @Get('all/:page/:limit')
  async getAllBlogs(@Req() req:Request, @Res() res:Response):Promise<Response> {
    try {

      const { page, limit } = req.params;

      const blogResult:AllBlogs = await this.blog.getAllBlogs(parseInt(page), parseInt(limit))

      const response: AllBlogsApiResponse = {
        success: true,
        message: `Successfully fetched ${blogResult.pagination.totalCount} blogs`,
        data:blogResult
      }

      return res.status(200).json(response);
    } catch (error) {

      this.logger.error(`error in fetching blog posts`, error)
      const response: ApiResponse = {
        success: false,
        message:`${error}`
      }
      return res.status(500).json(response);

    }
  }

  @Get(':id')
  async getBlog( @Req() req:Request, @Res() res:Response ) {
    try {

      const { id } = req.params;

      const blog:Blog = await this.blog.getBlog(parseInt(id));

      const response: SingleBlogApiResponse = {
        success: true,
        message: `Successfully fetched blog`,
        data:blog
      }

      return res.status(200).json(response)

    } catch (error) {

      this.logger.error(`error in fetching blog post`, error)
      const response: ApiResponse = {
        success: false,
        message:`${error}`
      }
      return res.status(500).json(response);

    }
  }

  @Post('update')
  async updateBlog( @Req() req:Request, @Res() res:Response ):Promise<Response> {
    try {

      const { id, title, content } = req.body;
      const blog:Blog = await this.blog.updateBlog(id, title, content);

      const response: SingleBlogApiResponse= {
        success: true,
        message: `Successfully updated blog`,
        data:blog
      }

      return res.status(200).json(response)

    } catch (error) {

      this.logger.error(`error in updating blog post`, error)
      const response: ApiResponse = {
        success: false,
        message:`${error}`
      }
      return res.status(500).json(response);
    }
  }

  @Post('trash/:id')
  async trashBlog( @Req() req:Request, @Res() res:Response ):Promise<Response> {
    try {

      const { id } = req.params;

      const blog:Blog = await this.blog.trashBlog(parseInt(id))

      const response: SingleBlogApiResponse = {
        success: true,
        message: 'Successfully trashed blog',
        data:blog
      }

      return res.status(200).json(response)
    } catch (error) {

      this.logger.error(`error in trashing post`, error)
      const response: ApiResponse = {
        success: false,
        message:`${error}`
      }
      return res.status(500).json(response);
    }
  }


}
