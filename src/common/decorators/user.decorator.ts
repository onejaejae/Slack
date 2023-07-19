import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserJoinWithWorkspace } from 'src/types/user/common';
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserJoinWithWorkspace = request.user;
    return user;
  },
);
