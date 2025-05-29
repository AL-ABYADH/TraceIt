/**
 * Entity for storing refresh tokens in the database
 */
export class RefreshToken {
  id: string;
  token: string;
  userId: string;
  issuedIp: string;
  userAgent: string;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
