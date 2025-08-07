import { UseCase } from "./use-case.entity";
import { Project } from "../../project/entities/project.entity";
import { UseCaseDescription } from "./use-case-description.entity";
import { SecondaryUseCase } from "./secondary-use-case.entity";
import { UseCaseActor } from "./use-case-actor.entity";

/**
 * Represents a primary use case, extending the base UseCase entity.
 * Includes additional properties specific to primary use cases.
 */
export class PrimaryUseCase extends UseCase {
  actors: UseCaseActor[]; // List of associated UseCaseActor entities
  briefDescription?: string; // Optional short description of the use case
  useCaseDescription: UseCaseDescription; // Detailed description object
  number: number; // Numerical identifier for the use case
  project: Project; // The project this use case belongs to
  associatedClasses: any[]; // Related domain or implementation classes
  secondaryUseCases: SecondaryUseCase[]; // List of linked secondary use cases
  sequenceDiagrams: any[]; // Associated sequence diagrams (if any)
  activityDiagram: any; // Associated activity diagram (if any)
}
