import { User } from "../../../features/user/entities/user.entity";
import { Transform } from "class-transformer";

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
  user?: User | null;
}
