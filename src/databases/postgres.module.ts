import { Global, Module, OnModuleInit } from "@nestjs/common";
import { AppLoggerModule } from "src/logger/logger.module";
import { PostgresConfig } from "./postgres.config";

@Global()
@Module({
  imports: [AppLoggerModule],
  providers:[PostgresConfig],
  exports:[PostgresConfig]
})

export class PostgresModule implements OnModuleInit {

  constructor(private readonly postgresConfig: PostgresConfig) { };

  async onModuleInit() {
    await this.postgresConfig.connect()
  }

}
