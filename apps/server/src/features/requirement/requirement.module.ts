import { forwardRef, Module } from "@nestjs/common";
import { RequirementRepository } from "./repositories/requirement.repository";
import { RequirementController } from "./controllers/requirement.controller";
import { RequirementExceptionController } from "./controllers/requirement-exception.controller";
import { RequirementService } from "./services/requirement.service";
import { RequirementExceptionService } from "./services/requirement-exception.service";
import { ExceptionalRequirementRepository } from "./repositories/exceptional-requirement.repository";
import { ProjectModule } from "../project/project.module";
import { ActorModule } from "../actor/actor.module";
import { UseCaseModule } from "../use-case/use-case.module";

@Module({
  imports: [ProjectModule, ActorModule, forwardRef(() => UseCaseModule)],
  controllers: [RequirementController, RequirementExceptionController],
  providers: [
    RequirementService,
    RequirementExceptionService,
    RequirementRepository,
    ExceptionalRequirementRepository,
  ],
  exports: [RequirementService, RequirementExceptionService],
})
export class RequirementModule {}
