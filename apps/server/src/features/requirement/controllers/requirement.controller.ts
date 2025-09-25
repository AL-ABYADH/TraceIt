import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { RequirementService } from "../services/requirement.service";

import { zodBody, zodParam } from "src/common/pipes/zod";
import {
  type ChildIdDto,
  childIdSchema,
  type CreateRequirementDto,
  createRequirementSchema,
  type ExceptionIdDto,
  exceptionIdSchema,
  type RequirementIdDto,
  requirementIdSchema,
  RequirementListDto,
  type UpdateRequirementDto,
  updateRequirementSchema,
  type UseCaseIdDto,
  useCaseIdSchema,
} from "@repo/shared-schemas";
import { Requirement } from "../entities/requirement.entity";

@Controller("requirements")
export class RequirementController {
  constructor(private readonly requirementService: RequirementService) {}

  @Post()
  async create(
    @Body(zodBody(createRequirementSchema)) dto: CreateRequirementDto,
  ): Promise<RequirementListDto> {
    return this.requirementService.createRequirement(dto);
  }

  @Get("use-case/:useCaseId")
  async getByUseCase(
    @Param(zodParam(useCaseIdSchema)) useCaseId: UseCaseIdDto,
  ): Promise<RequirementListDto[]> {
    return this.requirementService.findByUseCase(useCaseId.useCaseId);
  }

  @Get(":requirementId")
  async getById(
    @Param(zodParam(requirementIdSchema)) params: RequirementIdDto,
  ): Promise<Requirement> {
    return this.requirementService.findById(params.requirementId);
  }

  @Put(":requirementId")
  async update(
    @Param(zodParam(requirementIdSchema)) params: RequirementIdDto,
    @Body(zodBody(updateRequirementSchema)) dto: UpdateRequirementDto,
  ): Promise<RequirementListDto> {
    return this.requirementService.updateRequirement(params.requirementId, dto);
  }

  @Delete(":requirementId")
  async remove(
    @Param(zodParam(requirementIdSchema)) params: RequirementIdDto,
  ): Promise<{ success: boolean }> {
    const success = await this.requirementService.removeRequirement(params.requirementId);
    return { success };
  }

  @Post(":requirementId/nested/:childId")
  async addNestedRequirement(
    @Param(zodParam(requirementIdSchema)) param1: RequirementIdDto,
    @Param(zodParam(childIdSchema)) param2: ChildIdDto,
  ): Promise<RequirementListDto> {
    return this.requirementService.addNestedRequirement(param1.requirementId, param2.childId);
  }

  @Delete(":requirementId/nested/:childId")
  async removeNestedRequirement(
    @Param(zodParam(requirementIdSchema)) param1: RequirementIdDto,
    @Param(zodParam(childIdSchema)) param2: ChildIdDto,
  ): Promise<{ success: boolean }> {
    const success = await this.requirementService.removeNestedRequirement(
      param1.requirementId,
      param2.childId,
    );
    return { success };
  }

  @Post(":requirementId/exceptions/:exceptionId")
  async addException(
    @Param(zodParam(requirementIdSchema)) param1: RequirementIdDto,
    @Param(zodParam(exceptionIdSchema)) param2: ExceptionIdDto,
  ): Promise<RequirementListDto> {
    return this.requirementService.addException(param1.requirementId, param2.exceptionId);
  }

  @Delete(":requirementId/exceptions/:exceptionId")
  async removeException(
    @Param(zodParam(requirementIdSchema)) param1: RequirementIdDto,
    @Param(zodParam(exceptionIdSchema)) param2: ExceptionIdDto,
  ): Promise<{ success: boolean }> {
    const success = await this.requirementService.removeException(
      param1.requirementId,
      param2.exceptionId,
    );
    return { success };
  }
}
