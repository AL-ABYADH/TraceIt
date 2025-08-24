import { UpdateProjectInterface } from "../interfaces/update-project.interface";

export class UpdateProjectDto implements UpdateProjectInterface {
  name: string;
  description?: string;
}
