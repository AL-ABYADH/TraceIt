import { UpdateProjectRoleInterface } from "../interfaces/update-project-role.interface";

export class UpdateProjectRoleDto implements UpdateProjectRoleInterface {
  name: string;
  permissionIds: string[];
}
