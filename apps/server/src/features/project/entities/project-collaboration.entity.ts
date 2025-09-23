import {
  ProjectCollaborationAttributes,
  ProjectCollaborationRelationships,
} from "../models/project-collaboration.model";

export type ProjectCollaboration = ProjectCollaborationAttributes &
  Partial<ProjectCollaborationRelationships>;
