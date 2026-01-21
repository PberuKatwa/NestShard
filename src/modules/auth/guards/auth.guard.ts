import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Inject
} from "@nestjs/common";
import { AuthService } from "../auth.service";
import { APP_LOGGER } from "src/logger/logger.provider";
import type { AppLogger } from "src/logger/winston.logger";
import { UsersModel } from "src/modules/users/users.model";

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(
    private readonly authService: AuthService,
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly users:UsersModel
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    try {
      const request = context.switchToHttp().getRequest();
      const authorization:string = request.headers.authorization;

      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('No authorization token was provided');
      }

      const token = authorization.replace(/bearer/gim, '').trim();
      const decoded = await this.users.validateToken(token)

      console.log('decoded', decoded)
      return true

    } catch (error) {
      this.logger.error("error in validating token", error)
      throw new ForbiddenException('Session is unauthorization, please login again')
    }

  }

}
