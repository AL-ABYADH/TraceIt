import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { RequirementService } from "../../services/requirement/requirement.service";
import { RequirementType } from "../../enums/requirement-type.enum";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";

import {
  type CreateSystemRequirementDto,
  type CreateEventSystemRequirementDto,
  type CreateActorRequirementDto,
  type CreateSystemActorCommunicationRequirementDto,
  type CreateConditionalRequirementDto,
  type CreateRecursiveRequirementDto,
  type CreateUseCaseReferenceRequirementDto,
  type CreateLogicalGroupRequirementDto,
  type CreateConditionalGroupRequirementDto,
  type CreateSimultaneousRequirementDto,
  type CreateExceptionalRequirementDto,
  type UpdateSystemRequirementDto,
  type UpdateEventSystemRequirementDto,
  type UpdateActorRequirementDto,
  type UpdateSystemActorCommunicationRequirementDto,
  type UpdateConditionalRequirementDto,
  type UpdateRecursiveRequirementDto,
  type UpdateUseCaseReferenceRequirementDto,
  type UpdateLogicalGroupRequirementDto,
  type UpdateConditionalGroupRequirementDto,
  type UpdateSimultaneousRequirementDto,
  type UpdateExceptionalRequirementDto,
  type UuidParamsDto,
  type UseCaseIdDto,
  type ProjectIdDto,
  uuidParamsSchema,
  useCaseIdSchema,
  createSystemRequirementSchema,
  createEventSystemRequirementSchema,
  createActorRequirementSchema,
  createSystemActorCommunicationRequirementSchema,
  createConditionalRequirementSchema,
  createRecursiveRequirementSchema,
  createUseCaseReferenceRequirementSchema,
  createLogicalGroupRequirementSchema,
  createConditionalGroupRequirementSchema,
  createSimultaneousRequirementSchema,
  createExceptionalRequirementSchema,
  updateSystemRequirementSchema,
  updateEventSystemRequirementSchema,
  updateActorRequirementSchema,
  updateSystemActorCommunicationRequirementSchema,
  updateConditionalRequirementSchema,
  updateRecursiveRequirementSchema,
  updateUseCaseReferenceRequirementSchema,
  updateLogicalGroupRequirementSchema,
  updateConditionalGroupRequirementSchema,
  updateSimultaneousRequirementSchema,
  updateExceptionalRequirementSchema,
  type RequirementTypeDto,
  requirementTypeSchema,
  projectIdSchema,
  RequirementDetailDto,
  RequirementListDto,
  SystemRequirementDetailDto,
  SystemRequirementListDto,
  EventSystemRequirementDetailDto,
  EventSystemRequirementListDto,
  ActorRequirementDetailDto,
  ActorRequirementListDto,
  SystemActorCommunicationRequirementListDto,
  SystemActorCommunicationRequirementDetailDto,
  ConditionalRequirementListDto,
  ConditionalRequirementDetailDto,
  RecursiveRequirementListDto,
  RecursiveRequirementDetailDto,
  UseCaseReferenceRequirementDetailDto,
  UseCaseReferenceRequirementListDto,
  LogicalGroupRequirementDetailDto,
  LogicalGroupRequirementListDto,
  ConditionalGroupRequirementDetailDto,
  ConditionalGroupRequirementListDto,
  SimultaneousRequirementListDto,
  SimultaneousRequirementDetailDto,
  ExceptionalRequirementListDto,
  ExceptionalRequirementDetailDto,
} from "@repo/shared-schemas";

@Controller("requirements")
export class RequirementController {
  constructor(private readonly requirementService: RequirementService) {}

  // Generic endpoints for all requirement types

  /**
   * Get a requirement by ID
   */
  @Get(":id")
  async findById(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
  ): Promise<RequirementDetailDto> {
    return this.requirementService.findById(params.id);
  }

  /**
   * Get all requirements for a use case
   */
  @Get()
  async getByUseCase(
    @Query(zodQuery(useCaseIdSchema)) query: UseCaseIdDto,
  ): Promise<RequirementListDto[]> {
    return this.requirementService.getByUseCase(query.useCaseId);
  }

  /**
   * Get all requirements for a project
   */
  @Get("project/:projectId")
  async getByProject(
    @Param(zodParam(projectIdSchema)) params: ProjectIdDto,
  ): Promise<RequirementListDto[]> {
    return this.requirementService.getByProject(params.projectId);
  }

  /**
   * Get requirements by type for a use case
   */
  @Get("type/:type/useCase/:useCaseId")
  async getRequirementsByTypeAndUseCase(
    @Param(zodParam(requirementTypeSchema)) type: RequirementTypeDto,
    @Param(zodParam(useCaseIdSchema)) useCaseId: string,
  ) {
    const typeValue = Object.values(type)[0];
    return this.requirementService.getRequirementsByTypeAndUseCase(
      typeValue as RequirementType,
      useCaseId,
    );
  }

  /**
   * Delete a requirement
   */
  @Delete(":id")
  async remove(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    const success = await this.requirementService.remove(params.id);
    return { success };
  }

  // SystemRequirement endpoints

  @Post("system")
  async createSystemRequirement(
    @Body(zodBody(createSystemRequirementSchema)) dto: CreateSystemRequirementDto,
  ): Promise<SystemRequirementDetailDto> {
    return this.requirementService.createSystemRequirement(dto);
  }

  @Put("system/:id")
  async updateSystemRequirement(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateSystemRequirementSchema)) dto: UpdateSystemRequirementDto,
  ): Promise<SystemRequirementListDto> {
    return this.requirementService.updateSystemRequirement(params.id, dto);
  }

  // EventSystemRequirement endpoints

  @Post("event-system")
  async createEventSystemRequirement(
    @Body(zodBody(createEventSystemRequirementSchema)) dto: CreateEventSystemRequirementDto,
  ): Promise<EventSystemRequirementDetailDto> {
    return this.requirementService.createEventSystemRequirement(dto);
  }

  @Put("event-system/:id")
  async updateEventSystemRequirement(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateEventSystemRequirementSchema)) dto: UpdateEventSystemRequirementDto,
  ): Promise<EventSystemRequirementListDto> {
    return this.requirementService.updateEventSystemRequirement(params.id, dto);
  }

  // ActorRequirement endpoints

  @Post("actor")
  async createActorRequirement(
    @Body(zodBody(createActorRequirementSchema)) dto: CreateActorRequirementDto,
  ): Promise<ActorRequirementDetailDto> {
    return this.requirementService.createActorRequirement(dto);
  }

  @Put("actor/:id")
  async updateActorRequirement(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateActorRequirementSchema)) dto: UpdateActorRequirementDto,
  ): Promise<ActorRequirementListDto> {
    return this.requirementService.updateActorRequirement(params.id, dto);
  }

  // SystemActorCommunicationRequirement endpoints

  @Post("system-actor-communication")
  async createSystemActorCommunicationRequirement(
    @Body(zodBody(createSystemActorCommunicationRequirementSchema))
    dto: CreateSystemActorCommunicationRequirementDto,
  ): Promise<SystemActorCommunicationRequirementDetailDto> {
    return this.requirementService.createSystemActorCommunicationRequirement(dto);
  }

  @Put("system-actor-communication/:id")
  async updateSystemActorCommunicationRequirement(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateSystemActorCommunicationRequirementSchema))
    dto: UpdateSystemActorCommunicationRequirementDto,
  ): Promise<SystemActorCommunicationRequirementListDto> {
    return this.requirementService.updateSystemActorCommunicationRequirement(params.id, dto);
  }

  // ConditionalRequirement endpoints

  @Post("conditional")
  async createConditionalRequirement(
    @Body(zodBody(createConditionalRequirementSchema)) dto: CreateConditionalRequirementDto,
  ): Promise<ConditionalRequirementDetailDto> {
    return this.requirementService.createConditionalRequirement(dto);
  }

  @Put("conditional/:id")
  async updateConditionalRequirement(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateConditionalRequirementSchema)) dto: UpdateConditionalRequirementDto,
  ): Promise<ConditionalRequirementListDto> {
    return this.requirementService.updateConditionalRequirement(params.id, dto);
  }

  // RecursiveRequirement endpoints

  @Post("recursive")
  async createRecursiveRequirement(
    @Body(zodBody(createRecursiveRequirementSchema)) dto: CreateRecursiveRequirementDto,
  ): Promise<RecursiveRequirementDetailDto> {
    return this.requirementService.createRecursiveRequirement(dto);
  }

  @Put("recursive/:id")
  async updateRecursiveRequirement(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateRecursiveRequirementSchema)) dto: UpdateRecursiveRequirementDto,
  ): Promise<RecursiveRequirementListDto> {
    return this.requirementService.updateRecursiveRequirement(params.id, dto);
  }

  // UseCaseReferenceRequirement endpoints

  @Post("use-case-reference")
  async createUseCaseReferenceRequirement(
    @Body(zodBody(createUseCaseReferenceRequirementSchema))
    dto: CreateUseCaseReferenceRequirementDto,
  ): Promise<UseCaseReferenceRequirementDetailDto> {
    return this.requirementService.createUseCaseReferenceRequirement(dto);
  }

  @Put("use-case-reference/:id")
  async updateUseCaseReferenceRequirement(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateUseCaseReferenceRequirementSchema))
    dto: UpdateUseCaseReferenceRequirementDto,
  ): Promise<UseCaseReferenceRequirementListDto> {
    return this.requirementService.updateUseCaseReferenceRequirement(params.id, dto);
  }

  // LogicalGroupRequirement endpoints

  @Post("logical-group")
  async createLogicalGroupRequirement(
    @Body(zodBody(createLogicalGroupRequirementSchema)) dto: CreateLogicalGroupRequirementDto,
  ): Promise<LogicalGroupRequirementDetailDto> {
    return this.requirementService.createLogicalGroupRequirement(dto);
  }

  @Put("logical-group/:id")
  async updateLogicalGroupRequirement(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateLogicalGroupRequirementSchema)) dto: UpdateLogicalGroupRequirementDto,
  ): Promise<LogicalGroupRequirementListDto> {
    return this.requirementService.updateLogicalGroupRequirement(params.id, dto);
  }

  // ConditionalGroupRequirement endpoints

  @Post("conditional-group")
  async createConditionalGroupRequirement(
    @Body(zodBody(createConditionalGroupRequirementSchema))
    dto: CreateConditionalGroupRequirementDto,
  ): Promise<ConditionalGroupRequirementDetailDto> {
    return this.requirementService.createConditionalGroupRequirement(dto);
  }

  @Put("conditional-group/:id")
  async updateConditionalGroupRequirement(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateConditionalGroupRequirementSchema))
    dto: UpdateConditionalGroupRequirementDto,
  ): Promise<ConditionalGroupRequirementListDto> {
    return this.requirementService.updateConditionalGroupRequirement(params.id, dto);
  }

  // SimultaneousRequirement endpoints

  @Post("simultaneous")
  async createSimultaneousRequirement(
    @Body(zodBody(createSimultaneousRequirementSchema)) dto: CreateSimultaneousRequirementDto,
  ): Promise<SimultaneousRequirementDetailDto> {
    return this.requirementService.createSimultaneousRequirement(dto);
  }

  @Put("simultaneous/:id")
  async updateSimultaneousRequirement(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateSimultaneousRequirementSchema)) dto: UpdateSimultaneousRequirementDto,
  ): Promise<SimultaneousRequirementListDto> {
    return this.requirementService.updateSimultaneousRequirement(params.id, dto);
  }

  // ExceptionalRequirement endpoints

  @Post("exceptional")
  async createExceptionalRequirement(
    @Body(zodBody(createExceptionalRequirementSchema)) dto: CreateExceptionalRequirementDto,
  ): Promise<ExceptionalRequirementDetailDto> {
    return this.requirementService.createExceptionalRequirement(dto);
  }

  @Put("exceptional/:id")
  async updateExceptionalRequirement(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateExceptionalRequirementSchema)) dto: UpdateExceptionalRequirementDto,
  ): Promise<ExceptionalRequirementListDto> {
    return this.requirementService.updateExceptionalRequirement(params.id, dto);
  }
}
