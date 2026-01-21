import { CanActivate, Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate{

  async canActivate(context: ExecutionContext): Promise<boolean> {

    try {
      const request = context.switchToHttp().getRequest();
      const authorization:string = request.headers.authorization;

      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('No authorization token was provided');
      }

      const token = authorization.replace(/bearer/gim, '').trim();

      return true

    } catch (error) {
      throw error;
    }

  }

}
