import { Module } from "@nestjs/common";
import { S3_CLIENT, s3CLientProvider } from '../storage/garage.storage'
import { GarageService } from "src/services/garage.service";
import { AppLoggerModule } from "src/logger/logger.module";

@Module({
    imports:[AppLoggerModule],
    providers:[s3CLientProvider, GarageService], 
    exports:[GarageService]
})

export class GarageModule {}