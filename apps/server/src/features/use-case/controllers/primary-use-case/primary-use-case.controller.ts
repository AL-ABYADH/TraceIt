import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
import {
  type CreateUseCaseDto,
  createUseCaseSchema,
  type ProjectIdDto,
  projectIdSchema,
  updatePrimaryUseCaseSchema,
  type UpdatePrimaryUseCaseDto,
  type UuidParamsDto,
  uuidParamsSchema,
  actorsSchema,
  type ActorsDto,
  PrimaryUseCaseDetailDto,
  PrimaryUseCaseListDto,
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

  @Get(":id")
  async getById(@Param(zodParam(uuidParamsSchema)) params: UuidParamsDto): Promise<PrimaryUseCase> {
    return await this.primaryUseCaseService.findById(params.id);
  }

  @Put(":id")
  async update(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updatePrimaryUseCaseSchema)) dto: UpdatePrimaryUseCaseDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.update(params.id, dto);
  }

  @Delete(":id")
  async remove(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    return { success: await this.primaryUseCaseService.remove(params.id) };
  }

  @Post(":id/primary-actors")
  async addPrimaryActors(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(actorsSchema)) dto: ActorsDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.addPrimaryActors(params.id, dto.actorIds);
  }

  @Delete(":id/primary-actors")
  async removePrimaryActors(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(actorsSchema)) dto: ActorsDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.removePrimaryActors(params.id, dto.actorIds);
  }

  @Post(":id/secondary-actors")
  async addSecondaryActors(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(actorsSchema)) dto: ActorsDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.addSecondaryActors(params.id, dto.actorIds);
  }

  @Delete(":id/secondary-actors")
  async removeSecondaryActors(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(actorsSchema)) dto: ActorsDto,
  ): Promise<PrimaryUseCaseDetailDto> {
    return await this.primaryUseCaseService.removeSecondaryActors(params.id, dto.actorIds);
  }
}
