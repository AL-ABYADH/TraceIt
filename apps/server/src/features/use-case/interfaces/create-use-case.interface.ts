import { UseCaseImportanceLevel } from "../enums/use-case-importance-level.enum";

export interface CreatePrimaryUseCaseInterface {
  name: string;
  projectId: string;
  primaryActorIds: string[];
  secondaryActorIds: string[];
  description?: string;
  importanceLevel: UseCaseImportanceLevel;
}

export interface CreateSecondaryUseCaseInterface {
  name: string;
  projectId: string;
  primaryUseCaseId: string;
  requirementId?: string;
  exceptionId?: string;
}
