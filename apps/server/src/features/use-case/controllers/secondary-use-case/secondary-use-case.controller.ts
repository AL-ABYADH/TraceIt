import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
import {
  createSecondaryUseCaseSchema,
  type CreateSecondaryUseCaseDto,
  projectIdSchema,
  type ProjectIdDto,
  updateSecondaryUseCaseSchema,
  type UpdateSecondaryUseCaseDto,
  SecondaryUseCaseDetailDto,
  SecondaryUseCaseListDto,
  type SecondaryUseCaseIdDto,
  secondaryUseCaseIdSchema,
  type PrimaryUseCaseIdDto,
  primaryUseCaseIdSchema,
} from "@repo/shared-schemas";
import { SecondaryUseCaseService } from "../../services/secondary-use-case/secondary-use-case.service";

@Controller("secondary-use-cases")
export class SecondaryUseCaseController {
  constructor(private readonly secondaryUseCaseService: SecondaryUseCaseService) {}

  @Post()
  async add(
    @Body(zodBody(createSecondaryUseCaseSchema)) dto: CreateSecondaryUseCaseDto,
  ): Promise<SecondaryUseCaseListDto> {
    return await this.secondaryUseCaseService.create(dto);
  }

  @Get()
  async listByProject(
    @Query(zodQuery(projectIdSchema)) params: ProjectIdDto,
  ): Promise<SecondaryUseCaseListDto[]> {
    return await this.secondaryUseCaseService.listByProject(params.projectId);
  }

  @Get(":secondaryUseCaseId")
  async getById(
    @Param(zodParam(secondaryUseCaseIdSchema)) params: SecondaryUseCaseIdDto,
  ): Promise<SecondaryUseCaseDetailDto> {
    return await this.secondaryUseCaseService.findById(params.secondaryUseCaseId);
  }

  @Put(":secondaryUseCaseId")
  async update(
    @Param(zodParam(secondaryUseCaseIdSchema)) params: SecondaryUseCaseIdDto,
    @Body(zodBody(updateSecondaryUseCaseSchema)) dto: UpdateSecondaryUseCaseDto,
  ): Promise<SecondaryUseCaseDetailDto> {
    return await this.secondaryUseCaseService.update(params.secondaryUseCaseId, dto);
  }

  @Delete(":secondaryUseCaseId")
  async remove(
    @Param(zodParam(secondaryUseCaseIdSchema)) params: SecondaryUseCaseIdDto,
  ): Promise<{ success: boolean }> {
    return { success: await this.secondaryUseCaseService.remove(params.secondaryUseCaseId) };
  }

  @Put(":secondaryUseCaseId/primary-use-case/:primaryUseCaseId")
  async changePrimaryUseCase(
    @Param(zodParam(secondaryUseCaseIdSchema)) param1: SecondaryUseCaseIdDto,
    @Param(zodParam(primaryUseCaseIdSchema)) param2: PrimaryUseCaseIdDto,
  ): Promise<SecondaryUseCaseDetailDto> {
    return await this.secondaryUseCaseService.changePrimaryUseCase(
      param1.secondaryUseCaseId,
      param2.primaryUseCaseId,
    );
  }
}
