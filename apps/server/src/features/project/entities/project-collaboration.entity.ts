import { User } from "src/features/user/entities/user.entity";
import { Project } from "./project.entity";
import { ProjectRole } from "./project-role.entity";

export class ProjectCollaboration {
  id: string;
  user: User;
  project: Project;
  projectRoles?: ProjectRole[];
  createdAt: Date;
  updatedAt?: Date;
}
