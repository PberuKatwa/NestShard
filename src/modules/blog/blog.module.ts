import { Module } from "@nestjs/common";
import { BlogModel } from "./blog.model"
import { BlogController } from "./blog.controller";
import { AuthModule } from "../auth/auth.module";
import { GarageModule } from "../garage/garage.module";

@Module({
  imports:[GarageModule],
  providers: [BlogModel],
  controllers:[BlogController],
  exports:[BlogModel]
})

export class BlogModule{}
