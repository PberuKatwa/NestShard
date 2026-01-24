import { Injectable,Inject } from "@nestjs/common";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";

@Injectable()
export class BlogModel{

  constructor(
    @Inject(APP_LOGGER) private readonly logger:AppLogger

  ) {
  }

  async createTable() {

  }

}
