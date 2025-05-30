import { User } from "src/features/user/entities/user.entity";
import { Project } from "./project.entity";
import { ProjectRole } from "./project-role.entity";

export class ProjectCollaboration {
  user: User;
  project: Project;
  projectRoles: ProjectRole[] | null;
  createdAt: Date;
}
