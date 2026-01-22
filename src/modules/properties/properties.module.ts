import { Module } from "@nestjs/common";
import { UsersModel } from "../users/users.model";

@Module({
  imports:[UsersModel]
})

export class PropertiesModule{}
