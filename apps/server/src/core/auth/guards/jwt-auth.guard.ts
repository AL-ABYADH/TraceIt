// import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
// import { AuthGuard } from "@nestjs/passport";
// import { Reflector } from "@nestjs/core";
// import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
//
// @Injectable()
// export class JwtAuthGuard extends AuthGuard("jwt") {
//   constructor(private reflector: Reflector) {
//     super();
//   }
//
//   canActivate(context: ExecutionContext) {
//     // Check if the route is marked as public
//     const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//
//     if (isPublic) {
//       return true;
//     }
//
//     // If not public, perform JWT authentication
//     return super.canActivate(context);
//   }
//
//   handleRequest(err, user, info) {
//     // If there's an error or no user found
//     if (err || !user) {
//       throw err || new UnauthorizedException("Access is unauthorized");
//     }
//     return user;
//   }
// }

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private jwtAuthGuard = new (AuthGuard("jwt"))();

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>("isPublic", context.getHandler());
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    const refreshToken = request.headers["x-refresh-token"] || request.cookies?.refreshToken;

    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException("Access token or Refresh token missing");
    }

    const canActivateJwt = await this.jwtAuthGuard.canActivate(context);
    if (!canActivateJwt) {
      throw new UnauthorizedException("Invalid access token");
    }

    return true;
  }
}
