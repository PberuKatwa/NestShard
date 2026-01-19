import { Module } from "@nestjs/common";
import { AppLoggerModule } from "src/logger/logger.module";
import { PostgresConfig } from "./postgres.config";

@Module({
  imports: [AppLoggerModule],
  exports:[PostgresConfig]
})

export class PostgresModule {}
