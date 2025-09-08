import { Project } from "./project.entity";
import { ProjectRole } from "./project-role.entity";
import { ProjectInvitationStatus } from "../enums/project-invitation-status.enum";
import { User } from "../../user/models/user.model";

export class ProjectInvitation {
  id: string;
  sender: User;
  receiver: User;
  project: Project;
  projectRoles: ProjectRole[] | null;
  expirationDate: Date;
  status: ProjectInvitationStatus;
  createdAt: Date;
  updatedAt?: Date;
}
