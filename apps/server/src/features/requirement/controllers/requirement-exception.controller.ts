import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { RequirementExceptionService } from "../services/requirement-exception.service";
import { zodBody, zodParam } from "src/common/pipes/zod";
import {
  type CreateRequirementExceptionDto,
  createRequirementExceptionSchema,
  requirementExceptionIdSchema,
  RequirementExceptionListDto,
  type RequirementExceptionIdDto,
  type UpdateRequirementExceptionDto,
  updateRequirementExceptionSchema,
  requirementIdSchema,
  type RequirementIdDto,
  useCaseIdSchema,
  type UseCaseIdDto,
} from "@repo/shared-schemas";
@Controller("requirement-exceptions")
export class RequirementExceptionController {
  constructor(private readonly exceptionService: RequirementExceptionService) {}

  @Post()
  async create(
    @Body(zodBody(createRequirementExceptionSchema)) dto: CreateRequirementExceptionDto,
  ): Promise<RequirementExceptionListDto> {
    return this.exceptionService.create(dto);
  }

  @Get(":requirementExceptionId")
  async getById(
    @Param(zodParam(requirementExceptionIdSchema)) params: RequirementExceptionIdDto,
  ): Promise<RequirementExceptionListDto> {
    return this.exceptionService.findById(params.requirementExceptionId);
  }

  @Get("use-case/:useCaseId")
  async getByUseCase(
    @Param(zodParam(useCaseIdSchema)) params: UseCaseIdDto,
  ): Promise<RequirementExceptionListDto[]> {
    return this.exceptionService.getByUseCase(params.useCaseId);
  }

  @Put(":requirementExceptionId")
  async update(
    @Param(zodParam(requirementExceptionIdSchema)) params: RequirementExceptionIdDto,
    @Body(zodBody(updateRequirementExceptionSchema)) dto: UpdateRequirementExceptionDto,
  ): Promise<RequirementExceptionListDto> {
    return this.exceptionService.update(params.requirementExceptionId, dto);
  }

  @Delete(":requirementExceptionId")
  async remove(
    @Param(zodParam(requirementExceptionIdSchema)) params: RequirementExceptionIdDto,
  ): Promise<{ success: boolean }> {
    const success = await this.exceptionService.remove(params.requirementExceptionId);
    return { success };
  }

  @Post(":requirementExceptionId/requirements/:requirementId")
  async addRequirement(
    @Param(zodParam(requirementExceptionIdSchema)) param1: RequirementExceptionIdDto,
    @Param(zodParam(requirementIdSchema)) param2: RequirementIdDto,
  ): Promise<RequirementExceptionListDto> {
    return this.exceptionService.addRequirement(
      param1.requirementExceptionId,
      param2.requirementId,
    );
  }
}
