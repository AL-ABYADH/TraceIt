import { Project } from "./project.entity";
import { ProjectRole } from "./project-role.entity";
import { UserAttributes } from "../../user/models/user.model";

export class ProjectCollaboration {
  id: string;
  user: UserAttributes;
  project: Project;
  projectRoles?: ProjectRole[];
  createdAt: Date;
  updatedAt?: Date;
}
