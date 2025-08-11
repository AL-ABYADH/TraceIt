// File: core/auth/guards/jwt-auth.guard.ts
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

    //  Verify the Access Token signature (with ignoreExpiration) before using the payload
    const payload = this.verifyAccessTokenSignatureIgnoreExpiration(accessToken);

    // Ensure the validity of the Refresh Token and its consistency with the Access Token data
    await this.validateRefreshToken(refreshToken, payload);

    // Let Passport perform regular validation (expired Access Token will throw here)
    try {
      const isValid = await this.jwtStrategyGuard.canActivate(context);
      if (!isValid) throw new UnauthorizedException();
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        // If failure is due only to Access Token expiration, attempt automatic refresh
        try {
          jwt.verify(accessToken, this.getJwtSecret()); // full verification without ignoreExpiration
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
    const headerValue = request.headers["x-refresh-token"];
    const headerToken = Array.isArray(headerValue)
      ? headerValue[0]
      : typeof headerValue === "string"
        ? headerValue
        : undefined;

    return headerToken ?? request.cookies?.refreshToken;
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

  /** Verifies the Access Token signature ignoring expiration and returns the trusted payload */
  private verifyAccessTokenSignatureIgnoreExpiration(token: string): JwtPayload {
    const secret = this.getJwtSecret();

    try {
      const payload = jwt.verify(token, secret, { ignoreExpiration: true }) as JwtPayload | null;
      if (!payload) throw new UnauthorizedException("Invalid access token.");
      // Basic validation on expected fields
      if (!payload.sub || !payload.data) {
        throw new UnauthorizedException("Invalid access token payload.");
      }
      return payload;
    } catch {
      throw new UnauthorizedException("Invalid access token.");
    }
  }

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException("JWT secret is not configured.");
    }
    return secret;
  }

  private async validateRefreshToken(refreshToken: string, payload: JwtPayload) {
    const stored = await this.authService.checkIfExists(refreshToken);
    if (!stored || payload.data !== stored.id || payload.sub !== stored.user?.id) {
      throw new UnauthorizedException("Invalid refresh token or token details mismatch.");
    }
  }
}
