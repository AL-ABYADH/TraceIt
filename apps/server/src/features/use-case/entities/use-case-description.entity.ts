import { PrimaryUseCase } from "./primary-use-case.entity";
import { UseCaseImportanceLevel } from "../enums/use-case-importance-level.enum";
import { UseCase } from "./use-case.entity";

export class UseCaseDescription extends UseCase {
  useCase: PrimaryUseCase;
  useCaseId: number;
  importanceLevel: UseCaseImportanceLevel;
  briefDescription: string;
  primaryActors: any[];
  secondaryActors: any[];
  normalFlow: any[];
  subFlows: any[];
  exceptionalFlows: any[];
}
