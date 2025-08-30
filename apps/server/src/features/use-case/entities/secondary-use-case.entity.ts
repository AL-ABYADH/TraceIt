import { PrimaryUseCase } from "./primary-use-case.entity";
import { UseCase } from "./use-case.entity";

export class SecondaryUseCase extends UseCase {
  primaryUseCase: PrimaryUseCase;
}
