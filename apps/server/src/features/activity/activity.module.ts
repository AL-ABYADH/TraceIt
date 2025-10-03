import { Module } from "@nestjs/common";
import { ActivityController } from "./controllers/activity.controller";
import { ActivityService } from "./services/activity.service";
import { ActivityRepository } from "./repositories/activity.repository";
import { RequirementModule } from "../requirement/requirement.module";
import { UseCaseModule } from "../use-case/use-case.module";
import { ConditionController } from "./controllers/condition.controller";
import { ConditionService } from "./services/condition.service";
import { ConditionRepository } from "./repositories/condition.repository";

@Module({
  imports: [RequirementModule, UseCaseModule],
  controllers: [ActivityController, ConditionController],
  providers: [ActivityService, ActivityRepository, ConditionService, ConditionRepository],
  exports: [ActivityService, ConditionService],
})
export class ActivityModule {}
