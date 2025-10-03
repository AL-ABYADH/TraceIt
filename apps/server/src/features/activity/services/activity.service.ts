import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { ActivityRepository } from "../repositories/activity.repository";
import { Activity } from "../entities/activity.entity";
import { CreateActivityInterface } from "../interfaces/create-activity.interface";
import { UpdateActivityInterface } from "../interfaces/update-activity.interface";
import { RequirementService } from "src/features/requirement/services/requirement.service";
import { UseCaseService } from "../../use-case/services/use-case/use-case.service";

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly requirementService: RequirementService,
    private readonly useCaseService: UseCaseService,
  ) {}

  /**
   * Creates a new activity with validation to ensure requirement belongs to same use case
   * @param createDto - Data transfer object containing activity details
   * @returns Promise resolving to the created activity
   * @throws BadRequestException if the requirement doesn't belong to the same use case
   */
  async create(createDto: CreateActivityInterface): Promise<Activity> {
    try {
      // Validate use case exists and is required
      if (!createDto.useCaseId) {
        throw new BadRequestException("useCaseId is required to create an activity");
      }
      await this.useCaseService.findById(createDto.useCaseId);

      // If requirement is provided, validate it belongs to the same use case
      if (createDto.requirementId) {
        await this.validateRequirementBelongsToUseCase(
          createDto.requirementId,
          createDto.useCaseId,
        );
      }

      const activity = await this.activityRepository.create(createDto);
      return activity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Updates an existing activity (only name can be updated, not relationships)
   * @param id - ID of the activity to update
   * @param updateDto - Data to update in the activity (only name)
   * @returns Promise resolving to the updated activity
   * @throws NotFoundException if the activity doesn't exist
   */
  async update(id: string, updateDto: UpdateActivityInterface): Promise<Activity> {
    try {
      // Verify activity exists
      await this.findById(id);

      // Only allow name updates, not relationship changes
      return await this.activityRepository.update(id, updateDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update activity: ${error.message}`);
    }
  }

  /**
   * Validates that a requirement belongs to the specified use case
   * @param requirementId - ID of the requirement to validate
   * @param useCaseId - ID of the use case it should belong to
   * @throws BadRequestException if requirement doesn't belong to the use case
   */
  private async validateRequirementBelongsToUseCase(
    requirementId: string,
    useCaseId: string,
  ): Promise<void> {
    try {
      // Get the requirement with its use case relationship
      const requirement = await this.requirementService.findById(requirementId);

      // Since both PrimaryUseCase and SecondaryUseCase extend UseCase,
      // we can simply check if the requirement's useCase matches
      if (requirement.useCase?.id !== useCaseId) {
        throw new BadRequestException(
          `Requirement ${requirementId} does not belong to use case ${useCaseId}. ` +
            `It belongs to use case ${requirement.useCase?.id || "none"}.`,
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Requirement with ID ${requirementId} not found`);
      }
      throw error;
    }
  }

  /**
   * Retrieves an activity by its ID, throwing an exception if not found
   * @param id - ID of the activity to find
   * @returns Promise resolving to the activity
   * @throws NotFoundException if the activity doesn't exist
   */
  async findById(id: string): Promise<Activity> {
    const activity = await this.activityRepository.getById(id);
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    return activity;
  }

  /**
   * Retrieves all activities for a specific requirement
   * @param requirementId - ID of the requirement
   * @returns Promise resolving to an array of activities
   * @throws BadRequestException if the requirement doesn't exist
   */
  async listByRequirement(requirementId: string): Promise<Activity[]> {
    try {
      await this.requirementService.findById(requirementId);
      return this.activityRepository.getByRequirement(requirementId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Requirement with ID ${requirementId} not found`);
      }
      throw error;
    }
  }

  /**
   * Retrieves all activities for a specific use case
   * @param useCaseId - ID of the use case (can be Primary or Secondary)
   * @returns Promise resolving to an array of activities
   * @throws BadRequestException if the use case doesn't exist
   */
  async listByUseCase(useCaseId: string): Promise<Activity[]> {
    try {
      await this.useCaseService.findById(useCaseId);
      return this.activityRepository.getByUseCase(useCaseId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Use case with ID ${useCaseId} not found`);
      }
      throw error;
    }
  }

  /**
   * Removes an activity
   * @param id - ID of the activity to remove
   * @returns Promise resolving to a boolean indicating success
   * @throws NotFoundException if the activity doesn't exist
   */
  async remove(id: string): Promise<boolean> {
    const activity = await this.findById(id);
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    return this.activityRepository.delete(id);
  }

  /**
   * Retrieves all activities
   * @returns Promise resolving to an array of all activities
   */
  async listAll(): Promise<Activity[]> {
    return this.activityRepository.getAll();
  }
}
