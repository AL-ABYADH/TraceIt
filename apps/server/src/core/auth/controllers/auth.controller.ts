import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { GetUserAgent } from "../decorators/http-info.decorator";
import { RealIP } from "nestjs-real-ip";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { Public } from "../decorators/public.decorator";

// Import types only
import type { Request, Response } from "express";

// Zod
import { zodBody } from "src/common/pipes/zod";
import {
  type LoginDto,
  loginSchema,
  type RegisterDto,
  registerSchema,
  TokensDto,
} from "@repo/shared-schemas";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user and returns authentication tokens.
   */
  @Public()
  @Post("register")
  async register(
    @Body(zodBody(registerSchema)) registerDto: RegisterDto,
    @GetUserAgent() userAgent: string,
    @RealIP() ipAddress: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ success: boolean }> {
    const data: TokensDto = await this.authService.register(
      registerDto,
      userAgent,
      ipAddress,
      response,
    );
    response.setHeader("Authorization", `Bearer ${data.accessToken}`);
    return { success: !!data };
  }

  /**
   * Logs in a user using local strategy and returns tokens.
   */
  @Public()
  @Post("login")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(zodBody(loginSchema)) loginDto: LoginDto,
    @GetUserAgent() userAgent: string,
    @RealIP() ipAddress: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ success: boolean }> {
    const data: TokensDto = await this.authService.login(loginDto, userAgent, ipAddress, response);
    response.setHeader("Authorization", `Bearer ${data.accessToken}`);
    return { success: !!data };
  }

  /**
   * Logs out the user and revokes the active refresh token.
   */
  @Put("logout")
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
  @Put("logout-all")
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ success: boolean }> {
    const success = await this.authService.logoutAll(request, response);
    return { success };
  }
}
