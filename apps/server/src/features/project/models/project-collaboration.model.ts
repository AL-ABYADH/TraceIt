import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { ProjectRoleAttributes } from "./project-role.model";
import { ProjectAttributes } from "./project.model";
import { UserAttributes } from "../../user/models/user.model";

export type ProjectCollaborationAttributes = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export interface ProjectCollaborationRelationships {
  user: UserAttributes;
  project: ProjectAttributes;
  projectRoles: ProjectRoleAttributes[];
}

export type ProjectCollaborationModelType = NeogmaModel<
  ProjectCollaborationAttributes,
  ProjectCollaborationRelationships
>;

export const ProjectCollaborationModel: ModelFactoryDefinition<
  ProjectCollaborationAttributes,
  ProjectCollaborationRelationships
> = defineModelFactory<ProjectCollaborationAttributes, ProjectCollaborationRelationships>({
  name: "ProjectCollaboration",
  label: ["ProjectCollaboration"],
  schema: {},
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
