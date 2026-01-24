import { Module } from "@nestjs/common";
import { BlogModel } from "./blog.model";
import { BlogController } from "./blog.controller";

@Module({
  providers: [BlogModel],
  controllers:[BlogController],
  exports:[BlogModel]
})

export class BlogModule{}
