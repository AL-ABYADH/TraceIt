import { UseCaseActorType } from "../enums/use-case-actor-type.enum";
import { UseCase } from "./use-case.entity";

export class UseCaseActor extends UseCase {
  actor: any;
  type: UseCaseActorType;
  useCase: UseCase;
}
