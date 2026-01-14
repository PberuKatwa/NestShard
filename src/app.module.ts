import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config';
import { AppLoggerModule } from './logger/logger.module';
import { GarageModule } from './modules/garage/garage.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load:[config], isGlobal:true }),
    AppLoggerModule,
    GarageModule,
    FilesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
