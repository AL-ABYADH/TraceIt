import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../services/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "username", // Use a single field that may be either a username or email
      passwordField: "password",
    });
  }

  /**
   * Validates the user credentials using the AuthService.
   * Allows login via either username or email address.
   */
  async validate(username: string, password: string): Promise<any> {
    let user;

    const isEmail = username.includes("@");

    try {
      // Determine if the input is an email or username and validate accordingly
      user = isEmail
        ? await this.authService.validateUser({ email: username, password })
        : await this.authService.validateUser({ username, password });
    } catch (error) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return user; // Passport attaches this user to request object (req.user)
  }
}
