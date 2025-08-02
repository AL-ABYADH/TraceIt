import { AddUseCaseParamsInterface } from "../interfaces/add-use-case.interface";

export class AddUseCaseDto implements AddUseCaseParamsInterface {
  name: string;
  projectId: string;
}
