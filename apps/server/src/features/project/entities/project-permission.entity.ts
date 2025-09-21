import {
  ProjectPermissionAttributes,
  ProjectPermissionRelationships,
} from "../models/project-permission.model";

export type ProjectPermission = ProjectPermissionAttributes &
  Partial<ProjectPermissionRelationships>;
