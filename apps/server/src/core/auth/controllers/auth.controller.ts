import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Ip,
  Req,
  Res,
} from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dtos/register.dto";
import { GetUserAgent } from "../decorators/http-info.decorator";
import { RealIP } from "nestjs-real-ip";
import { LoginDto } from "../dtos/login.dto";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { Public } from "../decorators/public.decorator";

// Importing only types for Request and Response from Express
import type { Response, Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Handles user registration.
   */
  @Public()
  @Post("register")
  async register(
    @Body() registerDto: RegisterDto,
    @GetUserAgent() userAgent: string,
    @RealIP() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.register(registerDto, userAgent, ip, res);
  }

  /**
   * Handles user login using local strategy.
   */
  @Public()
  @Post("login")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @GetUserAgent() userAgent: string,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, userAgent, ip, res);
  }

  /**
   * Refreshes access and refresh tokens using the refresh token from cookies.
   */
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @GetUserAgent() userAgent: string,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Extract refresh token from cookies
    const refreshToken = req.cookies["refreshToken"];
    console.log("refreshToken", refreshToken);
    return this.authService.refreshTokens(refreshToken, userAgent, ip, res);
  }

  /**
   * Logs the current user out by revoking the current refresh token.
   */
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response): Promise<{ success: boolean }> {
    const success = await this.authService.logout(res);
    return { success };
  }

  @Post("logout-all")
  @HttpCode(HttpStatus.OK)
  async logout_all(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean }> {
    const success = await this.authService.logoutAll(req, res);
    return { success };
  }
}
