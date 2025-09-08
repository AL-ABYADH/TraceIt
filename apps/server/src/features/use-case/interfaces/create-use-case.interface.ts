export interface CreateUseCaseInterface {
  name: string;
  projectId: string;
  primaryActorIds: string[];
  secondaryActorIds: string[];
  description?: string;
}

export interface CreateSecondaryUseCaseInterface {
  name: string;
  projectId: string;
  primaryUseCaseId: string;
}

export interface CreateDiagramUseCaseInterface {
  projectId: string;
  initial: string;
  final?: string;
  useCaseIds?: string[];
}
