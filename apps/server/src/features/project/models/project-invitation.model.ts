import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { ProjectInvitationStatus } from "../enums/project-invitation-status.enum";
import { UserAttributes } from "../../user/models/user.model";
import { ProjectAttributes } from "./project.model";
import { ProjectRole } from "../entities/project-role.entity";

export type ProjectInvitationAttributes = {
  id: string;
  expirationDate: string; // ISO date string
  status: ProjectInvitationStatus;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
};

export interface ProjectInvitationRelationships {
  sender: UserAttributes;
  receiver: UserAttributes;
  project: ProjectAttributes;
  projectRoles: ProjectRole[];
}

export type ProjectInvitationModelType = NeogmaModel<
  ProjectInvitationAttributes,
  ProjectInvitationRelationships
>;

export const ProjectInvitationModel: ModelFactoryDefinition<
  ProjectInvitationAttributes,
  ProjectInvitationRelationships
> = defineModelFactory<ProjectInvitationAttributes, ProjectInvitationRelationships>({
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
  },
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
