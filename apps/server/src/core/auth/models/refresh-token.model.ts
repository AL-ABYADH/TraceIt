import {
  ModelFactory,
  Neogma,
  EnhancedNeogmaModel,
  AbstractModelFactory,
} from "@repo/custom-neogma";

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

interface RefreshTokenUserRelation {
  user: any;
}

export type RefreshTokenModelType = EnhancedNeogmaModel<
  RefreshTokenAttributes,
  RefreshTokenUserRelation,
  object,
  object
>;

export function RefreshTokenModel(neogma: Neogma): RefreshTokenModelType {
  return AbstractModelFactory<RefreshTokenAttributes, RefreshTokenUserRelation>(
    {
      name: "refresh_token",
      label: "refresh_token",
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
        createdAt: {
          type: "string",
          format: "date-time",
          hidden: true,
        },
        updatedAt: {
          type: "string",
          format: "date-time",
        },
        deletedAt: {
          type: "date",
          format: "date-time",
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
    },
    neogma,
  );
}
