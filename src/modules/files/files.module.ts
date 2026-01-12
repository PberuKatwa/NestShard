import { Module } from "@nestjs/common";
import { GarageService } from "src/services/garage.service";

@Module({
  providers:[GarageService]
})

export class FilesModule{}
