import {
  PrimaryUseCaseAttributes,
  PrimaryUseCaseRelationships,
} from "../models/primary-use-case.model";

export type PrimaryUseCase = PrimaryUseCaseAttributes & Partial<PrimaryUseCaseRelationships>;
