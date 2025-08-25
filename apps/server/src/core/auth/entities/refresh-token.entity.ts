import { User } from "../../../features/user/entities/user.entity";

/**
 * Entity for storing refresh tokens in the database
 */
export class RefreshToken {
  id: string;
  token: string;
  issuedIp: string;
  userAgent: string;
  expiresAt: Date;
  createdAt: Date;
  revoked: boolean;
  updatedAt?: Date;
  user?: User;
}
