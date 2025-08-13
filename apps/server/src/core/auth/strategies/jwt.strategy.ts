import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { UserService } from "../../../features/user/services/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    const secretKey = configService.get<string>("JWT_SECRET");

    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: secretKey, // Use the configured secret key
    });
  }

  /**
   * Validates the JWT payload and returns the user if valid.
   */
  async validate(payload: JwtPayload) {
    try {
      const user = await this.userService.find(payload.sub);

      if (!user) {
        throw new UnauthorizedException("User no longer exists");
      }

      // Optionally, add additional validations here (e.g., check if user is banned)

      return user;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
