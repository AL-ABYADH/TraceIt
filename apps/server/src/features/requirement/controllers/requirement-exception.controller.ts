import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { RequirementExceptionService } from "../services/requirement-exception.service";
import { zodBody, zodParam } from "src/common/pipes/zod";
import {
  type CreateRequirementExceptionDto,
  createRequirementExceptionSchema,
  type UpdateRequirementExceptionDto,
  updateRequirementExceptionSchema,
  type UuidParamsDto,
  uuidParamsSchema,
} from "@repo/shared-schemas";
import { RequirementException } from "../entities/requirement-exception.entity";

@Controller("requirement-exceptions")
export class RequirementExceptionController {
  constructor(private readonly exceptionService: RequirementExceptionService) {}

  @Post()
  async create(
    @Body(zodBody(createRequirementExceptionSchema)) dto: CreateRequirementExceptionDto,
  ): Promise<RequirementException> {
    return this.exceptionService.create(dto);
  }

  @Get(":id")
  async getById(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
  ): Promise<RequirementException> {
    return this.exceptionService.findById(params.id);
  }

  @Put(":id")
  async update(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateRequirementExceptionSchema)) dto: UpdateRequirementExceptionDto,
  ): Promise<RequirementException> {
    return this.exceptionService.update(params.id, dto);
  }

  @Delete(":id")
  async remove(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    const success = await this.exceptionService.remove(params.id);
    return { success };
  }

  @Post(":id/requirements/:requirementId")
  async addRequirement(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Param("requirementId") requirementId: string,
  ): Promise<RequirementException> {
    return this.exceptionService.addRequirement(params.id, requirementId);
  }

  @Delete(":id/requirements/:requirementId")
  async removeRequirement(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Param("requirementId") requirementId: string,
  ): Promise<{ success: boolean }> {
    const success = await this.exceptionService.removeRequirement(params.id, requirementId);
    return { success };
  }
}
