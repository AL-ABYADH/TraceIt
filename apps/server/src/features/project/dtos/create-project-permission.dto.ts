import { CreateProjectPermissionInterface } from "../interfaces/create-project-permission.interface";

export class CreateProjectPermissionDto implements CreateProjectPermissionInterface {
  permission: string;
  code: string;
}
