import { UseCase } from "./use-case.entity";
import { Actor } from "../../actor/entities/actor.entity";

/**
 * Represents a use case diagram that includes multiple use cases and actors.
 * This class is not a subtype of UseCase, but rather composes multiple use cases and actors.
 */
export class UseCaseDiagram {
  useCases: UseCase[]; // List of use cases included in the diagram
  actors: Actor[]; // List of participating actors
  initial: object; // Initial diagram state or structure (e.g., raw JSON)
  final?: object; // Optional final state of the diagram (e.g., modified layout or enriched data)
}
