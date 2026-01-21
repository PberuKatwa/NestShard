import { Global, Module, OnModuleInit } from "@nestjs/common";
import { AppLoggerModule } from "src/logger/logger.module";
import { PostgresConfig } from "./postgres.config";
import { UsersModule } from "src/modules/users/users.module";
import { UsersModel } from "src/modules/users/users.model";

@Global()
@Module({
  imports: [AppLoggerModule, UsersModule],
  providers:[PostgresConfig],
  exports:[PostgresConfig]
})

export class PostgresModule implements OnModuleInit {

  constructor(
    private readonly postgresConfig: PostgresConfig,
    private readonly users: UsersModel
  ) { };

  async onModuleInit() {
    await this.postgresConfig.connect()
    await this.users.createTable()
  }

}
