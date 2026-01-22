import { Module } from "@nestjs/common";
import { UsersModel } from "../users/users.model";
import { PropertiesModel } from "./properties.model";

@Module({
  imports: [],
  providers: [PropertiesModel],
  exports:[PropertiesModel]
})

export class PropertiesModule{}
