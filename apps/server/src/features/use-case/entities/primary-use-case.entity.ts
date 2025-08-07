import { UseCase } from "./use-case.entity";
import { UseCaseActor } from "./use-case-actor.entity";
import { Class } from "src/features/class/entities/class.entity";

/**
 * Represents a primary use case, extending the base UseCase entity.
 * Includes additional properties specific to primary use cases.
 */
export class PrimaryUseCase extends UseCase {
  actors: UseCaseActor[];
  description?: string;
  projectId: string;
  classes: Class[];
  // sequenceDiagrams: any[];
  // activityDiagram: any;
}
