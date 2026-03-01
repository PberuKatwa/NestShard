import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { emailConfig } from "src/config";
const { host, port, secure, auth } = emailConfig();

@Module({
  imports: [
    MailerModule.forRoot({
      transport: { host, port, secure, auth },
      defaults:{ from: `"No Reply" <${auth.user}>`,}
    })
  ]
})

export class MailModule { };
