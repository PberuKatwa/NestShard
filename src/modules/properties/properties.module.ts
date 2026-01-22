import { Module } from "@nestjs/common";
import { PropertiesModel } from "./properties.model";
import { GarageService } from "../garage/garage.service";
import { GarageModule } from "../garage/garage.module";
import { PropertyController } from "./properties.controller";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [GarageModule,AuthModule, UsersModule],
  controllers:[PropertyController],
  providers: [PropertiesModel],
  exports:[PropertiesModel]
})

export class PropertiesModule{}
