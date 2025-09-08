import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { SecondaryUseCaseRepository } from "../../repositories/secondary-use-case/secondary-use-case.repository";
import { UpdateSecondaryUseCaseInterface } from "../../interfaces/update-use-case.interface";
import { ProjectService } from "../../../project/services/project/project.service";
import { PrimaryUseCaseService } from "../primary-use-case/primary-use-case.service";
import { SecondaryUseCase } from "../../entities/secondary-use-case.entity";
import { CreateSecondaryUseCaseInterface } from "../../interfaces/create-use-case.interface";

@Injectable()
export class SecondaryUseCaseService {
  constructor(
    private readonly secondaryUseCaseRepository: SecondaryUseCaseRepository,
    private readonly projectService: ProjectService,
    private readonly primaryUseCaseService: PrimaryUseCaseService,
  ) {}

  /**
   * Creates a new secondary use case
   * @param createDto - Data transfer object containing secondary use case details
   * @returns Promise resolving to the created secondary use case
   * @throws BadRequestException if project or primary use case don't exist
   */
  async create(createDto: CreateSecondaryUseCaseInterface): Promise<SecondaryUseCase> {
    try {
      // Verify project exists
      await this.projectService.findById(createDto.projectId);

      // Verify primary use case exists
      await this.primaryUseCaseService.findById(createDto.primaryUseCaseId);

      // Create the secondary use case
      return this.secondaryUseCaseRepository.create(createDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        if (error.message.includes("Project")) {
          throw new BadRequestException(`Project with ID ${createDto.projectId} not found`);
        } else {
          throw new BadRequestException(
            `Primary use case with ID ${createDto.primaryUseCaseId} not found`,
          );
        }
      }
      throw error;
    }
  }

  /**
   * Updates an existing secondary use case
   * @param id - ID of the secondary use case to update
   * @param updateDto - Data to update in the secondary use case
   * @returns Promise resolving to the updated secondary use case
   * @throws NotFoundException if the secondary use case doesn't exist
   * @throws BadRequestException if the referenced primary use case doesn't exist
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
   * Retrieves a secondary use case by its ID
   * @param id - ID of the secondary use case to findById
   * @returns Promise resolving to the secondary use case
   * @throws NotFoundException if the secondary use case doesn't exist
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
   * @returns Promise resolving to an array of secondary use cases
   */
  async findAll(): Promise<SecondaryUseCase[]> {
    return this.secondaryUseCaseRepository.getAll();
  }

  /**
   * Retrieves all secondary use cases for a specific project
   * @param projectId - ID of the project
   * @returns Promise resolving to an array of secondary use cases
   * @throws BadRequestException if the project doesn't exist
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
   * @returns Promise resolving to an array of secondary use cases
   * @throws BadRequestException if the primary use case doesn't exist
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

  /**
   * Removes a secondary use case
   * @param id - ID of the secondary use case to remove
   * @returns Promise resolving to a boolean indicating success
   * @throws NotFoundException if the secondary use case doesn't exist
   */
  async remove(id: string): Promise<boolean> {
    // Verify secondary use case exists
    await this.findById(id);

    return this.secondaryUseCaseRepository.delete(id);
  }

  /**
   * Changes the primary use case association for a secondary use case
   * @param id - ID of the secondary use case to update
   * @param primaryUseCaseId - ID of the new primary use case
   * @returns Promise resolving to the updated secondary use case
   * @throws NotFoundException if the secondary use case doesn't exist
   * @throws BadRequestException if the primary use case doesn't exist
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
}
