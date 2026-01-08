import { Inject, Injectable } from "@nestjs/common";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3_CLIENT } from "src/storage/garage.storage";
import { S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

@Injectable()
export class GarageService{

    constructor( @Inject(S3_CLIENT) private readonly s3:S3Client ){}

    async uploadFile(){
        try{

        }catch(error){
            throw error;
        }
    }

}