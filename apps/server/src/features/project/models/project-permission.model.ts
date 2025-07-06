import { ModelFactory, Neogma } from "@repo/custom-neogma";
import { idField } from "src/common/neogma-model-fields/id.schema";

export function ProjectPermissionModel(neogma: Neogma) {
  return ModelFactory(
    {
      name: "ProjectPermission",
      label: ["ProjectPermission"],
      schema: {
        id: idField,
        permission: {
          type: "string",
          required: true,
          minLength: 3,
          maxLength: 50,
          pattern: "^(?! )[A-Za-z0-9 _-]*(?<! )$", // Only allow alphanumeric characters, numbers, spaces, underscores, hyphens, and no leading or trailing spaces
          message:
            "is not a valid permission. It can only contain letters, numbers, spaces, underscores, hyphens, and no leading or trailing spaces.",
        },
        code: {
          type: "string",
          required: true,
          minLength: 2,
          maxLength: 50,
          pattern: "^[a-zA-Z0-9_]+$", // Only allow alphanumeric characters, numbers, and underscores
          message: "is not a valid code. It can only contain letters, numbers, and underscores.",
        },
      },
      primaryKeyField: "id",
    },
    neogma,
  );
}
