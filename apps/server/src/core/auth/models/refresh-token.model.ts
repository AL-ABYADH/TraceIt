import { NeogmaModel, defineModelFactory, ModelFactoryDefinition } from "@repo/custom-neogma";
import { UserAttributes } from "../../../features/user/models/user.model";

export type RefreshTokenAttributes = {
  id: string;
  token: string;
  issuedIp: string;
  userAgent: string;
  expiresAt: string;
  revoked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export interface RefreshTokenUserRelation {
  user: UserAttributes;
}

export type RefreshTokenModelType = NeogmaModel<RefreshTokenAttributes, RefreshTokenUserRelation>;

export const RefreshTokenModel: ModelFactoryDefinition<
  RefreshTokenAttributes,
  RefreshTokenUserRelation
> = defineModelFactory<RefreshTokenAttributes, RefreshTokenUserRelation>({
  name: "refresh_token",
  label: ["refresh_token"],
  schema: {
    token: {
      type: "string",
      unique: true,
      required: true,
    },
    issuedIp: {
      type: "string",
      pattern:
        "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\." +
        "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\." +
        "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\." +
        "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|" +
        "([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$",
      required: true,
    },
    userAgent: {
      type: "string",
      required: true,
    },
    expiresAt: {
      type: "string",
      format: "date-time",
      required: true,
    },
    revoked: {
      type: "boolean",
      default: false,
    },
  },
  relationships: {
    user: {
      model: "User",
      direction: "in",
      name: "HAS_TOKEN",
      cardinality: "one",
    },
  },
});
