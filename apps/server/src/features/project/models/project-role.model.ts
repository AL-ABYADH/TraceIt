import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";

export type ProjectRoleAttributes = {
  id: string;
  name: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
};

export interface ProjectRoleRelationships {
  projectPermissions: string[]; // Array of ProjectPermission IDs
}

export type ProjectRoleModelType = NeogmaModel<ProjectRoleAttributes, ProjectRoleRelationships>;

export const ProjectRoleModel: ModelFactoryDefinition<
  ProjectRoleAttributes,
  ProjectRoleRelationships
> = defineModelFactory<ProjectRoleAttributes, ProjectRoleRelationships>({
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
  relationships: {
    projectPermissions: {
      model: "ProjectPermission",
      direction: "out",
      name: "HAS_PERMISSION",
      cardinality: "many",
    },
  },
});
