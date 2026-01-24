import { Controller, Inject, Post, Req, Res } from "@nestjs/common";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";

@Controller('blogs')
export class BlogController{

  constructor(
    @Inject(APP_LOGGER) private readonly logger:AppLogger

  ) { }

  @Post('')
  async createPost( @Req() req:Request, @Res() res:Response ) {
    try {

    } catch (error) {
      this.logger.error(``)
    }
  }

}
