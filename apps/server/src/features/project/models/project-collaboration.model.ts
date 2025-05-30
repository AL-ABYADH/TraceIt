import { ModelFactory, Neogma } from "@repo/custom-neogma";
import { idField } from "src/common/neogma-model-fields/id.schema";

export function ProjectCollaborationModel(neogma: Neogma) {
  return ModelFactory(
    {
      name: "ProjectCollaboration",
      label: "ProjectCollaboration",
      schema: {
        id: idField,
      },
      primaryKeyField: "id",
      relationships: {
        user: {
          model: "User",
          direction: "in",
          name: "HAS_COLLABORATION",
          cardinality: "one",
        },
        project: {
          model: "Project",
          direction: "out",
          name: "COLLABORATION_AT",
          cardinality: "one",
        },
        projectRoles: {
          model: "ProjectRole",
          direction: "out",
          name: "ASSIGNED_ROLE",
          cardinality: "many",
        },
      },
    },
    neogma,
  );
}
