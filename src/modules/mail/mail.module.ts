import { MailerModule } from "@nestjs-modules/mailer";
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from "@nestjs/common";
import { emailConfig } from "src/config";
import { MailService } from "./mail.service";
const { host, port, secure, auth } = emailConfig();

@Module({
  imports: [
    MailerModule.forRoot({
      transport: { host, port, secure, auth },
      defaults: { from: `"No Reply" <${auth.user}>`, },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    })
  ],
  providers: [MailService]
})

export class MailModule { };
