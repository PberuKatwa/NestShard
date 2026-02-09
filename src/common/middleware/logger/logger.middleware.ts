import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, Next } from '@nestjs/common';
import { logger } from 'src/logger/winston.logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const startTime = Date.now();

    logger.logAPIStart(req);


    next();
  }
}
