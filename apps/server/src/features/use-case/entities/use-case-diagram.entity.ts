import { UseCase } from "./use-case.entity";
import { Json } from "src/common/types/json.type";
import { UseCaseActor } from "./use-case-actor.entity";

/**
 * Represents a use case diagram that includes multiple use cases and actors.
 * This class is not a subtype of UseCase, but rather composes multiple use cases and actors.
 */
export class UseCaseDiagram {
  useCases: UseCase[];
  actors: UseCaseActor[];
  initial: Json;
  final?: Json;
}
