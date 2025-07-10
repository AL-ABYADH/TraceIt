import { ModelFactory, Neogma } from "@repo/custom-neogma";

export function ProjectRoleModel(neogma: Neogma) {
  return ModelFactory(
    {
      name: "ProjectRole",
      label: ["ProjectRole"],
      schema: {
        name: {
          type: "string",
          required: true,
          minLength: 1,
          maxLength: 50,
          pattern: "^[a-zA-Z0-9_]+$", // Only allow alphanumeric characters, numbers, and underscores
          message: "is not a valid name. It can only contain letters, numbers, and underscores.",
        },
      },
      primaryKeyField: "id",
      relationships: {
        projectPermissions: {
          model: "ProjectPermission",
          direction: "out",
          name: "HAS_PERMISSION",
          cardinality: "many",
        },
      },
    },
    neogma,
  );
}
