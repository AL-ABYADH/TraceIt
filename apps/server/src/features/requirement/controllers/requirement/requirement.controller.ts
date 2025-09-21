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
  type UseCaseIdDto,
  type ProjectIdDto,
  type RequirementTypeDto,
  type requirementIdDto,
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
  requirementIdSchema,
} from "@repo/shared-schemas";

@Controller("requirements")
export class RequirementController {
  constructor(private readonly requirementService: RequirementService) {}

  // Generic endpoints for all requirement types

  /**
   * Get a requirement by ID
   */
  @Get(":requirementId")
  async findById(
    @Param(zodParam(requirementIdSchema)) params: requirementIdDto,
  ): Promise<RequirementDetailDto> {
    return this.requirementService.findById(params.requirementId);
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
  @Delete(":requirementId")
  async remove(
    @Param(zodParam(requirementIdSchema)) params: requirementIdDto,
  ): Promise<{ success: boolean }> {
    const success = await this.requirementService.remove(params.requirementId);
    return { success };
  }

  // SystemRequirement endpoints

  @Post("system")
  async createSystemRequirement(
    @Body(zodBody(createSystemRequirementSchema)) dto: CreateSystemRequirementDto,
  ): Promise<SystemRequirementDetailDto> {
    return this.requirementService.createSystemRequirement(dto);
  }

  @Put("system/:requirementId")
  async updateSystemRequirement(
    @Param(zodParam(requirementIdSchema)) params: requirementIdDto,
    @Body(zodBody(updateSystemRequirementSchema)) dto: UpdateSystemRequirementDto,
  ): Promise<SystemRequirementListDto> {
    return this.requirementService.updateSystemRequirement(params.requirementId, dto);
  }

  // EventSystemRequirement endpoints

  @Post("event-system")
  async createEventSystemRequirement(
    @Body(zodBody(createEventSystemRequirementSchema)) dto: CreateEventSystemRequirementDto,
  ): Promise<EventSystemRequirementDetailDto> {
    return this.requirementService.createEventSystemRequirement(dto);
  }

  @Put("event-system/:requirementId")
  async updateEventSystemRequirement(
    @Param(zodParam(requirementIdSchema)) params: requirementIdDto,
    @Body(zodBody(updateEventSystemRequirementSchema)) dto: UpdateEventSystemRequirementDto,
  ): Promise<EventSystemRequirementListDto> {
    return this.requirementService.updateEventSystemRequirement(params.requirementId, dto);
  }

  // ActorRequirement endpoints

  @Post("actor")
  async createActorRequirement(
    @Body(zodBody(createActorRequirementSchema)) dto: CreateActorRequirementDto,
  ): Promise<ActorRequirementDetailDto> {
    return this.requirementService.createActorRequirement(dto);
  }

  @Put("actor/:requirementId")
  async updateActorRequirement(
    @Param(zodParam(requirementIdSchema)) params: requirementIdDto,
    @Body(zodBody(updateActorRequirementSchema)) dto: UpdateActorRequirementDto,
  ): Promise<ActorRequirementListDto> {
    return this.requirementService.updateActorRequirement(params.requirementId, dto);
  }

  // SystemActorCommunicationRequirement endpoints

  @Post("system-actor-communication")
  async createSystemActorCommunicationRequirement(
    @Body(zodBody(createSystemActorCommunicationRequirementSchema))
    dto: CreateSystemActorCommunicationRequirementDto,
  ): Promise<SystemActorCommunicationRequirementDetailDto> {
    return this.requirementService.createSystemActorCommunicationRequirement(dto);
  }

  @Put("system-actor-communication/:requirementId")
  async updateSystemActorCommunicationRequirement(
    @Param(zodParam(requirementIdSchema)) params: requirementIdDto,
    @Body(zodBody(updateSystemActorCommunicationRequirementSchema))
    dto: UpdateSystemActorCommunicationRequirementDto,
  ): Promise<SystemActorCommunicationRequirementListDto> {
    return this.requirementService.updateSystemActorCommunicationRequirement(
      params.requirementId,
      dto,
    );
  }

  // ConditionalRequirement endpoints

  @Post("conditional")
  async createConditionalRequirement(
    @Body(zodBody(createConditionalRequirementSchema)) dto: CreateConditionalRequirementDto,
  ): Promise<ConditionalRequirementDetailDto> {
    return this.requirementService.createConditionalRequirement(dto);
  }

  @Put("conditional/:requirementId")
  async updateConditionalRequirement(
    @Param(zodParam(requirementIdSchema)) params: requirementIdDto,
    @Body(zodBody(updateConditionalRequirementSchema)) dto: UpdateConditionalRequirementDto,
  ): Promise<ConditionalRequirementListDto> {
    return this.requirementService.updateConditionalRequirement(params.requirementId, dto);
  }

  // RecursiveRequirement endpoints

  @Post("recursive")
  async createRecursiveRequirement(
    @Body(zodBody(createRecursiveRequirementSchema)) dto: CreateRecursiveRequirementDto,
  ): Promise<RecursiveRequirementDetailDto> {
    return this.requirementService.createRecursiveRequirement(dto);
  }

  @Put("recursive/:requirementId")
  async updateRecursiveRequirement(
    @Param(zodParam(requirementIdSchema)) params: requirementIdDto,
    @Body(zodBody(updateRecursiveRequirementSchema)) dto: UpdateRecursiveRequirementDto,
  ): Promise<RecursiveRequirementListDto> {
    return this.requirementService.updateRecursiveRequirement(params.requirementId, dto);
  }

  // UseCaseReferenceRequirement endpoints

  @Post("use-case-reference")
  async createUseCaseReferenceRequirement(
    @Body(zodBody(createUseCaseReferenceRequirementSchema))
    dto: CreateUseCaseReferenceRequirementDto,
  ): Promise<UseCaseReferenceRequirementDetailDto> {
    return this.requirementService.createUseCaseReferenceRequirement(dto);
  }

  @Put("use-case-reference/:requirementId")
  async updateUseCaseReferenceRequirement(
    @Param(zodParam(requirementIdSchema)) params: requirementIdDto,
    @Body(zodBody(updateUseCaseReferenceRequirementSchema))
    dto: UpdateUseCaseReferenceRequirementDto,
  ): Promise<UseCaseReferenceRequirementListDto> {
    return this.requirementService.updateUseCaseReferenceRequirement(params.requirementId, dto);
  }

  // LogicalGroupRequirement endpoints

  @Post("logical-group")
  async createLogicalGroupRequirement(
    @Body(zodBody(createLogicalGroupRequirementSchema)) dto: CreateLogicalGroupRequirementDto,
  ): Promise<LogicalGroupRequirementDetailDto> {
    return this.requirementService.createLogicalGroupRequirement(dto);
  }

  @Put("logical-group/:requirementId")
  async updateLogicalGroupRequirement(
    @Param(zodParam(requirementIdSchema)) params: requirementIdDto,
    @Body(zodBody(updateLogicalGroupRequirementSchema)) dto: UpdateLogicalGroupRequirementDto,
  ): Promise<LogicalGroupRequirementListDto> {
    return this.requirementService.updateLogicalGroupRequirement(params.requirementId, dto);
  }

  // ConditionalGroupRequirement endpoints

  @Post("conditional-group")
  async createConditionalGroupRequirement(
    @Body(zodBody(createConditionalGroupRequirementSchema))
    dto: CreateConditionalGroupRequirementDto,
  ): Promise<ConditionalGroupRequirementDetailDto> {
    return this.requirementService.createConditionalGroupRequirement(dto);
  }

  @Put("conditional-group/:requirementId")
  async updateConditionalGroupRequirement(
    @Param(zodParam(requirementIdSchema)) params: requirementIdDto,
    @Body(zodBody(updateConditionalGroupRequirementSchema))
    dto: UpdateConditionalGroupRequirementDto,
  ): Promise<ConditionalGroupRequirementListDto> {
    return this.requirementService.updateConditionalGroupRequirement(params.requirementId, dto);
  }

  // SimultaneousRequirement endpoints

  @Post("simultaneous")
  async createSimultaneousRequirement(
    @Body(zodBody(createSimultaneousRequirementSchema)) dto: CreateSimultaneousRequirementDto,
  ): Promise<SimultaneousRequirementDetailDto> {
    return this.requirementService.createSimultaneousRequirement(dto);
  }

  @Put("simultaneous/:requirementId")
  async updateSimultaneousRequirement(
    @Param(zodParam(requirementIdSchema)) params: requirementIdDto,
    @Body(zodBody(updateSimultaneousRequirementSchema)) dto: UpdateSimultaneousRequirementDto,
  ): Promise<SimultaneousRequirementListDto> {
    return this.requirementService.updateSimultaneousRequirement(params.requirementId, dto);
  }

  // ExceptionalRequirement endpoints

  @Post("exceptional")
  async createExceptionalRequirement(
    @Body(zodBody(createExceptionalRequirementSchema)) dto: CreateExceptionalRequirementDto,
  ): Promise<ExceptionalRequirementDetailDto> {
    return this.requirementService.createExceptionalRequirement(dto);
  }

  @Put("exceptional/:requirementId")
  async updateExceptionalRequirement(
    @Param(zodParam(requirementIdSchema)) params: requirementIdDto,
    @Body(zodBody(updateExceptionalRequirementSchema)) dto: UpdateExceptionalRequirementDto,
  ): Promise<ExceptionalRequirementListDto> {
    return this.requirementService.updateExceptionalRequirement(params.requirementId, dto);
  }
}
