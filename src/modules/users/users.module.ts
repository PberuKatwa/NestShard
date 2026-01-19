import { Module } from "@nestjs/common";
import { UsersModel } from "./users.model";

@Module({
  providers: [ UsersModel ],
  exports:[ UsersModel ]
})

export class UserModule {}
