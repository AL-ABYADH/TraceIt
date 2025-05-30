import { ProjectPermission } from "./project-permission.entity";

export class ProjectRole {
  id: string;
  name: string;
  projectPermissions: ProjectPermission[] | null;
}
