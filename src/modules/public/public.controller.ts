import { Controller, Inject, Get, Query, Res, ParseIntPipe, Req } from "@nestjs/common";
import type { Request, Response } from "express";
import { PropertiesModel } from "../properties/properties.model";
import { BlogModel } from "../blog/blog.model";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";
import { AllProperties, Property, PropertyApiResponse } from "src/types/properties.types";
import { GarageService } from "../garage/garage.service";
import { isInstance } from "class-validator";
import { ApiResponse } from "src/types/api.types";
import { AllBlogsApiResponse, FullBlog, SingleBlogApiResponse } from "src/types/blog.types";

@Controller('public')
export class PublicController{

  constructor(
    private readonly properties: PropertiesModel,
    private readonly blog: BlogModel,
    private readonly garage:GarageService,
    @Inject(APP_LOGGER) private readonly logger:AppLogger
  ) { }

  @Get('properties')
  async getProperties(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Res() res:Response
  ) {
    try {

      const allProperties: AllProperties = await this.properties.getAllProperties(page, limit);

      const { properties, pagination } = allProperties;
      const propertiesMap = await Promise.all(
        properties.map(
          async (property: Property) => {

            let signedUrl:string | null = null
            if (property.file_url) {
              signedUrl = await this.garage.getSignedFileURl(property.file_url)
            }

            const result = {
              ...property,
              signedUrl
            }

            return result;
        }
      )
      )

      const response: PropertyApiResponse = {
        success: true,
        message: "Successsfully fetched properties",
        data: {
          properties:propertiesMap,
          pagination
        }
      }

      return res.status(200).json(response)
    } catch (error: unknown) {

      let message = "Unknown error";
      let stack:string | null = null;

      if (error instanceof Error) {
        message = error.message;
        stack = error.stack ?? null;
      }

      this.logger.error(`Error in fetching properties for public api`, {
        errorMessage: message,
        errorStack:stack
      })

      const response: PropertyApiResponse = {
        success: false,
        message:message
      }

      return res.status(500).json(response)
    }
  }

  @Get('blogs')
  async getBlogs(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Res() res:Response
  ) {
    try {

      const allBlogs = await this.blog.getAllBlogs(page, limit);

      const { blogs, pagination } = allBlogs;

      const blogMap: FullBlog[] = await Promise.all(
        blogs.map(

          async (blog) => {
            if (blog.file_url) {
              blog.signed_url = await this.garage.getSignedFileURl(blog.file_url)
            }

            return blog;
          }

        )
      )

      const response: AllBlogsApiResponse = {
        success: true,
        message: "Successfully fetched all blogs",
        data: {
          blogs: blogMap,
          pagination:pagination
        }
      }

      res.status(200).json(response);
    } catch (error:any) {

      let message = "Unknown error";
      let stack: string | null = null;

      if (error instanceof Error) {
        message = error.message,
        stack = error.stack ?? null;
      }

      this.logger.error(`Error in getting all blogs`, {
        errorMessage: message,
        errorStack:stack
      })

      const response: ApiResponse = {
        success: false,
        message:message
      }

      return res.status(500).json(response);
    }
  }

  @Get('blogs/:id')
  async getBlog( @Req() req:Request, @Res() res:Response ) {
    try {

      const { id } = req.params;

      const blog = await this.blog.getBlog(parseInt(id));

      if (blog.file_url) {
        blog.signed_url = await this.garage.getSignedFileURl(blog.file_url)
      }

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

}
