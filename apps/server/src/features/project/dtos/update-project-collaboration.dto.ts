import { UpdateProjectCollaborationInterface } from "./../interfaces/update-project-collaboration.interface";

export class UpdateProjectCollaborationDto implements UpdateProjectCollaborationInterface {
  roleIds: string[];
}
