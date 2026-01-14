# Nest Shard - Large File Storage API

A high-performance NestJS-based file storage service optimized for uploading and managing extremely large files through intelligent sharding and multipart uploads. Integrates with Garage (S3-compatible object storage) for distributed file management.

## Project Overview

Nest Shard is designed to handle massive file uploads efficiently by breaking them into manageable chunks (shards) and uploading them in parallel using S3 multipart upload protocol. The service automatically detects file size and routes large files (>100MB) through optimized multipart streaming, while smaller files use standard upload paths. Built with NestJS and AWS SDK v3 for Garage compatibility.

## Architecture

### Entry Point
- **[src/main.ts](src/main.ts)** - Application bootstrap that initializes the NestJS application and starts the server on the configured port (default: 3636)

### Configuration
- **[src/config.ts](src/config.ts)** - Environment configuration loader that validates and exports required environment variables:
  - `PORT` - Server port
  - `GARAGE_ENDPOINT` - S3-compatible storage endpoint
  - `GARAGE_REGION` - Storage region
  - `GARAGE_ACCESS_KEY` - Access credentials
  - `GARAGE_SECRET_KEY` - Secret credentials
  - `GARAGE_BUCKET` - Target storage bucket

### Core Module
- **[src/app.module.ts](src/app.module.ts)** - Main application module that imports and configures:
  - ConfigModule for environment variables
  - AppLoggerModule for logging
  - GarageModule for S3 storage operations
  - FilesModule for file upload/download endpoints

## Modules

### Garage Module
Handles all S3/Garage storage operations with optimized sharding and multipart upload logic.

**Files:**
- **[src/modules/garage/garage.module.ts](src/modules/garage/garage.module.ts)** - Module definition that provides GarageService and S3 client
- **[src/modules/garage/garage.service.ts](src/modules/garage/garage.service.ts)** - Core service with methods:
  - `uploadFile()` - Upload single file to storage
  - `uploadMultiPart()` - Stream-based multipart upload that shards large files into 15MB chunks for parallel processing
  - `listFiles()` - List all files in the bucket
  - `fetchFileByKey()` - Retrieve file by key and return as stream
  - `uploadPart()` - Internal method for uploading individual shards
- **[src/modules/garage/garage.storage.ts](src/modules/garage/garage.storage.ts)** - S3Client provider configuration that initializes AWS SDK with Garage credentials

### Files Module
Exposes HTTP endpoints for large file operations with automatic sharding.

**Files:**
- **[src/modules/files/files.module.ts](src/modules/files/files.module.ts)** - Module definition that imports GarageModule and registers FilesController
- **[src/modules/files/files.controller.ts](src/modules/files/files.controller.ts)** - REST controller with endpoints:
  - `POST /files/upload` - Upload file with automatic sharding (files >100MB use multipart, smaller files use standard upload)
  - `POST /files/upload/stream` - Stream-based multipart upload with sharding for maximum efficiency
  - `GET /files` - List all files in bucket
  - `GET /files/:key` - Download file by key

## API Endpoints

### Upload File
```
POST /files/upload
Content-Type: multipart/form-data

Response:
{
  "success": true,
  "message": "Successfully uploaded large file with key:...",
  "data": {
    "key": "uuid_timestamp.ext",
    "fileSize": 1024000
  }
}
```

### Stream Upload
```
POST /files/upload/stream
Content-Type: multipart/form-data

Response:
{
  "success": true,
  "message": "Successfully uploaded large files"
}
```

### List Files
```
GET /files

Response:
{
  "success": true,
  "message": "Successfully fetched files of length:5",
  "data": [
    {
      "key": "uuid_timestamp.ext",
      "lastModified": "2024-01-14T...",
      "etag": "...",
      "size": 1024000,
      "storageClass": "STANDARD"
    }
  ]
}
```

### Download File
```
GET /files/:key

Response: File stream with appropriate Content-Type header
```

## Environment Setup

Create a `.env` file with the following variables:

```env
PORT=3636
GARAGE_ENDPOINT=https://garage.example.com
GARAGE_REGION=us-east-1
GARAGE_ACCESS_KEY=your_access_key
GARAGE_SECRET_KEY=your_secret_key
GARAGE_BUCKET=your_bucket_name
```

## Installation & Running

```bash
# Install dependencies
npm install

# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Testing
npm test
npm run test:watch
npm run test:cov
```

## Key Features

- **Intelligent Sharding** - Automatically splits large files into 15MB chunks (shards) for efficient parallel processing
- **Multipart Upload** - Leverages S3 multipart upload protocol for reliable large file transfers with automatic retry and cleanup
- **Adaptive Routing** - Files >100MB use streaming multipart upload; smaller files use standard upload for optimal performance
- **Stream Processing** - Memory-efficient handling through stream-based processing, enabling uploads of files larger than available RAM
- **Garage Integration** - Compatible with S3-like storage backends for distributed storage
- **Comprehensive Logging** - Winston-based logging for debugging and monitoring upload progress
- **Error Handling** - Graceful error handling with automatic multipart upload cleanup on failure
- **File Metadata** - Tracks file size, MIME type, ETag, and modification timestamps

## Dependencies

- `@nestjs/core` - NestJS framework
- `@nestjs/config` - Configuration management
- `@nestjs/platform-express` - Express integration
- `@aws-sdk/client-s3` - AWS S3 SDK for Garage operations
- `busboy` - Multipart form data parser
- `winston` - Logging library
