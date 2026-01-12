import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config';
import { UploadModule } from './modules/upload.module';
import { AppLoggerModule } from './logger/logger.module';
import { GarageModule } from './modules/garage.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load:[config], isGlobal:true }),
    UploadModule,
    AppLoggerModule,
    GarageModule,
    FilesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
