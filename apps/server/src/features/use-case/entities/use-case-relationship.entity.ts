import { UseCaseRelationshipType } from "../enums/use-case-relationship-type.enum";
import { UseCase } from "./use-case.entity";

/**
 * Represents a relationship between one use case and another
 * (e.g., INCLUDES or EXTENDS).
 * This class is not a subclass of UseCase, but is composed with it.
 */
export class UseCaseRelationship {
  relatedUseCase: UseCase; // The target use case in the relationship
  type: UseCaseRelationshipType; // Type of relationship (INCLUDES or EXTENDS)
}
