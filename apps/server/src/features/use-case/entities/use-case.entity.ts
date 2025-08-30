import { Requirement } from "src/features/requirement/entities/requirement.entity";
import { UseCaseRelationship } from "./use-case-relationship.entity";

export abstract class UseCase {
  name: string;
  useCaseId: string;
  projectId: string;
  requirements: Requirement[] | null;
  relationships: UseCaseRelationship[] | null;
}
