import { CreateProjectCollaborationInterface } from "../interfaces/create-project-collaboration.interface";

export class CreateProjectPermissionDto implements CreateProjectCollaborationInterface {
  projectId: string;
  userId: string;
  roleIds: string[];
}
