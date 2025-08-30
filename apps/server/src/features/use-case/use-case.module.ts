import { Module } from "@nestjs/common";
import { UseCaseController } from "./controllers/use-case.controller";
import { UseCaseService } from "./services/use-case/use-case.service";
import { UseCaseRepository } from "./repositories/use-case/use-case.repository";
import { PrimaryUseCaseRepository } from "./repositories/primary-use-case/primary-use-case.repository";
import { SecondaryUseCaseRepository } from "./repositories/secondary-use-case/secondary-use-case.repository";
import { UseCaseActorRepository } from "./repositories/use-case-actor/use-case-actor.repository";
import { UseCaseDiagramRepository } from "./repositories/use-case-diagram/use-case-diagram.repository";
import { UseCaseRelationshipRepository } from "./repositories/use-case-relationship/use-case-relationship.repository";
import { UseCaseRepositoryFactory } from "./repositories/factory/use-case-repository.factory";

@Module({
  controllers: [UseCaseController],
  providers: [
    UseCaseService,
    UseCaseRepository,
    PrimaryUseCaseRepository,
    SecondaryUseCaseRepository,
    UseCaseActorRepository,
    UseCaseDiagramRepository,
    UseCaseRelationshipRepository,
    UseCaseRepositoryFactory,
  ],
})
export class UseCaseModule {}
