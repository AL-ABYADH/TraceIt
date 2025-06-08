import { Injectable } from "@nestjs/common";
import { RefreshToken } from "../entities/refresh-token.entity";
import { RefreshTokenModel } from "../models/refresh-token.model";
import { Neo4jService } from "../../neo4j/neo4j.service";
import { UserModel } from "../../../features/user/models/user.model";

@Injectable()
export class AuthRepository {
  private refreshTokenModel: any;
  private userModel: any;

  constructor(private readonly neo4jService: Neo4jService) {
    this.refreshTokenModel = RefreshTokenModel(neo4jService.getNeogma());
    this.userModel = UserModel(neo4jService.getNeogma());
  }

  /**
   * Creates a new refresh token and links it to a user.
   */
  async createRefreshToken(
    userId: string,
    token: string,
    userAgent: string,
    ip: string,
    expiresIn: number,
  ): Promise<RefreshToken> {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

    const refreshToken: any = await this.refreshTokenModel.createOne({
      token,
      issuedIp: ip,
      userAgent,
      expiresAt: expiresAt.toISOString(),
      revoked: false,
      user: {
        where: [
          {
            params: { id: userId },
          },
        ],
      },
    });

    return refreshToken.getDataValues() as RefreshToken;
  }

  /**
   * Finds a refresh token with associated user using the token string.
   */
  async findRefreshTokenWithUserId(token: string): Promise<RefreshToken | null> {
    const result = await this.refreshTokenModel.findOneWithRelations(
      {
        token,
        revoked: false,
      },
      {
        include: ["user"],
      },
    );

    return result || null;
  }

  /**
   * Finds a refresh token by user ID and token string.
   */
  async findRefreshTokenByUserIdAndToken(
    userId: string,
    token: string,
  ): Promise<RefreshToken | null> {
    try {
      const userWithTokens = await this.userModel.findOneWithRelations(
        { id: userId },
        {
          include: ["refreshTokens"],
          where: {
            refreshTokens: { token },
          },
        },
      );

      if (!userWithTokens) {
        return null;
      }

      return userWithTokens.refreshTokens.find((t) => t.token === token) || null;
    } catch (error) {
      console.error("Error finding refresh tokens:", error);
      throw error;
    }
  }

  /**
   * Retrieves the user ID associated with a specific refresh token.
   */
  async findUserIdByRefreshToken(token: string): Promise<string | null> {
    const result = await this.refreshTokenModel.findOneWithRelations(
      {
        token,
        revoked: false,
      },
      {
        include: ["user"],
      },
    );

    return result?.user?.id || null;
  }

  /**
   * Revokes a specific refresh token.
   */
  async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenModel.update(
      { revoked: true, updatedAt: new Date().toISOString() },
      { where: { token } },
    );
  }

  /**
   * Revokes all refresh tokens belonging to a specific user.
   */
  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    const userWithTokens = await this.userModel.findOneWithRelations(
      { id: userId },
      { include: ["refreshTokens"] },
    );

    if (!userWithTokens || !userWithTokens.refreshTokens?.length) {
      return;
    }

    const now = new Date().toISOString();

    const updatePromises = userWithTokens.refreshTokens.map((token) =>
      this.refreshTokenModel.update(
        {
          revoked: true,
          updatedAt: now,
        },
        { where: { id: token.id } },
      ),
    );

    await Promise.all(updatePromises);
  }

  /**
   * Deletes expired refresh tokens that were created more than 7 days ago.
   */
  async deleteExpiredTokens(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);

    const cutoffDateStr = cutoffDate.toISOString();
    const now = new Date().toISOString();

    const expiredTokens = await this.refreshTokenModel.findMany({
      where: {
        $or: [{ expiresAt: { $lt: now } }, { createdAt: { $lt: cutoffDateStr } }],
      },
    });

    if (!expiredTokens.length) {
      return;
    }

    const deletePromises = expiredTokens.map((token) =>
      this.refreshTokenModel.delete({
        where: { id: token.id },
        detach: true,
      }),
    );

    await Promise.all(deletePromises);
  }
}
