import { Module } from "@nestjs/common";
import { AppLoggerModule } from "src/logger/logger.module";

@Module({
  imports:[AppLoggerModule]
})

export class PostgresModule {}
