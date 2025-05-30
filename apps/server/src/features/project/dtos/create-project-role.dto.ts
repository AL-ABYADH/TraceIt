import { CreateProjectRoleInterface } from "../interfaces/create-project-role.interface";

export class CreateProjectRoleDto implements CreateProjectRoleInterface {
  name: string;
  permissionIds: string[];
}
