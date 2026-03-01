import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    MailerModule.forRoot({

    })
  ]
})

export class MailModule { };
