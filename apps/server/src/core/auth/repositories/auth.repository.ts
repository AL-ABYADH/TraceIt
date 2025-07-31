import { Injectable, NotFoundException } from "@nestjs/common";
import { RefreshTokenModel, RefreshTokenModelType } from "../models/refresh-token.model";
import { Neo4jService } from "../../neo4j/neo4j.service";
import { Op } from "@repo/custom-neogma";
import { UserService } from "../../../features/user/services/user/user.service";
import { RefreshToken } from "../entities/refresh-token.entity";
import { User } from "../../../features/user/entities/user.entity";

@Injectable()
export class AuthRepository {
  private readonly refreshTokenModel: RefreshTokenModelType;

  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly userService: UserService,
  ) {
    this.refreshTokenModel = RefreshTokenModel(this.neo4jService.getNeogma());
  }

  /**
   * Creates a new refresh token and links it to a user.
   */
  async createRefreshToken(
    userId: string,
    token: string,
    userAgent: string,
    ipAddress: string,
    expiresInSeconds: number,
  ): Promise<RefreshToken> {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresInSeconds);

    const newToken = await this.refreshTokenModel.createOne({
      token,
      issuedIp: ipAddress,
      userAgent,
      expiresAt: expiresAt.toISOString(),
      revoked: false,
      user: {
        where: [{ params: { id: userId } }],
      },
    });

    return this.mapToRefreshTokenEntity(newToken);
  }

  /**
   * Retrieves all refresh tokens linked to a user.
   */
  async getAllRefreshTokensByUserId(userId: string): Promise<any> {
    try {
      return await this.userService.findUserWithActiveRefreshTokens(userId);
    } catch (error) {
      console.error("Error retrieving user refresh tokens:", error);
      throw error;
    }
  }

  /**
   * Finds the user associated with a specific refresh token.
   */
  async findUserByRefreshToken(token: string): Promise<User | null> {
    const now = new Date();

    const result = await this.refreshTokenModel.findOneWithRelations({
      where: {
        token,
        revoked: false,
        expiresAt: { [Op.gte]: now.toISOString() },
      },
      include: ["user"],
    });

    return result?.user ?? null;
  }

  /**
   * Retrieves the user ID associated with a given refresh token.
   */
  async findUserIdByRefreshToken(token: string): Promise<string | null> {
    const user = await this.findUserByRefreshToken(token);
    if (!user) {
      throw new NotFoundException("User not found for this token.");
    }

    return user.id || null;
  }

  /**
   * Revokes a specific refresh token.
   */
  async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenModel.update({ revoked: true }, { where: { token } });
  }

  /**
   * Revokes all refresh tokens for a user.
   */
  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    const userWithTokens = await this.getAllRefreshTokensByUserId(userId);

    if (userWithTokens?.refreshTokens) {
      for (const token of userWithTokens.refreshTokens) {
        await this.revokeRefreshToken(token);
      }
    }
  }

  /**
   * Revokes all refresh tokens except the provided one for a user.
   */
  async revokeAllUserRefreshTokensExceptOne(userId: string, exceptToken: string): Promise<void> {
    const userWithTokens = await this.getAllRefreshTokensByUserId(userId);

    if (userWithTokens?.refreshTokens) {
      for (const token of userWithTokens.refreshTokens) {
        if (token !== exceptToken) {
          await this.revokeRefreshToken(token);
        }
      }
    }
  }

  /**
   * Deletes expired refresh tokens created more than 7 days ago.
   */
  async deleteExpiredTokens(): Promise<void> {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const expiredTokens = await this.refreshTokenModel.findMany({
      where: {
        expiresAt: {
          [Op.lte]: now.toISOString(),
        },
      },
    });

    if (!expiredTokens.length) return;

    await Promise.all(
      expiredTokens.map((token) =>
        this.refreshTokenModel.delete({
          where: { id: token.id },
          detach: true,
        }),
      ),
    );
  }

  /**
   * Checks if a valid, non-revoked refresh token exists and returns its details.
   */
  async checkIfExists(token: string): Promise<RefreshToken | null> {
    const tokenData = await this.refreshTokenModel.findOneWithRelations({
      where: { token, revoked: false },
    });
    return this.mapToRefreshTokenEntity(tokenData);
  }

  /**
   * Transforms raw data into a RefreshToken entity instance.
   */
  private mapToRefreshTokenEntity(data: any): RefreshToken {
    return {
      ...data,
      expiresAt: new Date(data?.expiresAt),
    } as RefreshToken;
  }
}
