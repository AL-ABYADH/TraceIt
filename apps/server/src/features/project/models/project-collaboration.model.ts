import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";

export type ProjectCollaborationAttributes = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export interface ProjectCollaborationRelationships {
  user: any;
  project: any;
  projectRoles: any[];
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
