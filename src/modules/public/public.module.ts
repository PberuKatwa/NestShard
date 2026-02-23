import { Module } from "@nestjs/common";
import { PropertiesModule } from "../properties/properties.module";
import { BlogModule } from "../blog/blog.module";
import { PropertiesModel } from "../properties/properties.model";
import { BlogModel } from "../blog/blog.model";

@Module({
  imports: [PropertiesModule, BlogModule],
  providers:[PropertiesModel,BlogModel]
})

export class PublicModule { };
