import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";

import { WS_IS_PUBLIC_KEY } from "../decorators/websocket-public.decorator";
import { ConfigService } from "@nestjs/config";
import { AuthRepository } from "../repositories/auth.repository";

@Injectable()
export class WebSocketAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private authRepository: AuthRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the handler is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(WS_IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const client = context.switchToWs().getClient<Socket>();
    const refreshToken = this.extractRefreshTokenFromSocket(client);

    if (!refreshToken) {
      client.disconnect();
      throw new WsException("Unauthorized: No refresh token provided");
    }

    try {
      // Verify refresh token
      const refreshSecret = this.configService.get<string>("JWT_REFRESH_SECRET");
      if (!refreshSecret) {
        throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
      }

      // Verify the refresh token
      const payload = jwt.verify(refreshToken, refreshSecret) as {
        jti: string;
        sub: string;
        fingerprint: string;
      };

      // Check in the database to ensure the token has not been revoked
      const isValid = await this.authRepository.checkIfExists(payload.jti);
      if (!isValid) {
        client.disconnect();
        throw new WsException("Unauthorized: Refresh token has been revoked");
      }

      // Attach user ID from the refresh token to socket data
      client.data = {
        ...(client.data || {}),
        user: {
          id: payload.sub,
        },
        refreshTokenId: payload.jti,
      };

      return true;
    } catch (error) {
      client.disconnect();

      if (error instanceof jwt.TokenExpiredError) {
        throw new WsException("Unauthorized: Refresh token expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new WsException("Unauthorized: Invalid refresh token");
      }

      throw new WsException("Unauthorized: Authentication failed");
    }
  }

  private extractRefreshTokenFromSocket(client: Socket): string | undefined {
    // Try to extract from cookies in handshake headers
    const cookies = client.handshake.headers.cookie;
    if (cookies) {
      const parsedCookies = cookie.parse(cookies);
      return parsedCookies.refreshToken;
    }

    return undefined;
  }
}
