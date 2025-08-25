import { CreateProjectParamsInterface } from "../interfaces/create-project-params.interface";

export class CreateProjectDto implements CreateProjectParamsInterface {
  name: string;
  description?: string;
  userId: string;
}
