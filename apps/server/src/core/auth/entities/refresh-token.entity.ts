import { RefreshTokenAttributes, RefreshTokenUserRelation } from "../models/refresh-token.model";

export type RefreshToken = RefreshTokenAttributes & Partial<RefreshTokenUserRelation>;
