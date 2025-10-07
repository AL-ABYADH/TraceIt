import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
import { ConditionService } from "../services/condition.service";
import { Condition } from "../entities/condition.entity";
import {
  ConditionDto,
  type ConditionIdDto,
  conditionIdSchema,
  type CreateConditionDto,
  createConditionSchema,
  type UpdateConditionDto,
  updateConditionSchema,
  type RequirementOptionalIdDto,
  requirementOptionalIdSchema,
  type UseCaseOptionalIdDto,
  useCaseOptionalIdSchema,
  RequirementListDto,
} from "@repo/shared-schemas";

@Controller("conditions")
export class ConditionController {
  constructor(private readonly conditionService: ConditionService) {}

  @Post()
  async add(@Body(zodBody(createConditionSchema)) dto: CreateConditionDto): Promise<ConditionDto> {
    return await this.conditionService.create(dto);
  }

  @Get(":conditionId/requirement")
  async getRelatedRequirement(
    @Param(zodParam(conditionIdSchema)) params: ConditionIdDto,
  ): Promise<RequirementListDto | null> {
    return await this.conditionService.getRelatedRequirement(params.conditionId);
  }

  @Get()
  async list(
    @Query(zodQuery(requirementOptionalIdSchema)) params?: RequirementOptionalIdDto,
    @Query(zodQuery(useCaseOptionalIdSchema)) useCaseParams?: UseCaseOptionalIdDto,
  ): Promise<ConditionDto[]> {
    // Filter by use case if provided
    if (useCaseParams?.useCaseId) {
      return await this.conditionService.listByUseCase(useCaseParams.useCaseId);
    }

    // Filter by requirement if provided
    if (params?.requirementId) {
      return await this.conditionService.listByRequirement(params.requirementId);
    }

    // Return all conditions if no filters
    return await this.conditionService.listAll();
  }

  @Get(":conditionId")
  async getById(@Param(zodParam(conditionIdSchema)) params: ConditionIdDto): Promise<Condition> {
    return await this.conditionService.findById(params.conditionId);
  }

  @Put(":conditionId")
  async update(
    @Param(zodParam(conditionIdSchema)) params: ConditionIdDto,
    @Body(zodBody(updateConditionSchema)) dto: UpdateConditionDto,
  ): Promise<ConditionDto> {
    return await this.conditionService.update(params.conditionId, dto);
  }

  @Delete(":conditionId")
  async remove(
    @Param(zodParam(conditionIdSchema)) params: ConditionIdDto,
  ): Promise<{ success: boolean }> {
    return { success: await this.conditionService.remove(params.conditionId) };
  }
}
