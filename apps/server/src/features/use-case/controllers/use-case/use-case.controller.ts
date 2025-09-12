import { Controller, Get, Query } from "@nestjs/common";
import { zodQuery } from "src/common/pipes/zod";
import { type ProjectIdDto, projectIdSchema } from "@repo/shared-schemas";
import { UseCaseService } from "../../services/use-case/use-case.service";
import { UseCase } from "../../entities/use-case.entity";

@Controller("use-cases")
export class UseCaseController {
  constructor(private readonly useCaseService: UseCaseService) {}

  @Get()
  async listByProject(@Query(zodQuery(projectIdSchema)) params: ProjectIdDto): Promise<UseCase[]> {
    return await this.useCaseService.listByProject(params.projectId);
  }
}
