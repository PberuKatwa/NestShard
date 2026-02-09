import { Controller, Inject, Post, Req, Res, UseGuards, Get } from "@nestjs/common";
import type { Request,Response } from "express";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";
import type { ApiResponse } from "src/types/api.types";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CurrentUser } from "../users/decorators/user.decorator";
import { BlogModel } from "./blog.model";
import { AllBlogs, AllBlogsApiResponse, Blog, BlogPayload, SingleBlogApiResponse, CreateBlogPayload, SingleBlogMinimalApiResponse, FullBlog } from "src/types/blog.types";
import { GarageService } from "../garage/garage.service";

@Controller('blogs')
@UseGuards(AuthGuard)
export class BlogController{

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly blog: BlogModel,
    private readonly garage:GarageService
  ) { }

  @Post('')
  async createPost(
    @CurrentUser() user:any,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response> {
    try {

      const { title, content, fileId } = req.body;

      const payload: CreateBlogPayload = {
        title,
        authorId: user.userId,
        content,
        fileId
      }

      const blog = await this.blog.createBlog(payload);

      const response:SingleBlogMinimalApiResponse = {
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
      const { blogs, pagination } = await this.blog.getAllBlogs(parseInt(page), parseInt(limit));

      const blogMap: FullBlog[] = await Promise.all(
        blogs.map(
          async (blog: FullBlog) => {
            if (blog.file_url) {
              blog.signed_url = await this.garage.getSignedFileURl(blog.file_url);
            }
            return blog
          }
        )
      );

      const response: AllBlogsApiResponse = {
        success: true,
        message: `Successfully fetched ${pagination.totalCount} blogs`,
        data: {
          blogs: blogMap,
          pagination
        }
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

      const blog = await this.blog.getBlog(parseInt(id));

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

      const response: ApiResponse= {
        success: true,
        message: `Successfully updated blog`,
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

      const response: ApiResponse = {
        success: true,
        message: 'Successfully trashed blog',
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
