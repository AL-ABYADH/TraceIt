import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as path from "path";
import * as jwt from "jsonwebtoken";

interface BlacklistedToken {
  token: string;
  expiresAt: number; // timestamp in milliseconds
}

@Injectable()
export class TokenBlacklistService implements OnModuleInit {
  private readonly blacklistPath: string;
  private blacklistCache: BlacklistedToken[] = [];

  constructor(private configService: ConfigService) {
    this.blacklistPath = path.join(process.cwd(), "token-blacklist.json");
  }

  async onModuleInit() {
    // On application startup, read the file if it exists
    await this.loadBlacklistFromFile();
  }

  private async loadBlacklistFromFile(): Promise<void> {
    try {
      if (fs.existsSync(this.blacklistPath)) {
        const data = await fs.promises.readFile(this.blacklistPath, "utf8");
        this.blacklistCache = JSON.parse(data);
        await this.cleanupExpiredTokens();
      } else {
        this.blacklistCache = [];
      }
    } catch (error) {
      console.error("Error loading blacklist file:", error);
      this.blacklistCache = [];
    }
  }

  private async saveBlacklistToFile(): Promise<void> {
    try {
      if (this.blacklistCache.length > 0) {
        await fs.promises.writeFile(
          this.blacklistPath,
          JSON.stringify(this.blacklistCache),
          "utf8",
        );
      } else if (fs.existsSync(this.blacklistPath)) {
        // If the list is empty, delete the file
        await fs.promises.unlink(this.blacklistPath);
      }
    } catch (error) {
      console.error("Error saving blacklist file:", error);
    }
  }

  async addToBlacklist(token: string): Promise<void> {
    await this.cleanupExpiredTokens();
    try {
      // Extract expiration time from the token
      const secret = this.configService.get<string>("JWT_SECRET");
      if (!secret) {
        throw new Error("JWT_SECRET is not defined in the environment variables");
      }
      const decoded = jwt.verify(token, secret, { ignoreExpiration: true }) as { exp: number };

      // Add token to in-memory cache
      this.blacklistCache.push({
        token,
        expiresAt: decoded.exp * 1000, // convert to milliseconds
      });

      // Persist changes to file
      await this.saveBlacklistToFile();
    } catch (error) {
      console.error("Error adding token to blacklist:", error);
    }
  }

  async isBlacklisted(token: string): Promise<boolean> {
    // First, check if the file exists
    if (!fs.existsSync(this.blacklistPath)) {
      return false;
    }
    await this.loadBlacklistFromFile();

    // Search for the token in the cache
    return this.blacklistCache.some((item) => item.token === token);
  }

  private async cleanupExpiredTokens(): Promise<void> {
    const now = Date.now();
    const initialLength = this.blacklistCache.length;

    // Remove expired tokens
    this.blacklistCache = this.blacklistCache.filter((item) => item.expiresAt > now);

    // If the list changed, update the file
    if (initialLength !== this.blacklistCache.length) {
      await this.saveBlacklistToFile();
    }
  }
}
