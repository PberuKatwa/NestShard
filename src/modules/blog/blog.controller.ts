import { Controller, Inject } from "@nestjs/common";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";

@Controller('blogs')
export class BlogController{

  constructor(
    @Inject(APP_LOGGER) private readonly logger:AppLogger

  ) {}

}
