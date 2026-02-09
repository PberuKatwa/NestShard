import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, Next } from '@nestjs/common';
import { logger } from 'src/logger/winston.logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
}
