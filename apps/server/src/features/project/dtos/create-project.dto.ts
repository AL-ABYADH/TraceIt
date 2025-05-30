import { CreateProjectInterface } from "../interfaces/create-project.interface";

export class CreateProjectDto implements CreateProjectInterface {
  name: string;
  description: string | null;
  userId: string;
}
