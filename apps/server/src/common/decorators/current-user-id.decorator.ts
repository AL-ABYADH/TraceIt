import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const CurrentUserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  if (!req.user?.id) throw new UnauthorizedException();
  return req.user.id as string;
});
