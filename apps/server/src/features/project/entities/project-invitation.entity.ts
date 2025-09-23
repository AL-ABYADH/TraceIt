import {
  ProjectInvitationAttributes,
  ProjectInvitationRelationships,
} from "../models/project-invitation.model";

export type ProjectInvitation = ProjectInvitationAttributes &
  Partial<ProjectInvitationRelationships>;
