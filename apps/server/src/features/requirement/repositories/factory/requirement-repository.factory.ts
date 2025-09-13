import { Injectable } from "@nestjs/common";
import { RequirementRepository } from "../requirement/requirement.repository";
import { SystemRequirementRepository } from "../simple/system-requirement.repository";
import { EventSystemRequirementRepository } from "../simple/event-system-requirement.repository";
import { ActorRequirementRepository } from "../simple/actor-requirement.repository";
import { SystemActorCommunicationRequirementRepository } from "../simple/system-actor-communication-requirement.repository";
import { ConditionalRequirementRepository } from "../simple/conditional-requirement.repository";
import { RecursiveRequirementRepository } from "../simple/recursive-requirement.repository";
import { UseCaseReferenceRequirementRepository } from "../simple/use-case-reference-requirement.repository";
import { LogicalGroupRequirementRepository } from "../composite/logical-group-requirement.repository";
import { ConditionalGroupRequirementRepository } from "../composite/conditional-group-requirement.repository";
import { SimultaneousRequirementRepository } from "../composite/simultaneous-requirement.repository";
import { ExceptionalRequirementRepository } from "../composite/exceptional-requirement.repository";
import { RequirementType } from "../../enums/requirement-type.enum";
import { RequirementRepositoryInterface } from "../../interfaces/requirement-repository.interface";
import { Requirement } from "../../entities";

@Injectable()
export class RequirementRepositoryFactory {
  constructor(
    private readonly requirementRepository: RequirementRepository,
    private readonly systemRequirementRepository: SystemRequirementRepository,
    private readonly eventSystemRequirementRepository: EventSystemRequirementRepository,
    private readonly actorRequirementRepository: ActorRequirementRepository,
    private readonly systemActorCommunicationRequirementRepository: SystemActorCommunicationRequirementRepository,
    private readonly conditionalRequirementRepository: ConditionalRequirementRepository,
    private readonly recursiveRequirementRepository: RecursiveRequirementRepository,
    private readonly useCaseReferenceRequirementRepository: UseCaseReferenceRequirementRepository,
    private readonly logicalGroupRequirementRepository: LogicalGroupRequirementRepository,
    private readonly conditionalGroupRequirementRepository: ConditionalGroupRequirementRepository,
    private readonly simultaneousRequirementRepository: SimultaneousRequirementRepository,
    private readonly exceptionalRequirementRepository: ExceptionalRequirementRepository,
  ) {}

  getConcreteRepository(type: RequirementType): RequirementRepositoryInterface<Requirement> {
    switch (type) {
      case RequirementType.SYSTEM_REQUIREMENT:
        return this.systemRequirementRepository;
      case RequirementType.EVENT_SYSTEM_REQUIREMENT:
        return this.eventSystemRequirementRepository;
      case RequirementType.ACTOR_REQUIREMENT:
        return this.actorRequirementRepository;
      case RequirementType.SYSTEM_ACTOR_COMMUNICATION_REQUIREMENT:
        return this.systemActorCommunicationRequirementRepository;
      case RequirementType.CONDITIONAL_REQUIREMENT:
        return this.conditionalRequirementRepository;
      case RequirementType.RECURSIVE_REQUIREMENT:
        return this.recursiveRequirementRepository;
      case RequirementType.USE_CASE_REFERENCE_REQUIREMENT:
        return this.useCaseReferenceRequirementRepository;
      case RequirementType.LOGICAL_GROUP_REQUIREMENT:
        return this.logicalGroupRequirementRepository;
      case RequirementType.CONDITIONAL_GROUP_REQUIREMENT:
        return this.conditionalGroupRequirementRepository;
      case RequirementType.SIMULTANEOUS_REQUIREMENT:
        return this.simultaneousRequirementRepository;
      case RequirementType.EXCEPTIONAL_REQUIREMENT:
        return this.exceptionalRequirementRepository;
      default:
        throw new Error(`Invalid requirement type: ${type}`);
    }
  }

  getAbstractRepository(): RequirementRepository {
    return this.requirementRepository;
  }
}
