import { z } from "../zod-openapi-init";
import {
  displayNameFieldDoc,
  emailFieldDoc,
  usernameFieldDoc,
  passwordFieldDoc,
  loginUsernameFieldDoc,
} from "./openapi-fields";

/**
 * =========================
 * REGISTER SCHEMA
 * =========================
 */
export const registerSchema = z
  .object({
    displayName: displayNameFieldDoc,
    email: emailFieldDoc,
    username: usernameFieldDoc,
    password: passwordFieldDoc,
  })
  .openapi({ title: "RegisterDto" });

/**
 * =========================
 * LOGIN SCHEMA
 * =========================
 */
export const loginSchema = z
  .object({
    email: emailFieldDoc.optional(),
    username: loginUsernameFieldDoc.optional(),
    password: passwordFieldDoc,
  })
  .refine((data) => data.email || data.username, {
    message: "Either email or username must be provided",
    path: ["email"],
  })
  .openapi({ title: "LoginDto" });

/**
 * =========================
 * TOKENS SCHEMA
 * =========================
 */
export const tokensSchema = z
  .object({
    accessToken: z.string().openapi({ example: "eyJhbGciOi..." }),
    tokenType: z.string().openapi({ example: "Bearer" }),
    expiresIn: z.number().openapi({ example: 3600 }),
  })
  .openapi({ title: "TokensDto" });

export const refreshTokenCookieSchema = z
  .object({
    refreshToken: z.string().openapi({
      description: "Refresh token stored in HTTP-only cookie",
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    }),
  })
  .openapi({ title: "RefreshTokenCookieDto" });
