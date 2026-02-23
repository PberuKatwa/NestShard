import { Module } from "@nestjs/common";
import { PropertiesModule } from "../properties/properties.module";
import { BlogModule } from "../blog/blog.module";
import { GarageModule } from "../garage/garage.module";
import { PublicController } from "./public.controller";

@Module({
  imports: [PropertiesModule, BlogModule, GarageModule],
  controllers:[PublicController],
  providers:[]
})

export class PublicModule { };
