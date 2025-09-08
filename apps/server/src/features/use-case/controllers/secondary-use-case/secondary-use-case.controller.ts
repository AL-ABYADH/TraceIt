import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
import {
  createSecondaryUseCaseSchema,
  type CreateSecondaryUseCaseDto,
  projectIdSchema,
  type ProjectIdDto,
  updateSecondaryUseCaseSchema,
  type UpdateSecondaryUseCaseDto,
  uuidParamsSchema,
  type UuidParamsDto,
} from "@repo/shared-schemas";
import { SecondaryUseCaseService } from "../../services/secondary-use-case/secondary-use-case.service";
import { SecondaryUseCase } from "../../entities/secondary-use-case.entity";

@Controller("secondary-use-cases")
export class SecondaryUseCaseController {
  constructor(private readonly secondaryUseCaseService: SecondaryUseCaseService) {}

  @Post()
  async add(
    @Body(zodBody(createSecondaryUseCaseSchema)) dto: CreateSecondaryUseCaseDto,
  ): Promise<SecondaryUseCase> {
    return await this.secondaryUseCaseService.create(dto);
  }

  @Get()
  async listByProject(
    @Query(zodQuery(projectIdSchema)) params: ProjectIdDto,
  ): Promise<SecondaryUseCase[]> {
    return await this.secondaryUseCaseService.listByProject(params.projectId);
  }

  @Get(":id")
  async getById(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
  ): Promise<SecondaryUseCase> {
    return await this.secondaryUseCaseService.findById(params.id);
  }

  @Put(":id")
  async update(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateSecondaryUseCaseSchema)) dto: UpdateSecondaryUseCaseDto,
  ): Promise<SecondaryUseCase> {
    return await this.secondaryUseCaseService.update(params.id, dto);
  }

  @Delete(":id")
  async remove(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    return { success: await this.secondaryUseCaseService.remove(params.id) };
  }

  @Put(":id/primary-use-case/:primaryUseCaseId")
  async changePrimaryUseCase(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Param("primaryUseCaseId") primaryUseCaseId: string,
  ): Promise<SecondaryUseCase> {
    return await this.secondaryUseCaseService.changePrimaryUseCase(params.id, primaryUseCaseId);
  }
}
