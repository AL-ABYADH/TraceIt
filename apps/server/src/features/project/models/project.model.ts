import { ModelFactory, Neogma } from "@repo/custom-neogma";
import { ProjectStatus } from "../enums/project-status.enum";
import { idField } from "src/common/neogma-model-fields/id.schema";

export function ProjectModel(neogma: Neogma) {
  return ModelFactory(
    {
      name: "Project",
      label: "Project",
      schema: {
        id: idField,
        name: {
          type: "string",
          required: true,
          minLength: 1,
          maxLength: 100,
          pattern: "^(?! )[A-Za-z0-9 _-]*(?<! )$", // Only allow alphanumeric characters, numbers, spaces, underscores, hyphens, and no leading or trailing spaces
          message:
            "is not a valid name. It can only contain letters, numbers, spaces, underscores, hyphens, and no leading or trailing spaces.",
        },
        description: {
          type: "string",
          required: false,
          minLength: 3,
          maxLength: 1000,
          pattern: "^(?! )[A-Za-z0-9 _-]*(?<! )$", // Only allow alphanumeric characters, numbers, spaces, underscores, hyphens, and no leading or trailing spaces
          message:
            "is not a valid description. It can only contain letters, numbers, spaces, underscores, hyphens, and no leading or trailing spaces.",
        },
        status: {
          type: "string",
          required: true,
          enum: Object.values(ProjectStatus),
        },
      },
      primaryKeyField: "id",
      relationships: {
        owner: {
          model: "User",
          direction: "in",
          name: "OWNS",
          cardinality: "one",
        },
        collaborations: {
          model: "ProjectCollaboration",
          direction: "in",
          name: "COLLABORATION_AT",
          cardinality: "many",
        },
        actors: {
          model: "Actor",
          direction: "in",
          name: "BELONGS_TO",
          cardinality: "many",
        },
        useCases: {
          model: "UseCase",
          direction: "in",
          name: "BELONGS_TO",
          cardinality: "many",
        },
        classes: {
          model: "Class",
          direction: "in",
          name: "BELONGS_TO",
          cardinality: "many",
        },
      },
    },
    neogma,
  );
}
