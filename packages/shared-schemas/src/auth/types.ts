import { z } from "../zod-openapi-init";
import {
  registerSchema,
  loginSchema,
  tokensSchema,
  refreshTokenCookieSchema,
} from "./schemas";

/**
 * =========================
 * TYPE ALIASES
 * =========================
 */
export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type TokensDto = z.infer<typeof tokensSchema>;
export type RefreshTokenCookieDto = z.infer<typeof refreshTokenCookieSchema>;
