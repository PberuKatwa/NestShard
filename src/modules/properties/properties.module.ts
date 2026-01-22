import { Module } from "@nestjs/common";
import { PropertiesModel } from "./properties.model";
import { GarageService } from "../garage/garage.service";
import { GarageModule } from "../garage/garage.module";

@Module({
  imports: [GarageService,GarageModule],
  providers: [PropertiesModel],
  exports:[PropertiesModel]
})

export class PropertiesModule{}
