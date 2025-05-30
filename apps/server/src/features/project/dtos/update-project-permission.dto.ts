import { UpdateProjectPermissionInterface } from "../interfaces/update-project-permission.interface";

export class UpdateProjectPermissionDto implements UpdateProjectPermissionInterface {
  permission: string;
  code: string;
}
