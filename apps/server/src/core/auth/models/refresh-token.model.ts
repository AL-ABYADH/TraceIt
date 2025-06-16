import { ModelFactory, Neogma } from "@repo/custom-neogma";
import { idField } from "../../../common/neogma-model-fields/id.schema";

export function RefreshTokenModel(neogma: Neogma) {
  return ModelFactory(
    {
      name: "refresh_token",
      label: "refresh_token",
      schema: {
        id: idField,
        token: {
          type: "string",
          unique: true,
          required: true,
        },
        issuedIp: {
          type: "string",
          pattern:
            "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$",
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
          required: false,
        },
        deletedAt: {
          type: "date",
          format: "date-time",
          required: false,
        },
      },
      primaryKeyField: "id",
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
