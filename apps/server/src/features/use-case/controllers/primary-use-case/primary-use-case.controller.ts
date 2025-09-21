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
  primaryUseCaseIdSchema,
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

  @Get(":primaryUseCaseId")
  async getById(
    @Param(zodParam(primaryUseCaseIdSchema)) params: PrimaryUseCaseIdDto,
  ): Promise<PrimaryUseCase> {
    return await this.primaryUseCaseService.findById(params.primaryUseCaseId);
  }

  @Put(":primaryUseCaseId")
  async update(
    @Param(zodParam(primaryUseCaseIdSchema)) params: PrimaryUseCaseIdDto,
    @Body(zodBody(updatePrimaryUseCaseSchema)) dto: UpdatePrimaryUseCaseDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.update(params.primaryUseCaseId, dto);
  }

  @Delete(":primaryUseCaseId")
  async remove(
    @Param(zodParam(primaryUseCaseIdSchema)) params: PrimaryUseCaseIdDto,
  ): Promise<{ success: boolean }> {
    return { success: await this.primaryUseCaseService.remove(params.primaryUseCaseId) };
  }

  @Post(":primaryUseCaseId/primary-actors")
  async addPrimaryActors(
    @Param(zodParam(primaryUseCaseIdSchema)) params: PrimaryUseCaseIdDto,
    @Body(zodBody(actorsSchema)) dto: ActorsDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.addPrimaryActors(params.primaryUseCaseId, dto.actorIds);
  }

  @Delete(":primaryUseCaseId/primary-actors")
  async removePrimaryActors(
    @Param(zodParam(primaryUseCaseIdSchema)) params: PrimaryUseCaseIdDto,
    @Body(zodBody(actorsSchema)) dto: ActorsDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.removePrimaryActors(
      params.primaryUseCaseId,
      dto.actorIds,
    );
  }

  @Post(":primaryUseCaseId/secondary-actors")
  async addSecondaryActors(
    @Param(zodParam(primaryUseCaseIdSchema)) params: PrimaryUseCaseIdDto,
    @Body(zodBody(actorsSchema)) dto: ActorsDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.addSecondaryActors(
      params.primaryUseCaseId,
      dto.actorIds,
    );
  }

  @Delete(":primaryUseCaseId/secondary-actors")
  async removeSecondaryActors(
    @Param(zodParam(primaryUseCaseIdSchema)) params: PrimaryUseCaseIdDto,
    @Body(zodBody(actorsSchema)) dto: ActorsDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.removeSecondaryActors(
      params.primaryUseCaseId,
      dto.actorIds,
    );
  }
}
