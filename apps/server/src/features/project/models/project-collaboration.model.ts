import { defineModelFactory } from "@repo/custom-neogma";

export const ProjectCollaborationModel = defineModelFactory({
  name: "ProjectCollaboration",
  label: ["ProjectCollaboration"],
  schema: {
    createdAt: {
      type: "string",
      required: true,
      format: "date-time",
    },
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
});
