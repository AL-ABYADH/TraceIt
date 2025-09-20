import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { RequirementRepositoryFactory } from "../../repositories/factory/requirement-repository.factory";
import { RequirementFactoryService } from "../requirement-factory/requirement-factory.service";
import { RequirementRepository } from "../../repositories/requirement/requirement.repository";
import { RequirementType } from "../../enums/requirement-type.enum";
import { UseCaseService } from "../../../use-case/services/use-case/use-case.service";
import { ProjectService } from "../../../project/services/project/project.service";

// Entities (only used as return types for strong typing)
import {
  Requirement,
  SystemRequirement,
  EventSystemRequirement,
  ActorRequirement,
  SystemActorCommunicationRequirement,
  ConditionalRequirement,
  RecursiveRequirement,
  UseCaseReferenceRequirement,
  LogicalGroupRequirement,
  ConditionalGroupRequirement,
  SimultaneousRequirement,
  ExceptionalRequirement,
} from "../../entities";

// Create DTOs
import {
  CreateSystemRequirementInterface,
  CreateEventSystemRequirementInterface,
  CreateActorRequirementInterface,
  CreateSystemActorCommunicationRequirementInterface,
  CreateConditionalRequirementInterface,
  CreateRecursiveRequirementInterface,
  CreateUseCaseReferenceRequirementInterface,
  CreateLogicalGroupRequirementInterface,
  CreateConditionalGroupRequirementInterface,
  CreateSimultaneousRequirementInterface,
  CreateExceptionalRequirementInterface,
} from "../../interfaces/create-requirement.interface";

// Update DTOs
import {
  UpdateSystemRequirementInterface,
  UpdateEventSystemRequirementInterface,
  UpdateActorRequirementInterface,
  UpdateSystemActorCommunicationRequirementInterface,
  UpdateConditionalRequirementInterface,
  UpdateRecursiveRequirementInterface,
  UpdateUseCaseReferenceRequirementInterface,
  UpdateLogicalGroupRequirementInterface,
  UpdateConditionalGroupRequirementInterface,
  UpdateSimultaneousRequirementInterface,
  UpdateExceptionalRequirementInterface,
} from "../../interfaces/update-requirement.interface";

@Injectable()
export class RequirementService {
  constructor(
    private readonly repositoryFactory: RequirementRepositoryFactory,
    private readonly requirementFactory: RequirementFactoryService,
    private readonly requirementRepository: RequirementRepository,
    private readonly useCaseService: UseCaseService,
    private readonly projectService: ProjectService,
  ) {}

  /**
   * Get a requirement by its ID
   */
  async findById(id: string): Promise<Requirement> {
    const requirement = await this.requirementRepository.getById(id);
    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${id} not found`);
    }
    return requirement;
  }

  /**
   * Get all requirements for a specific use case
   */
  async getByUseCase(useCaseId: string): Promise<Requirement[]> {
    // Verify use case exists
    await this.useCaseService.findById(useCaseId);
    return this.requirementRepository.getByUseCase(useCaseId);
  }

  /**
   * Get all requirements for a specific project
   */
  async getByProject(projectId: string): Promise<Requirement[]> {
    // Verify project exists
    await this.projectService.findById(projectId);
    return this.requirementRepository.getByProject(projectId);
  }

  /**
   * Determine requirement type from entity via its most-specific label
   */
  private async getRequirementTypeFromEntity(requirement: Requirement): Promise<RequirementType> {
    const labels = await this.requirementRepository.getLabelsById(requirement.id);
    if (!labels || labels.length === 0) {
      throw new NotFoundException(`Requirement with ID ${requirement.id} has no labels`);
    }

    const lastLabel = labels.at(-1);
    switch (lastLabel) {
      case "SystemRequirement":
        return RequirementType.SYSTEM_REQUIREMENT;
      case "EventSystemRequirement":
        return RequirementType.EVENT_SYSTEM_REQUIREMENT;
      case "ActorRequirement":
        return RequirementType.ACTOR_REQUIREMENT;
      case "SystemActorCommunicationRequirement":
        return RequirementType.SYSTEM_ACTOR_COMMUNICATION_REQUIREMENT;
      case "ConditionalRequirement":
        return RequirementType.CONDITIONAL_REQUIREMENT;
      case "RecursiveRequirement":
        return RequirementType.RECURSIVE_REQUIREMENT;
      case "UseCaseReferenceRequirement":
        return RequirementType.USE_CASE_REFERENCE_REQUIREMENT;
      case "LogicalGroupRequirement":
        return RequirementType.LOGICAL_GROUP_REQUIREMENT;
      case "ConditionalGroupRequirement":
        return RequirementType.CONDITIONAL_GROUP_REQUIREMENT;
      case "SimultaneousRequirement":
        return RequirementType.SIMULTANEOUS_REQUIREMENT;
      case "ExceptionalRequirement":
        return RequirementType.EXCEPTIONAL_REQUIREMENT;
      default:
        throw new BadRequestException(`Unknown requirement type: ${lastLabel}`);
    }
  }

  /**
   * Update a requirement by ID (type-dispatched)
   */
  async update(id: string, updateDto: any): Promise<Requirement> {
    // Find requirement to determine its type
    const requirement = await this.findById(id);

    // Get the appropriate repository based on type
    const type = await this.getRequirementTypeFromEntity(requirement);
    const repository = this.repositoryFactory.getConcreteRepository(type);

    // Update the requirement
    const updatedRequirements = await repository.update(id, updateDto);
    if (!updatedRequirements) {
      throw new NotFoundException(`Requirement with ID ${id} not found after update`);
    }

    return updatedRequirements;
  }

  /**
   * Delete a requirement by ID (type-dispatched)
   */
  async remove(id: string): Promise<boolean> {
    // Find requirement to determine its type
    const requirement = await this.findById(id);

    // Get the appropriate repository based on type
    const type = await this.getRequirementTypeFromEntity(requirement);
    const repository = this.repositoryFactory.getConcreteRepository(type);

    // Delete the requirement
    return repository.delete(id);
  }

  async createSystemRequirement(
    createDto: CreateSystemRequirementInterface,
  ): Promise<SystemRequirement> {
    const data = await this.requirementFactory.createSystemRequirement(createDto);
    return data as SystemRequirement;
  }

  async createEventSystemRequirement(
    createDto: CreateEventSystemRequirementInterface,
  ): Promise<EventSystemRequirement> {
    const data = await this.requirementFactory.createEventSystemRequirement(createDto);
    return data as EventSystemRequirement;
  }

  async createActorRequirement(
    createDto: CreateActorRequirementInterface,
  ): Promise<ActorRequirement> {
    const data = await this.requirementFactory.createActorRequirement(createDto);
    return data as ActorRequirement;
  }

  async createSystemActorCommunicationRequirement(
    createDto: CreateSystemActorCommunicationRequirementInterface,
  ): Promise<SystemActorCommunicationRequirement> {
    const data = await this.requirementFactory.createSystemActorCommunicationRequirement(createDto);
    return data as SystemActorCommunicationRequirement;
  }

  async createConditionalRequirement(
    createDto: CreateConditionalRequirementInterface,
  ): Promise<ConditionalRequirement> {
    const data = await this.requirementFactory.createConditionalRequirement(createDto);
    return data as ConditionalRequirement;
  }

  async createRecursiveRequirement(
    createDto: CreateRecursiveRequirementInterface,
  ): Promise<RecursiveRequirement> {
    const data = await this.requirementFactory.createRecursiveRequirement(createDto);
    return data as RecursiveRequirement;
  }

  async createUseCaseReferenceRequirement(
    createDto: CreateUseCaseReferenceRequirementInterface,
  ): Promise<UseCaseReferenceRequirement> {
    const data = await this.requirementFactory.createUseCaseReferenceRequirement(createDto);
    return data as UseCaseReferenceRequirement;
  }

  async createLogicalGroupRequirement(
    createDto: CreateLogicalGroupRequirementInterface,
  ): Promise<LogicalGroupRequirement> {
    const data = await this.requirementFactory.createLogicalGroupRequirement(createDto);
    return data as LogicalGroupRequirement;
  }

  async createConditionalGroupRequirement(
    createDto: CreateConditionalGroupRequirementInterface,
  ): Promise<ConditionalGroupRequirement> {
    const data = await this.requirementFactory.createConditionalGroupRequirement(createDto);
    return data as ConditionalGroupRequirement;
  }

  async createSimultaneousRequirement(
    createDto: CreateSimultaneousRequirementInterface,
  ): Promise<SimultaneousRequirement> {
    const data = await this.requirementFactory.createSimultaneousRequirement(createDto);
    return data as SimultaneousRequirement;
  }

  async createExceptionalRequirement(
    createDto: CreateExceptionalRequirementInterface,
  ): Promise<ExceptionalRequirement> {
    const data = await this.requirementFactory.createExceptionalRequirement(createDto);
    return data as ExceptionalRequirement;
  }

  async updateSystemRequirement(
    id: string,
    updateDto: UpdateSystemRequirementInterface,
  ): Promise<SystemRequirement> {
    return this.update(id, updateDto) as Promise<SystemRequirement>;
  }

  async updateEventSystemRequirement(
    id: string,
    updateDto: UpdateEventSystemRequirementInterface,
  ): Promise<EventSystemRequirement> {
    return this.update(id, updateDto) as Promise<EventSystemRequirement>;
  }

  async updateActorRequirement(
    id: string,
    updateDto: UpdateActorRequirementInterface,
  ): Promise<ActorRequirement> {
    return this.update(id, updateDto) as Promise<ActorRequirement>;
  }

  async updateSystemActorCommunicationRequirement(
    id: string,
    updateDto: UpdateSystemActorCommunicationRequirementInterface,
  ): Promise<SystemActorCommunicationRequirement> {
    return this.update(id, updateDto) as Promise<SystemActorCommunicationRequirement>;
  }

  async updateConditionalRequirement(
    id: string,
    updateDto: UpdateConditionalRequirementInterface,
  ): Promise<ConditionalRequirement> {
    return this.update(id, updateDto) as Promise<ConditionalRequirement>;
  }

  async updateRecursiveRequirement(
    id: string,
    updateDto: UpdateRecursiveRequirementInterface,
  ): Promise<RecursiveRequirement> {
    return this.update(id, updateDto) as Promise<RecursiveRequirement>;
  }

  async updateUseCaseReferenceRequirement(
    id: string,
    updateDto: UpdateUseCaseReferenceRequirementInterface,
  ): Promise<UseCaseReferenceRequirement> {
    return this.update(id, updateDto) as Promise<UseCaseReferenceRequirement>;
  }

  async updateLogicalGroupRequirement(
    id: string,
    updateDto: UpdateLogicalGroupRequirementInterface,
  ): Promise<LogicalGroupRequirement> {
    return this.update(id, updateDto) as Promise<LogicalGroupRequirement>;
  }

  async updateConditionalGroupRequirement(
    id: string,
    updateDto: UpdateConditionalGroupRequirementInterface,
  ): Promise<ConditionalGroupRequirement> {
    return this.update(id, updateDto) as Promise<ConditionalGroupRequirement>;
  }

  async updateSimultaneousRequirement(
    id: string,
    updateDto: UpdateSimultaneousRequirementInterface,
  ): Promise<SimultaneousRequirement> {
    return this.update(id, updateDto) as Promise<SimultaneousRequirement>;
  }

  async updateExceptionalRequirement(
    id: string,
    updateDto: UpdateExceptionalRequirementInterface,
  ): Promise<ExceptionalRequirement> {
    return this.update(id, updateDto) as Promise<ExceptionalRequirement>;
  }

  /**
   * Get all requirements of a specific type for a use case
   */
  async getRequirementsByTypeAndUseCase(
    type: RequirementType,
    useCaseId: string,
  ): Promise<Requirement[]> {
    // Verify use case exists
    await this.useCaseService.findById(useCaseId);

    // Get the appropriate repository
    const repository = this.repositoryFactory.getConcreteRepository(type);

    // Get requirements
    return repository.getByUseCase(useCaseId);
  }
}
