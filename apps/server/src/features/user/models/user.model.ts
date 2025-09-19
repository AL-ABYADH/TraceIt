import { NeogmaModel, defineModelFactory, ModelFactoryDefinition } from "@repo/custom-neogma";
import { ProjectAttributes } from "../../project/models/project.model";

export type UserAttributes = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  password: string;
  createdAt: string;
};

export interface UserRelationships {
  projects: ProjectAttributes[]; // made it an array or objects made it optional
  collaborations: any;
  refreshTokens: any;
}

export type UserModelType = NeogmaModel<UserAttributes, UserRelationships>;

export const UserModel: ModelFactoryDefinition<UserAttributes, UserRelationships> =
  defineModelFactory<UserAttributes, UserRelationships>({
    name: "User",
    label: ["User"],
    schema: {
      username: {
        type: "string",
        required: true,
        minLength: 3,
        maxLength: 30,
        pattern: "^[a-zA-Z0-9_]+$",
        message: "is not a valid username. It can only contain letters, numbers, and underscores.",
      },
      displayName: {
        type: "string",
        required: true,
        minLength: 1,
        maxLength: 100,
      },
      email: {
        type: "string",
        required: true,
        format: "email",
        maxLength: 254,
      },
      emailVerified: {
        type: "boolean",
        required: true,
      },
      password: {
        type: "string",
        required: true,
      },
    },
    relationships: {
      projects: {
        model: "Project",
        direction: "out",
        name: "OWNS",
        cardinality: "many",
      },
      collaborations: {
        model: "ProjectCollaboration",
        direction: "out",
        name: "HAS_COLLABORATION",
        cardinality: "many",
      },
      refreshTokens: {
        model: "refresh_token",
        direction: "out",
        name: "HAS_TOKEN",
        cardinality: "many",
      },
    },
  });
