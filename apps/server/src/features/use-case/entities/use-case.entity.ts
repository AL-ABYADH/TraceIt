import { UseCaseAttributes, UseCaseRelationships } from "../models/use-case.model";

export type UseCase = UseCaseAttributes & Partial<UseCaseRelationships>;
