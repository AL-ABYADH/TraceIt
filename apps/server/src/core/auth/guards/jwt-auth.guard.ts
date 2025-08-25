import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { AuthService } from "../services/auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  // Reuse Passport's JWT guard under the hood
  private readonly jwtStrategyGuard = new (AuthGuard("jwt"))();

  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
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
      throw new UnauthorizedException("Access and refresh tokens are required.");
    }

    // Verify AT signature (ignoring expiration) before using its payload for any DB checks
    const payload = this.verifyAccessTokenSignatureIgnoreExpiration(accessToken);

    // Ensure the RT exists, is not revoked/expired, and belongs to the same user/payload
    await this.validateRefreshToken(refreshToken, payload);

    // Let Passport perform the normal validation (will reject expired AT)
    try {
      const ok = await this.jwtStrategyGuard.canActivate(context);
      if (!ok) throw new UnauthorizedException();
      return true;
    } catch (err) {
      // If failing due to AT expiry, try automatic refresh using the RT
      if (err instanceof UnauthorizedException) {
        try {
          // Full verification (will throw TokenExpiredError when AT is expired)
          jwt.verify(accessToken, this.getJwtSecret());
          // If verify passes, the error came from something else -> rethrow
          throw err;
        } catch (verifyErr) {
          if (verifyErr instanceof TokenExpiredError) {
            // Attempt automatic refresh
            const data = await this.authService.refreshTokens(
              refreshToken,
              userAgent,
              realIp,
              response,
            );
            if (!data?.accessToken) {
              throw new UnauthorizedException("Failed to refresh access token.");
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

          // AT failed verification for a reason other than expiration
          throw new UnauthorizedException("Access token verification failed.");
        }
      }

      // Non-auth related error
      throw err;
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
      throw new UnauthorizedException("Failed to extract real IP address.");
    }
    return ip;
  }

  /** Verify AT signature while ignoring expiration and return a trusted payload */
  private verifyAccessTokenSignatureIgnoreExpiration(token: string): JwtPayload {
    const secret = this.getJwtSecret();
    try {
      const payload = jwt.verify(token, secret, { ignoreExpiration: true }) as JwtPayload | null;
      if (!payload || !payload.sub || !payload.data) {
        throw new UnauthorizedException("Invalid access token payload.");
      }
      return payload;
    } catch {
      throw new UnauthorizedException("Invalid access token.");
    }
  }

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new UnauthorizedException("JWT secret is not configured.");
    return secret;
  }

  private async validateRefreshToken(refreshToken: string, payload: JwtPayload) {
    const stored = await this.authService.checkIfExists(refreshToken);
    // Must exist, not revoked, not expired; and must match AT payload (user and RT id)
    if (!stored || payload.data !== stored.id || payload.sub !== stored.user?.id) {
      throw new UnauthorizedException("Invalid refresh token or token details mismatch.");
    }
  }
}
