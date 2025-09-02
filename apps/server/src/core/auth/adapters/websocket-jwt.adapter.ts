import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions, Socket } from "socket.io";
import { INestApplicationContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { AuthRepository } from "../repositories/auth.repository";

export class WebSocketJwtAdapter extends IoAdapter {
  private readonly configService: ConfigService;
  private readonly authRepository: AuthRepository;
  private readonly allowedOrigins: string[];

  constructor(app: INestApplicationContext, allowedOrigins: string[]) {
    super(app);
    this.authRepository = app.get(AuthRepository);
    this.allowedOrigins = allowedOrigins;
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: this.allowedOrigins,
        credentials: true,
      },
    });

    server.use(async (socket: Socket, next) => {
      try {
        const refreshToken = this.extractRefreshTokenFromSocket(socket);

        if (!refreshToken) {
          return next(new Error("Authentication error: No refresh token provided"));
        }

        const refreshSecret = this.configService.get<string>("JWT_REFRESH_SECRET");
        if (!refreshSecret) {
          return next(new Error("JWT_REFRESH_SECRET is not defined in environment variables"));
        }

        const payload = jwt.verify(refreshToken, refreshSecret) as {
          jti: string;
          sub: string;
          fingerprint: string;
        };

        const isValid = await this.authRepository.checkIfExists(payload.jti);
        if (!isValid) {
          return next(new Error("Authentication error: Refresh token has been revoked"));
        }

        socket.data = {
          ...(socket.data || {}),
          user: { id: payload.sub },
          refreshTokenId: payload.jti,
        };

        next();
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          return next(new Error("Authentication error: Refresh token expired"));
        }
        if (error instanceof jwt.JsonWebTokenError) {
          return next(new Error("Authentication error: Invalid refresh token"));
        }
        return next(new Error("Authentication error"));
      }
    });

    return server;
  }

  private extractRefreshTokenFromSocket(socket: Socket): string | undefined {
    const cookies = socket.handshake.headers.cookie;
    if (cookies) {
      const parsedCookies = cookie.parse(cookies);
      return parsedCookies.refreshToken;
    }
    return undefined;
  }
}
