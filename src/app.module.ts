import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { s3Config,postgresEnv,globalConfig } from './config';
import { AppLoggerModule } from './logger/logger.module';
import { GarageModule } from './modules/garage/garage.module';
import { FilesModule } from './modules/files/files.module';
import { PostgresModule } from './databases/postgres.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load:[s3Config,postgresEnv, globalConfig], isGlobal:true }),
    AppLoggerModule,
    GarageModule,
    FilesModule,
    PostgresModule,
    UsersModule,
    AuthModule
  ]
})
export class AppModule {}
