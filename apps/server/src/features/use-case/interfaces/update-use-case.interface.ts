import { UseCaseImportanceLevel } from "@repo/shared-schemas";

export interface UpdatePrimaryUseCaseInterface {
  name?: string;
  importanceLevel?: UseCaseImportanceLevel;
  description?: string;
  primaryActorIds?: string[];
  secondaryActorIds?: string[];
}

// Secondary use case update properties
export interface UpdateSecondaryUseCaseInterface {
  name?: string;
  primaryUseCaseId?: string;
}

export interface UpdateUseCaseDiagramInterface {
  initial?: string;
  final?: string;
}

// Interfaces for actor operations
export interface AddActorsInterface {
  actorIds: string[];
}

export interface RemoveActorsInterface {
  actorIds: string[];
}
