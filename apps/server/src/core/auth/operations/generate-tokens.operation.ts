import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthRepository } from "../repositories/auth.repository";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { TokensDto } from "../dtos/tokens.dto";
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class GenerateTokensOperation {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private authRepository: AuthRepository,
  ) {}

  async execute(user: any, userAgent: string, ip: string, res: Response): Promise<TokensDto> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    const accessTokenExpiration = this.configService.get<string>("JWT_EXPIRATION", "15m");
    const refreshTokenExpiration = this.configService.get<number>("JWT_REFRESH_EXPIRATION", 604800); // 7 days
    const refreshTokenSecure = this.configService.get<boolean>("COOKIE_SECURE", false);
    const cookieDomain = this.configService.get<string>("COOKIE_DOMAIN", "localhost");

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();

    await this.authRepository.createRefreshToken(
      user.id,
      refreshToken,
      userAgent,
      ip,
      refreshTokenExpiration,
    );

    const cookieExpiration = refreshTokenExpiration * 1000;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: refreshTokenSecure,
      sameSite: "strict",
      domain: cookieDomain,
      path: "/",
      maxAge: cookieExpiration,
    });

    let expiresIn = 900;
    if (accessTokenExpiration.endsWith("m")) {
      expiresIn = parseInt(accessTokenExpiration.slice(0, -1)) * 60;
    } else if (accessTokenExpiration.endsWith("h")) {
      expiresIn = parseInt(accessTokenExpiration.slice(0, -1)) * 3600;
    } else if (accessTokenExpiration.endsWith("d")) {
      expiresIn = parseInt(accessTokenExpiration.slice(0, -1)) * 86400;
    }

    return new TokensDto({
      accessToken,
      tokenType: "Bearer",
      expiresIn,
    });
  }
}
