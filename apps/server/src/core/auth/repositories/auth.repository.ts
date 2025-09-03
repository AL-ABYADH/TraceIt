import { Injectable } from "@nestjs/common";
import { RefreshTokenModel, RefreshTokenModelType } from "../models/refresh-token.model";
import { Neo4jService } from "../../neo4j/neo4j.service";
import { Op } from "@repo/custom-neogma";
import { RefreshToken } from "../entities/refresh-token.entity";
import { User } from "../../../features/user/entities/user.entity";

@Injectable()
export class AuthRepository {
  private readonly refreshTokenModel: RefreshTokenModelType;

  constructor(private readonly neo4jService: Neo4jService) {
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
  async getAllRefreshTokensByUserId(userId: string): Promise<RefreshToken[]> {
    try {
      const refreshTokens = await this.refreshTokenModel.findByRelatedEntity({
        whereRelated: { id: userId },
        relationshipAlias: "user",
        where: { revoked: false },
      });

      const now = Date.now();

      const validRefreshTokens: any = (refreshTokens ?? []).filter(({ revoked, expiresAt }) => {
        if (revoked) return false;
        const expTime = new Date(expiresAt).getTime();
        return expTime > now;
      });
      return this.mapListToRefreshTokenEntity(validRefreshTokens);
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
    return user?.id ?? null;
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
    const tokens = await this.getAllRefreshTokensByUserId(userId);
    if (tokens.length > 0) {
      for (const t of tokens) {
        const raw = typeof t === "string" ? t : t.token;
        await this.revokeRefreshToken(raw);
      }
    }
  }

  /**
   * Revokes all refresh tokens except the provided one for a user.
   */
  async revokeAllUserRefreshTokensExceptOne(userId: string, exceptToken: string): Promise<void> {
    const tokens = await this.getAllRefreshTokensByUserId(userId);
    if (tokens.length > 0) {
      for (const t of tokens) {
        const raw = t.token;
        if (raw !== exceptToken) await this.revokeRefreshToken(raw);
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
   * Checks if a valid, refresh token exists and returns its details.
   */
  async checkIfExists(token: string): Promise<RefreshToken | null> {
    const tokenData = await this.refreshTokenModel.findOneWithRelations({
      where: { token },
      include: ["user"],
    });
    if (!tokenData) return null;
    return this.mapToRefreshTokenEntity(tokenData);
  }

  /**
   * Transforms raw data into a RefreshToken entity instance.
   */
  private mapToRefreshTokenEntity(data: any): RefreshToken {
    const entity = {
      ...data,
      expiresAt: new Date(data?.expiresAt),
      createdAt: new Date(data?.createdAt),
    } as RefreshToken;
    if (data) {
      if ("updatedAt" in Object.keys(data)) {
        entity.updatedAt = new Date(data.updatedAt);
      }
    }

    return entity;
  }

  /**
   * Transforms raw data into a RefreshToken entity instance.
   */
  private mapListToRefreshTokenEntity(data: any): RefreshToken[] {
    const Items: RefreshToken[] = [];
    for (const item of data) {
      Items.push(this.mapToRefreshTokenEntity(item));
    }
    return Items;
  }
}
