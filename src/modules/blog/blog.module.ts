import { Module } from "@nestjs/common";
import { BlogModel } from "./blog.model";

@Module({
  providers: [BlogModel],
  exports:[BlogModel]
})

export class BlogModule{}
