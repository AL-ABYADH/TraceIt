import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../repositories/auth.repository";
import { Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

@Injectable()
export class LogoutAllDevicesOperation {
  constructor(private authRepository: AuthRepository) {}

  async execute(req: Request, res: Response): Promise<boolean> {
    const accessToken: string | undefined = req.headers.authorization?.split(" ")[1];
    const userId = jwt.decode(accessToken) as JwtPayload;
    await this.authRepository.revokeAllUserRefreshTokens(userId.sub);
    res.clearCookie("refreshToken");
    return true;
  }
}
