import { defineModelFactory, ModelFactory, Neogma } from "@repo/custom-neogma";
import { ProjectInvitationStatus } from "../enums/project-invitation-status.enum";

export const ProjectInvitationModel = defineModelFactory({
  name: "ProjectInvitation",
  label: ["ProjectInvitation"],
  schema: {
    expirationDate: {
      type: "string",
      required: true,
      format: "date-time",
    },
    status: {
      type: "string",
      required: true,
      enum: Object.values(ProjectInvitationStatus),
    },
    createdAt: {
      type: "string",
      required: true,
      format: "date-time",
    },
  },
  primaryKeyField: "id",
  relationships: {
    sender: {
      model: "User",
      direction: "out",
      name: "SENT_BY",
      cardinality: "one",
    },
    receiver: {
      model: "User",
      direction: "out",
      name: "INVITED",
      cardinality: "one",
    },
    project: {
      model: "Project",
      direction: "out",
      name: "INVITED_TO",
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
