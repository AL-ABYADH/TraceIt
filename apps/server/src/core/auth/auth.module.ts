import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService, ConfigModule } from "@nestjs/config";

import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthRepository } from "./repositories/auth.repository";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { UserModule } from "../../features/user/user.module";

import { ValidateUserOperation } from "./operations/validate-user.operation";
import { RegisterUserOperation } from "./operations/register-user.operation";
import { LoginUserOperation } from "./operations/login-user.operation";
import { RefreshTokensOperation } from "./operations/refresh-tokens.operation";
import { LogoutUserOperation } from "./operations/logout-user.operation";
import { LogoutAllDevicesOperation } from "./operations/logout-all-devices.operation";
import { CleanupExpiredTokensOperation } from "./operations/cleanup-expired-tokens.operation";
import { GenerateTokensOperation } from "./operations/generate-tokens.operation";
import { TokenBlacklistService } from "./services/token-blacklist.service";

// New WebSocket authentication components
import { WebSocketAuthGuard } from "./guards/websocket-auth.guard";
import { WebSocketConnectionService } from "./services/websocket-connection.service";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>("JWT_SECRET");

        if (!secret) {
          throw new Error("JWT_SECRET is not defined in the environment variables");
        }

        return {
          secret,
          signOptions: {
            expiresIn: configService.get<string>("JWT_EXPIRATION", "15m"),
          },
        };
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    // Service & Repository
    AuthService,
    TokenBlacklistService,
    AuthRepository,

    // Strategies
    LocalStrategy,
    JwtStrategy,

    // Use Cases
    ValidateUserOperation,
    RegisterUserOperation,
    LoginUserOperation,
    RefreshTokensOperation,
    LogoutUserOperation,
    LogoutAllDevicesOperation,
    CleanupExpiredTokensOperation,
    GenerateTokensOperation,

    // WebSocket Authentication
    WebSocketAuthGuard,
    WebSocketConnectionService,
  ],
  exports: [
    AuthService,
    // Export WebSocket components for use in other modules
    WebSocketAuthGuard,
    WebSocketConnectionService,
  ],
})
export class AuthModule {}
