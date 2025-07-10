import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dtos/register.dto";
import { GetUserAgent } from "../decorators/http-info.decorator";
import { RealIP } from "nestjs-real-ip";
import { LoginDto } from "../dtos/login.dto";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { Public } from "../decorators/public.decorator";

// Import types only
import type { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { TokensDto } from "../dtos/tokens.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user and returns authentication tokens.
   */
  @Public()
  @Post("register")
  async register(
    @Body() registerDto: RegisterDto,
    @GetUserAgent() userAgent: string,
    @RealIP() ipAddress: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.register(
      registerDto.toInterface(),
      userAgent,
      ipAddress,
      response,
    );
    return plainToInstance(TokensDto, tokens);
  }

  /**
   * Logs in a user using local strategy and returns tokens.
   */
  @Public()
  @Post("login")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @GetUserAgent() userAgent: string,
    @RealIP() ipAddress: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.login(
      loginDto.toInterface(),
      userAgent,
      ipAddress,
      response,
    );
    return plainToInstance(TokensDto, tokens);
  }

  /**
   * Issues new access and refresh tokens using the refresh token stored in cookies.
   */
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() request: Request,
    @GetUserAgent() userAgent: string,
    @RealIP() ipAddress: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies["refreshToken"] as string | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token is missing.");
    }

    const tokens = await this.authService.refreshTokens(
      refreshToken,
      userAgent,
      ipAddress,
      response,
    );
    return plainToInstance(TokensDto, tokens);
  }

  /**
   * Logs out the user and revokes the active refresh token.
   */
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ success: boolean }> {
    const success = await this.authService.logout(request, response);
    return { success };
  }

  /**
   * Logs the user out from all sessions by revoking all active refresh tokens.
   */
  @Post("logout-all")
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ success: boolean }> {
    const success = await this.authService.logoutAll(request, response);
    return { success };
  }
}
