import { MailerModule } from "@nestjs-modules/mailer";
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from "@nestjs/common";
import { emailConfig } from "src/config";
import { MailService } from "./mail.service";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('smtpHost'),
          port: configService.get<number>('smtpPort'),
          secure: configService.get<boolean>('smtpPort'),
          auth: {
            user: configService.get('smtpUser'),
            pass: configService.get('smtpUser'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get('SMTP_USER')}>`,
        },
      }),
    }),
  ],
  providers: [MailService]
})

export class MailModule { };
