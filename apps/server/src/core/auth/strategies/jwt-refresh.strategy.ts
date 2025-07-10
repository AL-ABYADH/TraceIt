import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { AuthRepository } from "../repositories/auth.repository";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(
    private configService: ConfigService,
    private authRepository: AuthRepository,
  ) {
    const refreshSecret = configService.get<string>("JWT_REFRESH_SECRET");

    if (!refreshSecret) {
      throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Default method to extract token
      ignoreExpiration: false,
      secretOrKey: refreshSecret,
      passReqToCallback: true, // Allow request to be passed to validate method
    });
  }

  /**
   * Validates the refresh token and checks its validity in the database.
   * Token is expected to be sent in the cookie (not from Authorization header).
   */
  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.cookies["refreshToken"] as string | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token is missing");
    }

    // Verify that the refresh token exists and has not been revoked
    const tokenExists = await this.authRepository.findUserIdByRefreshToken(refreshToken);

    if (!tokenExists && tokenExists === payload.sub) {
      throw new UnauthorizedException("Refresh token is invalid or expired");
    }

    return { userId: payload.sub, refreshToken };
  }
}
