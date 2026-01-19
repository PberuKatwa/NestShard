import { Module, OnModuleInit } from "@nestjs/common";
import { UsersModel } from "./users.model";

@Module({
  providers: [ UsersModel ],
  exports:[ UsersModel ]
})

export class UserModule implements OnModuleInit {

  constructor( private readonly users:UsersModel ){}

  async onModuleInit() {
    await this.users.createTable()
  }
}
