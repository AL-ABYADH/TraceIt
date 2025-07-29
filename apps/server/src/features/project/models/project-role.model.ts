import { defineModelFactory } from "@repo/custom-neogma";

export const ProjectRoleModel = defineModelFactory({
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
});
