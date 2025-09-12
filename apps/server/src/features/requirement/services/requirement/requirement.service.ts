import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { RequirementRepositoryFactory } from "../../repositories/factory/requirement-repository.factory";
import { RequirementFactoryService } from "../requirement-factory/requirement-factory.service";
import { RequirementRepository } from "../../repositories/requirement/requirement.repository";
import { RequirementType } from "../../enums/requirement-type.enum";
import { UseCaseService } from "../../../use-case/services/use-case/use-case.service";
import { ProjectService } from "../../../project/services/project/project.service";

// Import all entities
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

// Import all interfaces
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
   * Determine requirement type from entity
   */
  private getRequirementTypeFromEntity(requirement: Requirement): RequirementType {
    const constructorName = requirement.constructor.name;
    switch (constructorName) {
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
        throw new BadRequestException(`Unknown requirement type: ${constructorName}`);
    }
  }

  /**
   * Update a requirement by ID
   */
  async update(id: string, updateDto: any): Promise<Requirement[]> {
    // Find requirement to determine its type
    const requirement = await this.findById(id);

    // Get the appropriate repository based on type
    const type = this.getRequirementTypeFromEntity(requirement);
    const repository = this.repositoryFactory.getConcreteRepository(type);

    // Update the requirement
    const updatedRequirements = await repository.update(id, updateDto);
    if (!updatedRequirements || updatedRequirements.length === 0) {
      throw new NotFoundException(`Requirement with ID ${id} not found after update`);
    }

    return updatedRequirements;
  }

  /**
   * Delete a requirement by ID
   */
  async remove(id: string): Promise<boolean> {
    // Find requirement to determine its type
    const requirement = await this.findById(id);

    // Get the appropriate repository based on type
    const type = this.getRequirementTypeFromEntity(requirement);
    const repository = this.repositoryFactory.getConcreteRepository(type);

    // Delete the requirement
    return repository.delete(id);
  }

  // Create methods for different requirement types

  async createSystemRequirement(
    createDto: CreateSystemRequirementInterface,
  ): Promise<SystemRequirement> {
    return this.requirementFactory.createSystemRequirement(createDto) as Promise<SystemRequirement>;
  }

  async createEventSystemRequirement(
    createDto: CreateEventSystemRequirementInterface,
  ): Promise<EventSystemRequirement> {
    return this.requirementFactory.createEventSystemRequirement(
      createDto,
    ) as Promise<EventSystemRequirement>;
  }

  async createActorRequirement(
    createDto: CreateActorRequirementInterface,
  ): Promise<ActorRequirement> {
    return this.requirementFactory.createActorRequirement(createDto) as Promise<ActorRequirement>;
  }

  async createSystemActorCommunicationRequirement(
    createDto: CreateSystemActorCommunicationRequirementInterface,
  ): Promise<SystemActorCommunicationRequirement> {
    return this.requirementFactory.createSystemActorCommunicationRequirement(
      createDto,
    ) as Promise<SystemActorCommunicationRequirement>;
  }

  async createConditionalRequirement(
    createDto: CreateConditionalRequirementInterface,
  ): Promise<ConditionalRequirement> {
    return this.requirementFactory.createConditionalRequirement(
      createDto,
    ) as Promise<ConditionalRequirement>;
  }

  async createRecursiveRequirement(
    createDto: CreateRecursiveRequirementInterface,
  ): Promise<RecursiveRequirement> {
    return this.requirementFactory.createRecursiveRequirement(
      createDto,
    ) as Promise<RecursiveRequirement>;
  }

  async createUseCaseReferenceRequirement(
    createDto: CreateUseCaseReferenceRequirementInterface,
  ): Promise<UseCaseReferenceRequirement> {
    return this.requirementFactory.createUseCaseReferenceRequirement(
      createDto,
    ) as Promise<UseCaseReferenceRequirement>;
  }

  async createLogicalGroupRequirement(
    createDto: CreateLogicalGroupRequirementInterface,
  ): Promise<LogicalGroupRequirement> {
    return this.requirementFactory.createLogicalGroupRequirement(
      createDto,
    ) as Promise<LogicalGroupRequirement>;
  }

  async createConditionalGroupRequirement(
    createDto: CreateConditionalGroupRequirementInterface,
  ): Promise<ConditionalGroupRequirement> {
    return this.requirementFactory.createConditionalGroupRequirement(
      createDto,
    ) as Promise<ConditionalGroupRequirement>;
  }

  async createSimultaneousRequirement(
    createDto: CreateSimultaneousRequirementInterface,
  ): Promise<SimultaneousRequirement> {
    return this.requirementFactory.createSimultaneousRequirement(
      createDto,
    ) as Promise<SimultaneousRequirement>;
  }

  async createExceptionalRequirement(
    createDto: CreateExceptionalRequirementInterface,
  ): Promise<ExceptionalRequirement> {
    return this.requirementFactory.createExceptionalRequirement(
      createDto,
    ) as Promise<ExceptionalRequirement>;
  }

  // Update methods for different requirement types

  async updateSystemRequirement(
    id: string,
    updateDto: UpdateSystemRequirementInterface,
  ): Promise<SystemRequirement[]> {
    return this.update(id, updateDto) as Promise<SystemRequirement[]>;
  }

  async updateEventSystemRequirement(
    id: string,
    updateDto: UpdateEventSystemRequirementInterface,
  ): Promise<EventSystemRequirement[]> {
    return this.update(id, updateDto) as Promise<EventSystemRequirement[]>;
  }

  async updateActorRequirement(
    id: string,
    updateDto: UpdateActorRequirementInterface,
  ): Promise<ActorRequirement[]> {
    return this.update(id, updateDto) as Promise<ActorRequirement[]>;
  }

  async updateSystemActorCommunicationRequirement(
    id: string,
    updateDto: UpdateSystemActorCommunicationRequirementInterface,
  ): Promise<SystemActorCommunicationRequirement[]> {
    return this.update(id, updateDto) as Promise<SystemActorCommunicationRequirement[]>;
  }

  async updateConditionalRequirement(
    id: string,
    updateDto: UpdateConditionalRequirementInterface,
  ): Promise<ConditionalRequirement[]> {
    return this.update(id, updateDto) as Promise<ConditionalRequirement[]>;
  }

  async updateRecursiveRequirement(
    id: string,
    updateDto: UpdateRecursiveRequirementInterface,
  ): Promise<RecursiveRequirement[]> {
    return this.update(id, updateDto) as Promise<RecursiveRequirement[]>;
  }

  async updateUseCaseReferenceRequirement(
    id: string,
    updateDto: UpdateUseCaseReferenceRequirementInterface,
  ): Promise<UseCaseReferenceRequirement[]> {
    return this.update(id, updateDto) as Promise<UseCaseReferenceRequirement[]>;
  }

  async updateLogicalGroupRequirement(
    id: string,
    updateDto: UpdateLogicalGroupRequirementInterface,
  ): Promise<LogicalGroupRequirement[]> {
    return this.update(id, updateDto) as Promise<LogicalGroupRequirement[]>;
  }

  async updateConditionalGroupRequirement(
    id: string,
    updateDto: UpdateConditionalGroupRequirementInterface,
  ): Promise<ConditionalGroupRequirement[]> {
    return this.update(id, updateDto) as Promise<ConditionalGroupRequirement[]>;
  }

  async updateSimultaneousRequirement(
    id: string,
    updateDto: UpdateSimultaneousRequirementInterface,
  ): Promise<SimultaneousRequirement[]> {
    return this.update(id, updateDto) as Promise<SimultaneousRequirement[]>;
  }

  async updateExceptionalRequirement(
    id: string,
    updateDto: UpdateExceptionalRequirementInterface,
  ): Promise<ExceptionalRequirement[]> {
    return this.update(id, updateDto) as Promise<ExceptionalRequirement[]>;
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

  /**
   * Get all requirements of a specific type for a project
   */
  async getRequirementsByTypeAndProject(
    type: RequirementType,
    projectId: string,
  ): Promise<Requirement[]> {
    // Verify project exists
    await this.projectService.findById(projectId);

    // Get the appropriate repository
    const repository = this.repositoryFactory.getConcreteRepository(type);

    // Get requirements
    return repository.getByProject(projectId);
  }

  /**
   * Checks if a requirement can be used as a dependency for another requirement
   * based on the rules specified in the requirements
   */
  async validateRequirementDependency(
    sourceRequirementType: RequirementType,
    targetRequirementId: string,
  ): Promise<boolean> {
    const targetRequirement = await this.findById(targetRequirementId);
    const targetType = this.getRequirementTypeFromEntity(targetRequirement);

    // Implement validation logic based on requirement rules
    switch (sourceRequirementType) {
      case RequirementType.CONDITIONAL_REQUIREMENT:
        // Conditional requirements cannot reference exceptional, conditional group, or another conditional requirement
        return ![
          RequirementType.EXCEPTIONAL_REQUIREMENT,
          RequirementType.CONDITIONAL_GROUP_REQUIREMENT,
          RequirementType.CONDITIONAL_REQUIREMENT,
        ].includes(targetType);

      case RequirementType.LOGICAL_GROUP_REQUIREMENT:
        // Main requirement cannot be a system-actor communication, recursive, composite, or use case reference requirement
        return ![
          RequirementType.SYSTEM_ACTOR_COMMUNICATION_REQUIREMENT,
          RequirementType.RECURSIVE_REQUIREMENT,
          RequirementType.LOGICAL_GROUP_REQUIREMENT,
          RequirementType.CONDITIONAL_GROUP_REQUIREMENT,
          RequirementType.SIMULTANEOUS_REQUIREMENT,
          RequirementType.EXCEPTIONAL_REQUIREMENT,
          RequirementType.USE_CASE_REFERENCE_REQUIREMENT,
        ].includes(targetType);

      // Add more validation rules for other requirement types as needed

      default:
        // By default, allow dependencies
        return true;
    }
  }
}
