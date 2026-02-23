import { Module } from "@nestjs/common";
import { PropertiesModule } from "../properties/properties.module";
import { BlogModule } from "../blog/blog.module";
import { PropertiesModel } from "../properties/properties.model";
import { BlogModel } from "../blog/blog.model";
import { GarageModule } from "../garage/garage.module";
import { GarageService } from "../garage/garage.service";

@Module({
  imports: [PropertiesModule, BlogModule, GarageModule],
  providers:[PropertiesModel,BlogModel,GarageService]
})

export class PublicModule { };
