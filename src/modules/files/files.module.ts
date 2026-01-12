import { Module } from "@nestjs/common";
import { FilesController } from "./files.controller";
import { GarageModule } from "../garage.module";

@Module({
  imports: [GarageModule],
  controllers:[FilesController]
})

export class FilesModule{}
