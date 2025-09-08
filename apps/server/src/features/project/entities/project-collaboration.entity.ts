import { Project } from "./project.entity";
import { ProjectRole } from "./project-role.entity";
import { User } from "../../user/models/user.model";

export class ProjectCollaboration {
  id: string;
  user: User;
  project: Project;
  projectRoles?: ProjectRole[];
  createdAt: Date;
  updatedAt?: Date;
}
