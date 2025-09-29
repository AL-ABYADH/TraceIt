import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { DiagramService } from "../services/diagram.service";
import { Diagram } from "../entities/diagram.entity";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
import {
  type CreateDiagramDto,
  createDiagramSchema,
  DiagramDto,
  type DiagramIdDto,
  diagramIdSchema,
  type ProjectIdDto,
  projectIdSchema,
  type TypeDiagramDto,
  typeDiagramSchema,
  type UpdateDiagramDto,
  updateDiagramSchema,
} from "@repo/shared-schemas";

@Controller("diagrams")
export class DiagramController {
  constructor(private readonly diagramService: DiagramService) {}

  @Post()
  async create(@Body(zodBody(createDiagramSchema)) createDto: CreateDiagramDto): Promise<Diagram> {
    return this.diagramService.create(createDto);
  }

  @Get()
  async listByProject(
    @Query(zodQuery(projectIdSchema)) projectId: ProjectIdDto,
    @Query(zodQuery(typeDiagramSchema)) type: TypeDiagramDto,
  ): Promise<DiagramDto[]> {
    return this.diagramService.listByProject(projectId.projectId, type?.type);
  }

  @Get(":diagramId")
  async findById(@Param(zodParam(diagramIdSchema)) params: DiagramIdDto): Promise<Diagram> {
    return this.diagramService.findById(params.diagramId);
  }

  @Put(":diagramId")
  async update(
    @Param(zodParam(diagramIdSchema)) params: DiagramIdDto,
    @Body(zodBody(updateDiagramSchema)) updateDto: UpdateDiagramDto,
  ): Promise<DiagramDto> {
    return this.diagramService.update(params.diagramId, updateDto);
  }

  @Delete(":diagramId")
  async delete(
    @Param(zodParam(diagramIdSchema)) params: DiagramIdDto,
  ): Promise<{ success: boolean }> {
    const success = await this.diagramService.delete(params.diagramId);
    return { success };
  }
}
