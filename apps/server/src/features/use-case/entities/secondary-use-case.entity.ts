import {
  SecondaryUseCaseAttributes,
  SecondaryUseCaseRelationships,
} from "../models/secondary-use-case.model";

export type SecondaryUseCase = SecondaryUseCaseAttributes & Partial<SecondaryUseCaseRelationships>;
