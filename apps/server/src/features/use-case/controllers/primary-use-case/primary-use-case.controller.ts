import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
import {
  type CreateUseCaseDto,
  createUseCaseSchema,
  type ProjectIdDto,
  projectIdSchema,
  updatePrimaryUseCaseSchema,
  type UpdatePrimaryUseCaseDto,
  actorsSchema,
  type ActorsDto,
  PrimaryUseCaseDetailDto,
  PrimaryUseCaseListDto,
  type PrimaryUseCaseIdDto,
  primaryUsecaseIdSchema,
} from "@repo/shared-schemas";
import { PrimaryUseCaseService } from "../../services/primary-use-case/primary-use-case.service";
import { PrimaryUseCase } from "../../entities/primary-use-case.entity";

@Controller("primary-use-cases")
export class PrimaryUseCaseController {
  constructor(private readonly primaryUseCaseService: PrimaryUseCaseService) {}

  @Post()
  async add(
    @Body(zodBody(createUseCaseSchema)) dto: CreateUseCaseDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.create(dto);
  }

  @Get()
  async listByProject(
    @Query(zodQuery(projectIdSchema)) params: ProjectIdDto,
  ): Promise<PrimaryUseCaseListDto[]> {
    return await this.primaryUseCaseService.listByProject(params.projectId);
  }

  @Get(":primaryUsecaseId")
  async getById(
    @Param(zodParam(primaryUsecaseIdSchema)) params: PrimaryUseCaseIdDto,
  ): Promise<PrimaryUseCase> {
    return await this.primaryUseCaseService.findById(params.primaryUsecaseId);
  }

  @Put(":primaryUsecaseId")
  async update(
    @Param(zodParam(primaryUsecaseIdSchema)) params: PrimaryUseCaseIdDto,
    @Body(zodBody(updatePrimaryUseCaseSchema)) dto: UpdatePrimaryUseCaseDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.update(params.primaryUsecaseId, dto);
  }

  @Delete(":primaryUsecaseId")
  async remove(
    @Param(zodParam(primaryUsecaseIdSchema)) params: PrimaryUseCaseIdDto,
  ): Promise<{ success: boolean }> {
    return { success: await this.primaryUseCaseService.remove(params.primaryUsecaseId) };
  }

  @Post(":primaryUsecaseId/primary-actors")
  async addPrimaryActors(
    @Param(zodParam(primaryUsecaseIdSchema)) params: PrimaryUseCaseIdDto,
    @Body(zodBody(actorsSchema)) dto: ActorsDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.addPrimaryActors(params.primaryUsecaseId, dto.actorIds);
  }

  @Delete(":primaryUsecaseId/primary-actors")
  async removePrimaryActors(
    @Param(zodParam(primaryUsecaseIdSchema)) params: PrimaryUseCaseIdDto,
    @Body(zodBody(actorsSchema)) dto: ActorsDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.removePrimaryActors(
      params.primaryUsecaseId,
      dto.actorIds,
    );
  }

  @Post(":primaryUsecaseId/secondary-actors")
  async addSecondaryActors(
    @Param(zodParam(primaryUsecaseIdSchema)) params: PrimaryUseCaseIdDto,
    @Body(zodBody(actorsSchema)) dto: ActorsDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.addSecondaryActors(
      params.primaryUsecaseId,
      dto.actorIds,
    );
  }

  @Delete(":primaryUsecaseId/secondary-actors")
  async removeSecondaryActors(
    @Param(zodParam(primaryUsecaseIdSchema)) params: PrimaryUseCaseIdDto,
    @Body(zodBody(actorsSchema)) dto: ActorsDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.removeSecondaryActors(
      params.primaryUsecaseId,
      dto.actorIds,
    );
  }
}
