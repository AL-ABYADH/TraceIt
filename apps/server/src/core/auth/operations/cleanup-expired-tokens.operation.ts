import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../repositories/auth.repository";

@Injectable()
export class CleanupExpiredTokensOperation {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.deleteExpiredTokens();
  }
}
