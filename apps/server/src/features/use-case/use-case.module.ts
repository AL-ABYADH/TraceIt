import { Module } from "@nestjs/common";
import { UseCaseRepository } from "./repositories/use-case/use-case.repository";
import { PrimaryUseCaseRepository } from "./repositories/primary-use-case/primary-use-case.repository";
import { SecondaryUseCaseRepository } from "./repositories/secondary-use-case/secondary-use-case.repository";
import { PrimaryUseCaseController } from "./controllers/primary-use-case/primary-use-case.controller";
import { PrimaryUseCaseService } from "./services/primary-use-case/primary-use-case.service";
import { UseCaseDiagramRepository } from "./repositories/use-case-diagram/use-case-diagram.repository";
import { UseCaseService } from "./services/use-case/use-case.service";
import { UseCaseController } from "./controllers/use-case/use-case.controller";
import { SecondaryUseCaseController } from "./controllers/secondary-use-case/secondary-use-case.controller";
import { SecondaryUseCaseService } from "./services/secondary-use-case/secondary-use-case.service";
import { UseCaseDiagramController } from "./controllers/use-case-diagram/use-case-diagram.controller";
import { UseCaseDiagramService } from "./services/use-case-diagram/use-case-diagram.service";
import { ProjectModule } from "../project/project.module";
import { ActorModule } from "../actor/actor.module";

@Module({
  imports: [ProjectModule, ActorModule],
  controllers: [
    PrimaryUseCaseController,
    UseCaseController,
    SecondaryUseCaseController,
    UseCaseDiagramController,
  ],
  providers: [
    UseCaseRepository,
    PrimaryUseCaseRepository,
    SecondaryUseCaseRepository,
    UseCaseDiagramRepository,
    PrimaryUseCaseService,
    UseCaseService,
    SecondaryUseCaseService,
    UseCaseDiagramService,
  ],
  exports: [PrimaryUseCaseService, SecondaryUseCaseService, UseCaseService, UseCaseDiagramService],
})
export class UseCaseModule {}
