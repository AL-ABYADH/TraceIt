import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { DiagramService } from "../services/diagram.service";
import { Diagram } from "../entities/diagram.entity";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
import {
  type CreateDiagramDto,
  createDiagramSchema,
  type ProjectIdDto,
  projectIdSchema,
  type TypeDiagramDto,
  typeDiagramSchema,
  type UpdateDiagramDto,
  updateDiagramSchema,
  type UuidParamsDto,
  uuidParamsSchema,
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
  ): Promise<Diagram[]> {
    return this.diagramService.listByProject(projectId.projectId, type?.type);
  }

  @Get(":id")
  async findById(@Param(zodParam(uuidParamsSchema)) params: UuidParamsDto): Promise<Diagram> {
    return this.diagramService.findById(params.id);
  }

  @Put(":id")
  async update(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateDiagramSchema)) updateDto: UpdateDiagramDto,
  ): Promise<Diagram> {
    return this.diagramService.update(params.id, updateDto);
  }

  @Delete(":id")
  async delete(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    const success = await this.diagramService.delete(params.id);
    return { success };
  }
}
