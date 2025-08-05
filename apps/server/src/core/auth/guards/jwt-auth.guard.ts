import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { AuthService } from "../services/auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtStrategyGuard = new (AuthGuard("jwt"))();

  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>("isPublic", context.getHandler());
    if (isPublic) return true;

    const request: Request = context.switchToHttp().getRequest<Request>();
    const response: Response = context.switchToHttp().getResponse();

    const accessToken = this.extractAccessToken(request);
    const refreshToken = this.extractRefreshToken(request);

    const userAgent = request.headers["user-agent"] || "unknown";
    const realIp = this.extractRealIp(request);

    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException("Access and refresh tokens are required.");
    }

    const payload = this.decodeToken(accessToken);
    await this.validateRefreshToken(refreshToken, payload);

    try {
      const isValid = await this.jwtStrategyGuard.canActivate(context);
      if (!isValid) throw new UnauthorizedException();
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        try {
          jwt.verify(accessToken, process.env.JWT_SECRET!);
        } catch (verifyErr) {
          if (verifyErr instanceof TokenExpiredError) {
            const data = await this.authService.refreshTokens(
              refreshToken,
              userAgent,
              realIp,
              response,
            );
            if (data) response.setHeader("Authorization", `Bearer ${data.accessToken}`);
          } else {
            throw new UnauthorizedException("Access token verification failed.");
          }
        }
      } else {
        throw err;
      }
    }

    return true;
  }

  private extractAccessToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    return authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;
  }

  private extractRefreshToken(request: Request): string | undefined {
    return request.headers["x-refresh-token"] || request.cookies?.refreshToken;
  }

  private extractRealIp(request: Request): string {
    const forwardedFor = request.headers["x-forwarded-for"];

    let ip: string | undefined;

    if (typeof forwardedFor === "string") {
      const parts = forwardedFor.split(",");
      const firstPart = parts[0]?.trim();
      if (firstPart) {
        ip = firstPart;
      }
    }

    ip = ip || request.ip || request.socket?.remoteAddress || undefined;

    if (!ip) {
      throw new UnauthorizedException("Failed to extract real IP address.");
    }

    return ip;
  }

  private decodeToken(token: string): JwtPayload {
    const payload = jwt.decode(token) as JwtPayload | null;
    if (!payload) {
      throw new UnauthorizedException("Invalid access token.");
    }
    return payload;
  }

  private async validateRefreshToken(refreshToken: string, payload: JwtPayload) {
    const stored = await this.authService.checkIfExists(refreshToken);
    if (!stored || payload.data !== stored.id || payload.sub !== stored.user?.id) {
      throw new UnauthorizedException("Invalid refresh token or token details mismatch.");
    }
  }
}
