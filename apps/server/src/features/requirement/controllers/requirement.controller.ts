import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { RequirementService } from "../services/requirement.service";

import { zodBody, zodParam } from "src/common/pipes/zod";
import {
  type CreateRequirementDto,
  createRequirementSchema,
  type UpdateRequirementDto,
  updateRequirementSchema,
  type UseCaseIdDto,
  useCaseIdSchema,
  type UuidParamsDto,
  uuidParamsSchema,
} from "@repo/shared-schemas";
import { Requirement } from "../entities/requirement.entity";

@Controller("requirements")
export class RequirementController {
  constructor(private readonly requirementService: RequirementService) {}

  @Post()
  async create(
    @Body(zodBody(createRequirementSchema)) dto: CreateRequirementDto,
  ): Promise<Requirement> {
    return this.requirementService.createRequirement(dto);
  }

  @Get("use-case/:useCaseId")
  async getByUseCase(
    @Param(zodParam(useCaseIdSchema)) useCaseId: UseCaseIdDto,
  ): Promise<Requirement[]> {
    return this.requirementService.findByUseCase(useCaseId.useCaseId);
  }

  @Get(":id")
  async getById(@Param(zodParam(uuidParamsSchema)) params: UuidParamsDto): Promise<Requirement> {
    return this.requirementService.findById(params.id);
  }

  @Put(":id")
  async update(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateRequirementSchema)) dto: UpdateRequirementDto,
  ): Promise<Requirement> {
    return this.requirementService.updateRequirement(params.id, dto);
  }

  @Delete(":id")
  async remove(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    const success = await this.requirementService.removeRequirement(params.id);
    return { success };
  }

  @Post(":id/nested/:childId")
  async addNestedRequirement(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Param("childId") childId: string,
  ): Promise<Requirement> {
    return this.requirementService.addNestedRequirement(params.id, childId);
  }

  @Delete(":id/nested/:childId")
  async removeNestedRequirement(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Param("childId") childId: string,
  ): Promise<{ success: boolean }> {
    const success = await this.requirementService.removeNestedRequirement(params.id, childId);
    return { success };
  }

  @Post(":id/exceptions/:exceptionId")
  async addException(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Param("exceptionId") exceptionId: string,
  ): Promise<Requirement> {
    return this.requirementService.addException(params.id, exceptionId);
  }

  @Delete(":id/exceptions/:exceptionId")
  async removeException(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Param("exceptionId") exceptionId: string,
  ): Promise<{ success: boolean }> {
    const success = await this.requirementService.removeException(params.id, exceptionId);
    return { success };
  }
}
