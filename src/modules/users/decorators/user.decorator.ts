import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { DecodedUser } from "src/types/users.types";

export const CurrentUser = createParamDecorator(
  function (data: string, ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
)
