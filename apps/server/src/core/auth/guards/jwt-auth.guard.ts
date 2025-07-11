import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import jwt from "jsonwebtoken";

import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { AuthRepository } from "../repositories/auth.repository";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtStrategyGuard = new (AuthGuard("jwt"))();

  constructor(
    private readonly reflector: Reflector,
    private readonly authRepository: AuthRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Allow access if the route is marked as public
    const isRoutePublic = this.reflector.get<boolean>("isPublic", context.getHandler());
    if (isRoutePublic) return true;

    const request: Request = context.switchToHttp().getRequest();

    // Extract access token from Authorization header
    const authorizationHeader = request.headers.authorization;
    const accessToken = authorizationHeader?.split(" ")[1];

    // Get refresh token either from custom header or cookies
    const refreshToken = request.headers["x-refresh-token"] || request.cookies?.refreshToken;

    // Reject if either token is missing
    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException("Access and refresh tokens are required.");
    }

    let decodedPayload: JwtPayload | null;
    try {
      // Decode JWT to extract payload
      decodedPayload = jwt.decode(accessToken);
    } catch (err) {
      throw new UnauthorizedException("Invalid access token.");
    }

    if (!decodedPayload) {
      throw new UnauthorizedException("Invalid access token.");
    }

    // Validate refresh token in the database
    const storedRefreshToken = await this.authRepository.checkIfExists(refreshToken);
    if (!storedRefreshToken) {
      throw new UnauthorizedException("Invalid refresh Token details.");
    }

    const isTokenValid =
      storedRefreshToken &&
      decodedPayload.data === storedRefreshToken.id &&
      decodedPayload.sub === storedRefreshToken?.user?.id;

    if (!isTokenValid) {
      throw new UnauthorizedException("Invalid token details.");
    }

    // Check if JWT strategy guard authorizes this request
    const isJwtAuthenticated = await this.jwtStrategyGuard.canActivate(context);
    if (!isJwtAuthenticated) {
      throw new UnauthorizedException("Access token is invalid or expired.");
    }

    return true;
  }
}
