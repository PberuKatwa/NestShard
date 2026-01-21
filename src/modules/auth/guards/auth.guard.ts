import { CanActivate, Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate{

  async canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    try {
      const request = context.switchToHttp().getRequest();
      const authorization:string = request.headers.authorization;

      if (!authorization || authorization.trim() === '') {

      }

      const token = authorization?.split(' ')[1];
    } catch (error) {
      throw error;
    }

  }

}
