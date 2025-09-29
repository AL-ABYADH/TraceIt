import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ExceptionalRequirementRepository } from "../repositories/exceptional-requirement.repository";
import { CreateRequirementExceptionInterface } from "../interfaces/create-requirement.interface";
import { UpdateRequirementExceptionInterface } from "../interfaces/update-requirement.interface";
import { RequirementException } from "../entities/requirement-exception.entity";
import { RequirementService } from "./requirement.service";

/**
 * Service responsible for managing requirement exceptions, including
 * their creation, updates, and relationships with requirements
 */
@Injectable()
export class RequirementExceptionService {
  constructor(
    private readonly exceptionalRequirementRepository: ExceptionalRequirementRepository,
    private readonly requirementService: RequirementService,
  ) {}

  /**
   * Creates a new requirement exception and links it to a requirement
   * @param createDto Data for creating the exception
   * @returns The created exception
   * @throws BadRequestException if validation fails
   */
  async create(createDto: CreateRequirementExceptionInterface): Promise<RequirementException> {
    try {
      // Verify requirement exists
      await this.requirementService.findById(createDto.requirementId);

      // Create the exception
      const exception = await this.exceptionalRequirementRepository.create(createDto);

      // Link the exception to the requirement
      await this.requirementService.addException(createDto.requirementId, exception.id);

      return exception;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Updates an existing requirement exception
   * @param id ID of the exception to update
   * @param updateDto Data for updating the exception
   * @returns The updated exception
   * @throws NotFoundException if exception not found
   */
  async update(
    id: string,
    updateDto: UpdateRequirementExceptionInterface,
  ): Promise<RequirementException> {
    // Verify exception exists
    await this.findById(id);

    return this.exceptionalRequirementRepository.update(id, updateDto.name);
  }

  /**
   * Retrieves a requirement exception by its ID
   * @param id ID of the exception to retrieve
   * @returns The requirement exception
   * @throws NotFoundException if exception not found
   */
  async findById(id: string): Promise<RequirementException> {
    const exception = await this.exceptionalRequirementRepository.getById(id);
    if (!exception) {
      throw new NotFoundException(`Exception with ID ${id} not found`);
    }
    return exception;
  }

  /**
   * Adds a requirement to an exception
   * @param exceptionId ID of the exception
   * @param requirementId ID of the requirement to add
   * @returns Updated exception with the new requirement
   */
  async addRequirement(exceptionId: string, requirementId: string): Promise<RequirementException> {
    await this.findById(exceptionId);
    await this.requirementService.findById(exceptionId);
    return this.exceptionalRequirementRepository.addRequirement(exceptionId, requirementId);
  }

  /**
   * Deletes an exception and all its associated requirements
   * @param id ID of the exception to delete
   * @returns True if deletion was successful
   */
  async remove(id: string): Promise<boolean> {
    const details = await this.findById(id);

    // Delete all associated requirements
    if (details.requirements) {
      for (const detail of details.requirements) {
        await this.requirementService.removeRequirement(detail.id);
      }
    }

    return this.exceptionalRequirementRepository.delete(id);
  }
}
