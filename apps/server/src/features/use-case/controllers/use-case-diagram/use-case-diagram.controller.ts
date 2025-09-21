import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
import {
  createDiagramSchema,
  type CreateDiagramDto,
  projectIdSchema,
  type ProjectIdDto,
  updateDiagramSchema,
  type UpdateDiagramDto,
  uuidParamsSchema,
  type UuidParamsDto,
  UseCaseDiagramDetailDto,
  type UseCaseIdDto,
  useCaseIdSchema,
  usecaseDiagramIdSchema,
  type UsecaseDiagramIdDto,
} from "@repo/shared-schemas";
import { UseCaseDiagramService } from "../../services/use-case-diagram/use-case-diagram.service";

@Controller("use-case-diagrams")
export class UseCaseDiagramController {
  constructor(private readonly useCaseDiagramService: UseCaseDiagramService) {}

  @Post()
  async create(
    @Body(zodBody(createDiagramSchema)) createDto: CreateDiagramDto,
  ): Promise<UseCaseDiagramDetailDto> {
    return await this.useCaseDiagramService.create(createDto);
  }

  @Get()
  async listByProject(
    @Query(zodQuery(projectIdSchema)) params: ProjectIdDto,
  ): Promise<UseCaseDiagramDetailDto[]> {
    return await this.useCaseDiagramService.listByProject(params.projectId);
  }

  @Get(":usecaseDiagramId")
  async getById(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
  ): Promise<UseCaseDiagramDetailDto> {
    return await this.useCaseDiagramService.findById(params.id);
  }

  @Put(":usecaseDiagramId")
  async update(
    @Param(zodParam(usecaseDiagramIdSchema)) params: UsecaseDiagramIdDto,
    @Body(zodBody(updateDiagramSchema)) updateDto: UpdateDiagramDto,
  ): Promise<UseCaseDiagramDetailDto> {
    return await this.useCaseDiagramService.update(params.usecaseDiagramId, updateDto);
  }

  @Delete(":usecaseDiagramId")
  async delete(
    @Param(zodParam(usecaseDiagramIdSchema)) params: UsecaseDiagramIdDto,
  ): Promise<{ success: boolean }> {
    return { success: await this.useCaseDiagramService.delete(params.usecaseDiagramId) };
  }

  @Post(":usecaseDiagramId/use-cases/:useCaseId")
  async addUseCase(
    @Param(zodParam(usecaseDiagramIdSchema)) param1: UsecaseDiagramIdDto,
    @Param(zodParam(useCaseIdSchema)) param2: UseCaseIdDto,
  ): Promise<{ success: boolean }> {
    return {
      success: await this.useCaseDiagramService.addUseCase(
        param1.usecaseDiagramId,
        param2.useCaseId,
      ),
    };
  }

  @Delete(":usecaseDiagramId/use-cases/:useCaseId")
  async removeUseCase(
    @Param(zodParam(usecaseDiagramIdSchema)) param1: UsecaseDiagramIdDto,
    @Param(zodParam(useCaseIdSchema)) param2: UseCaseIdDto,
  ): Promise<{ success: boolean }> {
    return {
      success: await this.useCaseDiagramService.removeUseCase(
        param1.usecaseDiagramId,
        param2.useCaseId,
      ),
    };
  }
}
