import { Module } from "@nestjs/common";
import { GarageService } from "src/services/garage.service";
import { AppLoggerModule } from "src/logger/logger.module";

@Module({
  providers:[GarageService]
})

export class FilesModule{}
