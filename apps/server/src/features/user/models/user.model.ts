import { ModelFactory, Neogma } from "@repo/custom-neogma";
import { idField } from "src/common/neogma-model-fields/id.schema";

export function UserModel(neogma: Neogma) {
  return ModelFactory(
    {
      name: "User",
      label: "User",
      schema: {
        id: idField,
        username: {
          type: "string",
          required: true,
          minLength: 3,
          maxLength: 30,
          pattern: "^[a-zA-Z0-9_]+$", // Only allow alphanumeric characters, numbers, and underscores
          message:
            "is not a valid username. It can only contain letters, numbers, and underscores.",
        },
        displayName: {
          type: "string",
          required: true,
          minLength: 1,
          maxLength: 100,
        },
        email: {
          type: "string",
          required: true,
          format: "email",
          maxLength: 254,
        },
        emailVerified: {
          type: "boolean",
          required: true,
        },
        password: {
          type: "string",
          required: true,
        },
        createdAt: {
          type: "string",
          required: true,
          format: "date-time",
        },
      },
      primaryKeyField: "id",
      relationships: {
        projects: {
          model: "Project",
          direction: "out",
          name: "OWNS",
          cardinality: "many",
        },
        collaborations: {
          model: "ProjectCollaboration",
          direction: "out",
          name: "HAS_COLLABORATION",
          cardinality: "many",
        },
      },
    },
    neogma,
  );
}
