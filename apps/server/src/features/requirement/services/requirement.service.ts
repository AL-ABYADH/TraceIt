import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ActorService } from "../../actor/services/actor/actor.service";
import { UseCaseService } from "../../use-case/services/use-case/use-case.service";
import { Requirement } from "../entities/requirement.entity";
import { CreateRequirementInterface } from "../interfaces/create-requirement.interface";
import { UpdateRequirementInterface } from "../interfaces/update-requirement.interface";
import { RequirementExceptionAttributes } from "../models/requirement-exception.model";
import { ExceptionalRequirementRepository } from "../repositories/exceptional-requirement.repository";
import { RequirementRepository } from "../repositories/requirement.repository";

/**
 * Service responsible for managing requirements, including their creation,
 * updates, hierarchical structure, exceptions, and relationships
 */
@Injectable()
export class RequirementService {
  constructor(
    private readonly requirementRepository: RequirementRepository,
    private readonly exceptionalRequirementRepository: ExceptionalRequirementRepository,
    private readonly useCaseService: UseCaseService,
    private readonly actorService: ActorService,
  ) {}

  //====================================
  // Core CRUD Operations
  //====================================

  /**
   * Creates a new requirement with optional parent or exception relationship
   * @param createDto Data for creating the requirement
   * @returns The created requirement
   * @throws BadRequestException if validation fails
   */
  async createRequirement(createDto: CreateRequirementInterface): Promise<Requirement> {
    try {
      if (createDto.exceptionId && createDto.parentRequirementId) {
        throw new BadRequestException(
          "You must provide either parentRequirementId or exceptionId, but not both.",
        );
      }

      console.log("I am here");

      // Validate use case exists
      await this.useCaseService.findById(createDto.useCaseId);

      // Validate all actor IDs exist
      if (createDto.actorIds && createDto.actorIds.length > 0) {
        for (const actorId of createDto.actorIds) {
          await this.actorService.findById(actorId);
        }
      }

      // Create the requirement
      const created = await this.requirementRepository.create(createDto);

      // Establish relationships if specified
      if (createDto.parentRequirementId) {
        await this.requirementRepository.addNestedRequirement(
          createDto.parentRequirementId,
          created.id,
        );
      } else if (createDto.exceptionId) {
        await this.exceptionalRequirementRepository.addRequirement(
          createDto.exceptionId,
          created.id,
        );
      }

      console.log(created.operation);

      return created;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Updates an existing requirement
   * @param id ID of the requirement to update
   * @param updateDto Data for updating the requirement
   * @returns The updated requirement
   * @throws NotFoundException if requirement not found
   */
  async updateRequirement(id: string, updateDto: UpdateRequirementInterface): Promise<Requirement> {
    // Verify requirement exists
    const requirement = await this.findById(id);

    // Validate all actor IDs exist
    if (updateDto.actorIds && updateDto.actorIds.length > 0) {
      for (const actorId of updateDto.actorIds) {
        await this.actorService.findById(actorId);
      }
    }

    return this.requirementRepository.update(id, updateDto);
  }

  /**
   * Deletes a requirement and its nested requirements and exceptions
   * @param id ID of the requirement to delete
   * @returns True if deletion was successful
   */
  async removeRequirement(id: string): Promise<boolean> {
    const data = await this.findById(id);

    // Delete all nested requirements
    if (data.nestedRequirements) {
      for (const nestedRequirement of data.nestedRequirements) {
        await this.requirementRepository.delete(nestedRequirement.id);
      }
    }

    // Delete all exceptions
    if (data.exceptions) {
      for (const exception of data.exceptions) {
        await this.exceptionalRequirementRepository.delete(exception.id);
      }
    }

    return this.requirementRepository.delete(id);
  }

  /**
   * Retrieves a requirement by its ID
   * @param id ID of the requirement to retrieve
   * @returns The requirement with all relationships
   * @throws NotFoundException if requirement not found
   */
  async findById(id: string): Promise<Requirement> {
    const requirement = await this.requirementRepository.getById(id);
    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${id} not found`);
    }
    return requirement;
  }

  //====================================
  // Hierarchical Requirements Management
  //====================================

  /**
   * Retrieves requirements for a use case in a hierarchical structure
   * using individual getById calls for each nested requirement and exception
   * @param useCaseId ID of the use case to fetch requirements for
   * @returns Hierarchically structured requirements
   */
  async findByUseCase(useCaseId: string): Promise<Requirement[]> {
    // Get top-level requirements for the use case
    const topLevelRequirements = await this.requirementRepository.getByUseCase(useCaseId);

    console.log("top:", topLevelRequirements.length);

    // Process each requirement to load its nested requirements and exceptions
    for (const requirement of topLevelRequirements) {
      // Load detailed information for nested requirements
      if (requirement.nestedRequirements?.length) {
        const detailedNestedReqs: Requirement[] = [];

        for (const nestedReq of requirement.nestedRequirements) {
          // Get full details for each nested requirement
          const detailedNestedReq = await this.requirementRepository.getById(nestedReq.id);

          if (detailedNestedReq) {
            // Process nested requirements recursively
            if (detailedNestedReq.nestedRequirements?.length) {
              await this.processNestedRequirements(detailedNestedReq);
            }

            // Process exceptions for the nested requirement
            if (detailedNestedReq.exceptions?.length) {
              await this.processExceptions(detailedNestedReq);
            }

            detailedNestedReqs.push(detailedNestedReq);
          }
        }

        // Replace the references with detailed objects
        requirement.nestedRequirements = detailedNestedReqs;
      }

      // Process exceptions for the top-level requirement
      if (requirement.exceptions?.length) {
        await this.processExceptions(requirement);
      }
    }

    return topLevelRequirements;
  }

  /**
   * Recursively processes nested requirements using individual getById calls
   * @param requirement The requirement to process nested requirements for
   */
  private async processNestedRequirements(requirement: Requirement): Promise<void> {
    const detailedNestedReqs: Requirement[] = [];

    for (const nestedReq of requirement.nestedRequirements || []) {
      const detailedNestedReq = await this.requirementRepository.getById(nestedReq.id);

      if (detailedNestedReq) {
        // Process deeper nested requirements recursively
        if (detailedNestedReq.nestedRequirements?.length) {
          await this.processNestedRequirements(detailedNestedReq);
        }

        // Process exceptions
        if (detailedNestedReq.exceptions?.length) {
          await this.processExceptions(detailedNestedReq);
        }

        detailedNestedReqs.push(detailedNestedReq);
      }
    }

    // Replace with detailed objects
    requirement.nestedRequirements = detailedNestedReqs;
  }

  /**
   * Processes exceptions for a requirement using individual getById calls
   * @param requirement The requirement to process exceptions for
   */
  private async processExceptions(requirement: Requirement): Promise<void> {
    const detailedExceptions: RequirementExceptionAttributes[] = [];

    for (const exception of requirement.exceptions || []) {
      const detailedException = await this.exceptionalRequirementRepository.getById(exception.id);

      if (detailedException) {
        detailedExceptions.push(detailedException);
      }
    }

    // Replace with detailed objects
    requirement.exceptions = detailedExceptions;
  }

  //====================================
  // Relationship Management
  //====================================

  /**
   * Adds a nested requirement relationship
   * @param parentId ID of the parent requirement
   * @param childId ID of the child requirement
   * @returns Updated parent requirement
   */
  async addNestedRequirement(parentId: string, childId: string): Promise<Requirement> {
    await this.findById(parentId);
    await this.findById(childId);
    return this.requirementRepository.addNestedRequirement(parentId, childId);
  }

  /**
   * Removes a nested requirement relationship
   * @param parentId ID of the parent requirement
   * @param childId ID of the child requirement
   * @returns True if removal was successful
   */
  async removeNestedRequirement(parentId: string, childId: string): Promise<boolean> {
    await this.findById(parentId);
    await this.findById(childId);
    return this.requirementRepository.removeNestedRequirement(parentId, childId);
  }

  /**
   * Adds an exception to a requirement
   * @param requirementId ID of the requirement
   * @param exceptionId ID of the exception
   * @returns Updated requirement
   */
  async addException(requirementId: string, exceptionId: string): Promise<Requirement> {
    await this.findById(requirementId);

    const exception = await this.exceptionalRequirementRepository.getById(exceptionId);
    if (!exception) {
      throw new NotFoundException(`Exception with ID ${exceptionId} not found`);
    }

    return this.requirementRepository.addException(requirementId, exceptionId);
  }

  /**
   * Removes an exception from a requirement
   * @param requirementId ID of the requirement
   * @param exceptionId ID of the exception
   * @returns True if removal was successful
   */
  async removeException(requirementId: string, exceptionId: string): Promise<boolean> {
    await this.findById(requirementId);

    const exception = await this.exceptionalRequirementRepository.getById(exceptionId);
    if (!exception) {
      throw new NotFoundException(`Exception with ID ${exceptionId} not found`);
    }

    return this.requirementRepository.removeException(requirementId, exceptionId);
  }

  /**
   * Transfers nested requirements from a primary use case to a secondary use case
   * @param parentRequirementId ID of the parent requirement
   * @param fromUseCaseId ID of the source use case
   * @param toUseCaseId ID of the target use case
   * @returns True if transfer was successful
   */
  async transferNestedRequirementsToSecondaryUseCase(
    parentRequirementId: string,
    fromUseCaseId: string,
    toUseCaseId: string,
  ): Promise<boolean> {
    // Verify the parent requirement and use cases exist
    const parentRequirement = await this.findById(parentRequirementId);
    await this.useCaseService.findById(fromUseCaseId);
    await this.useCaseService.findById(toUseCaseId);

    if (
      !parentRequirement.nestedRequirements ||
      parentRequirement.nestedRequirements.length === 0
    ) {
      throw new BadRequestException(
        `Requirement with ID ${parentRequirementId} has no nested requirements.`,
      );
    }

    // Extract IDs for nested requirements
    const nestedRequirementIds = parentRequirement.nestedRequirements.map((req) => req.id);

    // Transfer each nested requirement from the primary to the secondary use case
    for (const reqId of nestedRequirementIds) {
      await this.requirementRepository.changeUseCase(reqId, fromUseCaseId, toUseCaseId);
    }

    return true;
  }
}
