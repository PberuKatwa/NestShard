import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config';
import { UploadModule } from './modules/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load:[config],
      isGlobal:true
    }), 
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
