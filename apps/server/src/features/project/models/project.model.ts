import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { ProjectStatus } from "../enums/project-status.enum";
import { UserAttributes } from "../../user/models/user.model";

export type ProjectAttributes = {
  id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export interface ProjectRelationships {
  owner: UserAttributes;
  collaborations: any[]; // Replace with actual type if available
  actors: any[]; // Replace with actual type if available
  // useCases: any[]; // Replace with actual type if available
  // classes: any[]; // Replace with actual type if available
}

export type ProjectModelType = NeogmaModel<ProjectAttributes, ProjectRelationships>;

export const ProjectModel: ModelFactoryDefinition<ProjectAttributes, ProjectRelationships> =
  defineModelFactory<ProjectAttributes, ProjectRelationships>({
    name: "Project",
    label: ["Project"],
    schema: {
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
      // useCases: {
      //   model: "UseCase",
      //   direction: "in",
      //   name: "BELONGS_TO",
      //   cardinality: "many",
      // },
      // classes: {
      //   model: "Class",
      //   direction: "in",
      //   name: "BELONGS_TO",
      //   cardinality: "many",
      // },
    },
  });
