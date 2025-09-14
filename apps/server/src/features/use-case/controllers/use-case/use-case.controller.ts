import { Controller, Get, Query } from "@nestjs/common";
import { zodQuery } from "src/common/pipes/zod";
import { type ProjectIdDto, projectIdSchema, UseCaseDetailDto } from "@repo/shared-schemas";
import { UseCaseService } from "../../services/use-case/use-case.service";

@Controller("use-cases")
export class UseCaseController {
  constructor(private readonly useCaseService: UseCaseService) {}

  @Get()
  async listByProject(
    @Query(zodQuery(projectIdSchema)) params: ProjectIdDto,
  ): Promise<UseCaseDetailDto[]> {
    return await this.useCaseService.listByProject(params.projectId);
  }
}
