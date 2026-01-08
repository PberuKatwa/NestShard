import { S3Client,S3ClientConfig } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { Provider } from "@nestjs/common";

export const S3_CLIENT:string = 'S3_CLIENT';

export const s3CLientProvider:Provider = {
    provide:S3_CLIENT,
    useFactory: function (configService:ConfigService){
        return new S3Client({
            endpoint:'http://localhost:3900',
            region:'garage',
            credentials:{
                accessKeyId:'GK818fcdfc3ae4fe20b58dbe53',
                secretAccessKey:'763c3548d2daacf7eb21c8b89da7bd8819d05ed4141911189aca0f6cf8c6e2b5'
            },
            forcePathStyle:true
        } as S3ClientConfig)
    },
    inject:[ConfigService]
}
