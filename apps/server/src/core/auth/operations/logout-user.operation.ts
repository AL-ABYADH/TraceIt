import { Injectable } from "@nestjs/common";
import { Response } from "express";

@Injectable()
export class LogoutUserOperation {
  async execute(res: Response): Promise<boolean> {
    res.clearCookie("refreshToken");
    return true;
  }
}
