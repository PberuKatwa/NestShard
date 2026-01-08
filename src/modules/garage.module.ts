import { Module } from "@nestjs/common";
import { S3_CLIENT, s3CLientProvider } from '../storage/garage.storage'

@Module({
    providers:[s3CLientProvider]
})

export class GarageModule {}