import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { DiagramService } from "../services/diagram.service";
import { Diagram } from "../entities/diagram.entity";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
import {
  type CreateDiagramDto,
  createDiagramSchema,
  DiagramDetailDto,
  DiagramListDto,
  type DiagramIdDto,
  diagramIdSchema,
  type ProjectIdDto,
  projectIdSchema,
  type TypeDiagramDto,
  typeDiagramSchema,
  type UpdateDiagramDto,
  updateDiagramSchema,
  diagramDetailSchema,
} from "@repo/shared-schemas";
import { ZodResponseInterceptor } from "src/common/interceptors/zodResponseInterceptor";
import { ResponseSchema } from "src/common/decorators/response-schema.decorator";

@UseInterceptors(ZodResponseInterceptor)
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
  ): Promise<DiagramListDto[]> {
    return this.diagramService.listByProject(projectId.projectId, type?.type);
  }

  @Get(":diagramId")
  @ResponseSchema(diagramDetailSchema)
  async findById(
    @Param(zodParam(diagramIdSchema)) params: DiagramIdDto,
  ): Promise<DiagramDetailDto> {
    return (await this.diagramService.findById(params.diagramId)) as any;
  }

  @Put(":diagramId")
  async update(
    @Param(zodParam(diagramIdSchema)) params: DiagramIdDto,
    @Body(zodBody(updateDiagramSchema)) updateDto: UpdateDiagramDto,
  ): Promise<DiagramListDto> {
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
