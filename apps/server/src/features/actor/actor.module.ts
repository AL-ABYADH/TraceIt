import { Module } from "@nestjs/common";
import { ActorController } from "./controllers/actor.controller";
import { HumanActorRepository } from "./repositories/human-actor/human-actor.repository";
import { AiAgentActorRepository } from "./repositories/ai-agent-actor/ai-agent-actor.repository";
import { SoftwareActorRepository } from "./repositories/software-actor/software-actor.repository";
import { HardwareActorRepository } from "./repositories/hardware-actor/hardware-actor.repository";
import { EventActorRepository } from "./repositories/event-actor/event-actor.repository";
import { ActorRepository } from "./repositories/actor/actor.repository";
import { ActorService } from "./services/actor/actor.service";
import { ActorRepositoryFactory } from "./repositories/factory/actor-repository.factory";

@Module({
  controllers: [ActorController],
  providers: [
    ActorService,
    ActorRepository,
    HumanActorRepository,
    AiAgentActorRepository,
    SoftwareActorRepository,
    HardwareActorRepository,
    EventActorRepository,
    ActorRepositoryFactory,
  ],
})
export class ActorModule {}
