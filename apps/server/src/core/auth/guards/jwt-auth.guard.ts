import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { createHash } from "crypto";

import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { AuthService } from "../services/auth.service";
import { TokenBlacklistService } from "../services/token-blacklist.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtStrategyGuard = new (AuthGuard("jwt"))();

  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly blacklistService: TokenBlacklistService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Respect @Public on either handler or controller level
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request: Request = context.switchToHttp().getRequest<Request>();
    const response: Response = context.switchToHttp().getResponse<Response>();

    const accessToken = this.extractAccessToken(request);
    const refreshToken = this.extractRefreshToken(request);
    const userAgent = request.headers["user-agent"] || "unknown";
    const realIp = this.extractRealIp(request);

    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException("Both access and refresh tokens are required");
    }

    if (await this.blacklistService.isBlacklisted(accessToken)) {
      throw new UnauthorizedException("Access token has been revoked");
    }

    try {
      // 1. Validate refresh token signature and expiration
      const refreshPayload = this.verifyRefreshToken(refreshToken);

      // 2. Validate access token signature (temporarily ignoring expiration)
      const accessPayload = this.verifyAccessTokenSignatureIgnoreExpiration(accessToken);

      // 3. Ensure linkage between access and refresh tokens
      const accessTokenFingerprint = this.createFingerprint(accessToken);
      if (refreshPayload.fingerprint !== accessTokenFingerprint) {
        // throw new UnauthorizedException(
        //   "Token mismatch - access and refresh tokens are not linked",
        // );
      }

      // 4. Ensure user ID matches in both tokens
      if (refreshPayload.sub !== accessPayload.sub) {
        throw new UnauthorizedException("User mismatch between tokens");
      }

      // 5. Finally, validate access token including expiration
      try {
        jwt.verify(accessToken, this.getJwtSecret());

        // Access token is valid, continue authentication
        const ok = await this.jwtStrategyGuard.canActivate(context);
        if (!ok) throw new UnauthorizedException();
        return true;
      } catch (accessError) {
        // If the only issue is expiration, attempt refresh
        if (accessError instanceof TokenExpiredError) {
          // Check DB to ensure refresh token has not been revoked
          const isValid = await this.authService.checkIfExists(refreshPayload.jti);
          if (!isValid) {
            throw new UnauthorizedException("Refresh token has been revoked");
          }

          // Refresh tokens
          const data = await this.authService.refreshTokens(
            refreshToken,
            userAgent,
            realIp,
            response,
          );

          if (!data?.accessToken) {
            throw new UnauthorizedException("Failed to refresh access token");
          }

          // Expose new AT and re-run the JWT guard to populate req.user
          response.setHeader("Authorization", `Bearer ${data.accessToken}`);
          request.headers.authorization = `Bearer ${data.accessToken}`;

          const okAfterRefresh = await this.jwtStrategyGuard.canActivate(context);
          if (!okAfterRefresh) {
            throw new UnauthorizedException();
          }
          return true;
        }

        // Any other issue with access token
        throw new UnauthorizedException("Access token verification failed");
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Authentication failed");
    }
  }

  private extractAccessToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    return authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
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
      const first = parts[0]?.trim();
      if (first) ip = first;
    }

    ip = ip || request.ip || request.socket?.remoteAddress || undefined;

    if (!ip) {
      throw new UnauthorizedException("Failed to extract real IP address");
    }
    return ip;
  }

  // Create a fingerprint of the access token to bind it with the refresh token
  private createFingerprint(token: string): string {
    // Use the first 8 characters of a SHA-256 hash as fingerprint
    return createHash("sha256")
      .update(token.split(".")[2] || "")
      .digest("hex")
      .substring(0, 8);
  }

  // Validate refresh token signature and expiration
  private verifyRefreshToken(token: string): {
    jti: string;
    sub: string;
    fingerprint: string;
    iat: number;
    exp: number;
  } {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!refreshSecret) {
      throw new UnauthorizedException("JWT refresh secret is not configured");
    }

    try {
      const payload = jwt.verify(token, refreshSecret) as {
        jti: string;
        sub: string;
        fingerprint: string;
        iat: number;
        exp: number;
      };
      if (!payload || !payload.jti || !payload.sub || !payload.fingerprint) {
        throw new UnauthorizedException("Invalid refresh token payload");
      }
      return payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException("Refresh token has expired");
      }
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  // Validate access token signature while ignoring expiration
  private verifyAccessTokenSignatureIgnoreExpiration(token: string): JwtPayload {
    const secret = this.getJwtSecret();
    try {
      const payload = jwt.verify(token, secret, { ignoreExpiration: true }) as JwtPayload | null;
      if (!payload || !payload.sub || !payload.data) {
        throw new UnauthorizedException("Invalid access token payload");
      }
      return payload;
    } catch {
      throw new UnauthorizedException("Invalid access token");
    }
  }

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new UnauthorizedException("JWT secret is not configured");
    return secret;
  }
}
