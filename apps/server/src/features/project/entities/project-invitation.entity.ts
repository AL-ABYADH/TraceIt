import { Project } from "./project.entity";
import { ProjectRole } from "./project-role.entity";
import { ProjectInvitationStatus } from "../enums/project-invitation-status.enum";
import { UserAttributes } from "../../user/models/user.model";

export class ProjectInvitation {
  id: string;
  sender: UserAttributes;
  receiver: UserAttributes;
  project: Project;
  projectRoles: ProjectRole[] | null;
  expirationDate: Date;
  status: ProjectInvitationStatus;
  createdAt: Date;
  updatedAt?: Date;
}
