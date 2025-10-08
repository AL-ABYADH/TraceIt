import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { RequirementExceptionService } from "src/features/requirement/services/requirement-exception.service";
import { ProjectService } from "../../../project/services/project/project.service";
import { RequirementService } from "../../../requirement/services/requirement.service";
import { SecondaryUseCase } from "../../entities/secondary-use-case.entity";
import { CreateSecondaryUseCaseInterface } from "../../interfaces/create-use-case.interface";
import { UpdateSecondaryUseCaseInterface } from "../../interfaces/update-use-case.interface";
import { SecondaryUseCaseRepository } from "../../repositories/secondary-use-case/secondary-use-case.repository";
import { PrimaryUseCaseService } from "../primary-use-case/primary-use-case.service";

/**
 * Service for managing secondary use cases, including their relationships
 * with primary use cases, requirements, and projects
 */
@Injectable()
export class SecondaryUseCaseService {
  constructor(
    private readonly secondaryUseCaseRepository: SecondaryUseCaseRepository,
    private readonly projectService: ProjectService,
    private readonly primaryUseCaseService: PrimaryUseCaseService,
    private readonly requirementService: RequirementService,
    private readonly requirementExceptionService: RequirementExceptionService,
  ) {}

  //====================================
  // Creation and Modification
  //====================================

  /**
   * Creates a new secondary use case and transfers nested requirements
   * @param createDto - Data transfer object containing secondary use case details
   * @returns Created secondary use case
   * @throws BadRequestException if validations fail
   */
  async create(createDto: CreateSecondaryUseCaseInterface): Promise<SecondaryUseCase> {
    try {
      // Verify project and primary use case exist
      await this.projectService.findById(createDto.projectId);
      await this.primaryUseCaseService.findById(createDto.primaryUseCaseId);

      // Verify requirement exists
      if (createDto.requirementId) {
        const requirement = await this.requirementService.findById(createDto.requirementId);
        // Verify requirement has nested requirements
        if (!requirement.nestedRequirements || requirement.nestedRequirements.length === 0) {
          throw new BadRequestException(
            `Cannot create a secondary use case for requirement ${createDto.requirementId} as it has no nested requirements.`,
          );
        }
        const secondaryUseCase = await this.secondaryUseCaseRepository.create(createDto);

        // Transfer nested requirements to the secondary use case
        await this.requirementService.setParentRequirementToSecondaryUseCase(
          requirement.id,
          secondaryUseCase.id,
        );
        return secondaryUseCase;
      } else if (createDto.exceptionId) {
        const exception = await this.requirementExceptionService.findById(createDto.exceptionId);
        if (!exception.requirements || exception.requirements.length === 0) {
          throw new BadRequestException(
            `Cannot create a secondary use case for exception ${createDto.exceptionId} as it has no requirements.`,
          );
        }

        const secondaryUseCase = await this.secondaryUseCaseRepository.create(createDto);

        await this.requirementExceptionService.setExceptionToSecondaryUseCase(
          exception.id,
          secondaryUseCase.id,
        );

        return secondaryUseCase;
      } else {
        throw new BadRequestException(
          "Either requirementId or exceptionId must be provided to create a secondary use case.",
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Updates an existing secondary use case
   * @param id - ID of the secondary use case to update
   * @param updateDto - Data to update in the secondary use case
   * @returns Updated secondary use case
   * @throws NotFoundException if the secondary use case doesn't exist
   */
  async update(id: string, updateDto: UpdateSecondaryUseCaseInterface): Promise<SecondaryUseCase> {
    // Verify secondary use case exists
    await this.findById(id);

    // If updating primary use case reference, verify it exists
    if (updateDto.primaryUseCaseId) {
      try {
        await this.primaryUseCaseService.findById(updateDto.primaryUseCaseId);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new BadRequestException(
            `Primary use case with ID ${updateDto.primaryUseCaseId} not found`,
          );
        }
        throw error;
      }
    }

    return this.secondaryUseCaseRepository.update(id, updateDto);
  }

  /**
   * Changes the primary use case association for a secondary use case
   * @param id - ID of the secondary use case to update
   * @param primaryUseCaseId - ID of the new primary use case
   * @returns Updated secondary use case
   */
  async changePrimaryUseCase(id: string, primaryUseCaseId: string): Promise<SecondaryUseCase> {
    // Verify secondary use case exists
    await this.findById(id);

    // Verify primary use case exists
    try {
      await this.primaryUseCaseService.findById(primaryUseCaseId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Primary use case with ID ${primaryUseCaseId} not found`);
      }
      throw error;
    }

    return this.secondaryUseCaseRepository.update(id, { primaryUseCaseId });
  }

  /**
   * Removes a secondary use case
   * @param id - ID of the secondary use case to remove
   * @returns Boolean indicating success
   */
  async remove(id: string): Promise<boolean> {
    // Verify secondary use case exists
    await this.findById(id);

    return this.secondaryUseCaseRepository.delete(id);
  }

  //====================================
  // Retrieval Methods
  //====================================

  /**
   * Retrieves a secondary use case by its ID
   * @param id - ID of the secondary use case to retrieve
   * @returns Secondary use case
   * @throws NotFoundException if not found
   */
  async findById(id: string): Promise<SecondaryUseCase> {
    const useCase = await this.secondaryUseCaseRepository.getById(id);
    if (!useCase) {
      throw new NotFoundException(`Secondary use case with ID ${id} not found`);
    }
    return useCase;
  }

  /**
   * Retrieves all secondary use cases
   * @returns Array of all secondary use cases
   */
  async findAll(): Promise<SecondaryUseCase[]> {
    return this.secondaryUseCaseRepository.getAll();
  }

  /**
   * Retrieves all secondary use cases for a specific project
   * @param projectId - ID of the project
   * @returns Array of secondary use cases in the project
   */
  async listByProject(projectId: string): Promise<SecondaryUseCase[]> {
    try {
      // Verify project exists
      await this.projectService.findById(projectId);

      // Get secondary use cases for the project
      return this.secondaryUseCaseRepository.getByProject(projectId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Project with ID ${projectId} not found`);
      }
      throw error;
    }
  }

  /**
   * Retrieves all secondary use cases for a specific primary use case
   * @param primaryUseCaseId - ID of the primary use case
   * @returns Array of secondary use cases related to the primary use case
   */
  async listByPrimaryUseCase(primaryUseCaseId: string): Promise<SecondaryUseCase[]> {
    try {
      // Verify primary use case exists
      await this.primaryUseCaseService.findById(primaryUseCaseId);

      // Get all secondary use cases
      const allSecondaryUseCases = await this.findAll();

      // Filter by primary use case
      return allSecondaryUseCases;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Primary use case with ID ${primaryUseCaseId} not found`);
      }
      throw error;
    }
  }
}
