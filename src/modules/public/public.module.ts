import { Module } from "@nestjs/common";
import { PropertiesModule } from "../properties/properties.module";
import { BlogModule } from "../blog/blog.module";

@Module({
  imports:[PropertiesModule,BlogModule]
})

export class PublicModule { };
