import { ModelFactory, Neogma } from "@repo/custom-neogma";

export function RefreshTokenModel(neogma: Neogma) {
  return ModelFactory(
    {
      name: "refresh-token",
      label: "refresh-token",
      schema: {
        id: {
          type: "string",
          unique: true,
          required: true,
          primaryKey: true,
        },
        token: {
          type: "string",
          unique: true,
          required: true,
        },
        issuedIp: {
          type: "string",
          format: "ip-address",
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
          required: true,
          default: false,
        },
        createdAt: {
          type: "string",
          format: "date-time",
          required: true,
          default: () => new Date().toString(),
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          required: false,
        },
        deletedAt: {
          type: "date",
          format: "date-time",
          required: false,
        },
      },
      relationships: {},
    },
    neogma,
  );
}
