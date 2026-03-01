import { Inject, Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import type  { AppLogger } from "src/logger/winston.logger";
import { APP_LOGGER } from "src/logger/logger.provider";

@Injectable()
export class MailService{

  constructor(
    private readonly mailerService: MailerService,
    @Inject(APP_LOGGER) private readonly logger:AppLogger
  ) {

  }

  async testEmail(to:string, message: string) {
    try {
      this.logger.info(`Attempting test email`, message);

      await this.mailerService.sendMail({
        to,
        subject: 'Welcome!',
        template: 'welcome',
        context: {
          message
        },
      });
    } catch (error) {
      throw error;
    }
  }

}
