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

     const response = await this.mailerService.sendMail({
        to,
        subject: 'Welcome!',
        template: 'enhanced',
       context: {
         message,
         logoUrl: 'https://ardhitech.com/wp-content/uploads/2022/10/ardhitech_logo-.png',
         year: new Date().getFullYear(),
       },
     });

      return response;

    } catch (error) {
      throw error;
    }
  }

}
