import { UpdateUseCaseInterface } from "../interfaces/update-use-case.interface";

export class UpdateUseCaseDto implements UpdateUseCaseInterface {
  name?: string;
  briefDescription?: string;
}
