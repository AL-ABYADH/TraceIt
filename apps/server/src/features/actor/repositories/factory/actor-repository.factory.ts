import { Injectable } from "@nestjs/common";
import { ActorRepository } from "../actor/actor.repository";
import { AiAgentActorRepository } from "../ai-agent-actor/ai-agent-actor.repository";
import { EventActorRepository } from "../event-actor/event-actor.repository";
import { HardwareActorRepository } from "../hardware-actor/hardware-actor.repository";
import { HumanActorRepository } from "../human-actor/human-actor.repository";
import { SoftwareActorRepository } from "../software-actor/software-actor.repository";
import ActorSubtype from "../../enums/actor-subtype.enum";
import { Actor } from "../../entities/actor.entity";
import { ConcreteActorRepositoryInterface } from "../interfaces/concrete-actor-repository.interface";
import { InvalidActorSubtypeError } from "../../errors/invalid-actor-subtype.error";

@Injectable()
export class ActorRepositoryFactory {
  constructor(
    private readonly abstractActorRepository: ActorRepository,
    private readonly aiAgentRepo: AiAgentActorRepository,
    private readonly eventRepo: EventActorRepository,
    private readonly hardwareRepo: HardwareActorRepository,
    private readonly humanRepo: HumanActorRepository,
    private readonly softwareRepo: SoftwareActorRepository,
  ) {}

  getConcreteRepository(subType: ActorSubtype): ConcreteActorRepositoryInterface<Actor> {
    switch (subType) {
      case ActorSubtype.AI_AGENT:
        return this.aiAgentRepo;
      case ActorSubtype.EVENT:
        return this.eventRepo;
      case ActorSubtype.HARDWARE:
        return this.hardwareRepo;
      case ActorSubtype.HUMAN:
        return this.humanRepo;
      case ActorSubtype.SOFTWARE:
        return this.softwareRepo;
      default:
        throw new InvalidActorSubtypeError(subType);
    }
  }

  getAbstractRepository(): ActorRepository {
    return this.abstractActorRepository;
  }
}
