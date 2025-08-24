import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";

export type ProjectPermissionAttributes = {
  id: string;
  permission: string;
  code: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
};

export interface ProjectPermissionRelationships {
  projectRoles: string[];
}

export type ProjectPermissionModelType = NeogmaModel<
  ProjectPermissionAttributes,
  ProjectPermissionRelationships
>;

export const ProjectPermissionModel: ModelFactoryDefinition<
  ProjectPermissionAttributes,
  ProjectPermissionRelationships
> = defineModelFactory<ProjectPermissionAttributes, ProjectPermissionRelationships>({
  name: "ProjectPermission",
  label: ["ProjectPermission"],
  schema: {
    permission: {
      type: "string",
      required: true,
      minLength: 3,
      maxLength: 50,
      pattern: "^(?! )[A-Za-z0-9 _-]*(?<! )$", // Only allow alphanumeric characters, numbers, spaces, underscores, hyphens, and no leading or trailing spaces
      message:
        "is not a valid permission. It can only contain letters, numbers, spaces, underscores, hyphens, and no leading or trailing spaces.",
    },
    code: {
      type: "string",
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: "^[a-zA-Z0-9_]+$", // Only allow alphanumeric characters, numbers, and underscores
      message: "is not a valid code. It can only contain letters, numbers, and underscores.",
    },
  },
  relationships: {
    projectRoles: {
      model: "ProjectRole",
      direction: "in",
      name: "HAS_PERMISSION",
      cardinality: "many",
    },
  },
});
