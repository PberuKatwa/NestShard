import { Module } from "@nestjs/common";
import { GarageService } from "src/services/garage.service";
import { FilesController } from "./files.controller";

@Module({
  providers: [GarageService],
  controllers:[FilesController]
})

export class FilesModule{}
