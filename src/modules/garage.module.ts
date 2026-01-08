import { Module } from "@nestjs/common";
import { S3_CLIENT, s3CLientProvider } from '../storage/garage.storage'
import { GarageService } from "src/services/garage.service";

@Module({
    providers:[s3CLientProvider, GarageService], 
    exports:[GarageService]
})

export class GarageModule {}