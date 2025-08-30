import { UseCaseRelationshipType } from "../enums/use-case-relationship-type.enum";

/**
 * Represents a relationship between one use case and another
 * (e.g., INCLUDES or EXTENDS).
 * This class is not a subclass of UseCase, but is composed with it.
 */
export class UseCaseRelationship {
  relatedUseCaseId: string;
  type: UseCaseRelationshipType;
}
