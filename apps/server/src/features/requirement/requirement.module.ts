import { Module } from "@nestjs/common";
import { RequirementController } from "./controllers/requirement/requirement.controller";
import { RequirementService } from "./services/requirement/requirement.service";
import { RequirementFactoryService } from "./services/requirement-factory/requirement-factory.service";
import { RequirementRepository } from "./repositories/requirement/requirement.repository";
import { SimpleRequirementRepository } from "./repositories/simple-requirement/simple-requirement.repository";
import { CompositeRequirementRepository } from "./repositories/composite-requirement/composite-requirement.repository";

// Simple Requirement Repositories
import { SystemRequirementRepository } from "./repositories/simple/system-requirement.repository";
import { EventSystemRequirementRepository } from "./repositories/simple/event-system-requirement.repository";
import { ActorRequirementRepository } from "./repositories/simple/actor-requirement.repository";
import { SystemActorCommunicationRequirementRepository } from "./repositories/simple/system-actor-communication-requirement.repository";
import { ConditionalRequirementRepository } from "./repositories/simple/conditional-requirement.repository";
import { RecursiveRequirementRepository } from "./repositories/simple/recursive-requirement.repository";
import { UseCaseReferenceRequirementRepository } from "./repositories/simple/use-case-reference-requirement.repository";

// Composite Requirement Repositories
import { LogicalGroupRequirementRepository } from "./repositories/composite/logical-group-requirement.repository";
import { ConditionalGroupRequirementRepository } from "./repositories/composite/conditional-group-requirement.repository";
import { SimultaneousRequirementRepository } from "./repositories/composite/simultaneous-requirement.repository";
import { ExceptionalRequirementRepository } from "./repositories/composite/exceptional-requirement.repository";

// Factory
import { RequirementRepositoryFactory } from "./repositories/factory/requirement-repository.factory";

// Related modules
import { ProjectModule } from "../project/project.module";
import { ActorModule } from "../actor/actor.module";
import { UseCaseModule } from "../use-case/use-case.module";

@Module({
  imports: [ProjectModule, ActorModule, UseCaseModule],
  controllers: [RequirementController],
  providers: [
    // Services
    RequirementService,
    RequirementFactoryService,

    // Base Repositories
    RequirementRepository,
    SimpleRequirementRepository,
    CompositeRequirementRepository,

    // Simple Requirement Repositories
    SystemRequirementRepository,
    EventSystemRequirementRepository,
    ActorRequirementRepository,
    SystemActorCommunicationRequirementRepository,
    ConditionalRequirementRepository,
    RecursiveRequirementRepository,
    UseCaseReferenceRequirementRepository,

    // Composite Requirement Repositories
    LogicalGroupRequirementRepository,
    ConditionalGroupRequirementRepository,
    SimultaneousRequirementRepository,
    ExceptionalRequirementRepository,

    // Factory
    RequirementRepositoryFactory,
  ],
  exports: [RequirementService, RequirementFactoryService],
})
export class RequirementModule {}
