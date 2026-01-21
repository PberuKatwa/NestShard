import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { DecodedUser } from "src/types/users.types";

export const currentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    console.log("userrrrr", user)

    return data ? user?.[data] : user;
  },
)
