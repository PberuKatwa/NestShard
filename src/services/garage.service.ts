import { Inject, Injectable } from "@nestjs/common";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3_CLIENT } from "src/storage/garage.storage";
import { S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";