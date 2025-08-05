import { Actor } from "../../actor/entities/actor.entity";
import { UseCase } from "./use-case.entity";
import { UseCaseActorType } from "../enums/use-case-actor-type.enum";

/**
 * Represents the association between an Actor and a UseCase.
 * Specifies whether the actor plays a primary or secondary role.
 * This class does not inherit from UseCase but is composed with it.
 */
export class UseCaseActor {
  actor: Actor; // The associated actor
  type: UseCaseActorType; // Role type: PRIMARY or SECONDARY
  useCase: UseCase; // The related use case
}
