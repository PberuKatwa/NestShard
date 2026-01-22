import { Global, Module, OnModuleInit } from "@nestjs/common";
import { AppLoggerModule } from "src/logger/logger.module";
import { PostgresConfig } from "./postgres.config";
import { UsersModule } from "src/modules/users/users.module";
import { UsersModel } from "src/modules/users/users.model";
import { PropertiesModule } from "src/modules/properties/properties.module";
import { PropertiesModel } from "src/modules/properties/properties.model";

@Global()
@Module({
  imports: [AppLoggerModule, UsersModule, PropertiesModule],
  providers:[PostgresConfig],
  exports:[PostgresConfig]
})

export class PostgresModule implements OnModuleInit {

  constructor(
    private readonly postgresConfig: PostgresConfig,
    private readonly users: UsersModel,
    private readonly properties:PropertiesModel
  ) { };

  async onModuleInit() {
    await this.postgresConfig.connect()
    await this.users.createTable()
    await this.properties.createTable()
  }

}
