import { Injectable, NotFoundException } from "@nestjs/common";
import { Op } from "@repo/custom-neogma";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { Activity } from "../entities/activity.entity";
import { CreateActivityInterface } from "../interfaces/create-activity.interface";
import { UpdateActivityInterface } from "../interfaces/update-activity.interface";
import { ActivityModel, ActivityModelType } from "../models/activity.model";
import { RequirementListDto } from "@repo/shared-schemas";

@Injectable()
export class ActivityRepository {
  private activityModel: ActivityModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.activityModel = ActivityModel(this.neo4jService.getNeogma());
  }

  /**
   * Creates a new activity with the provided data.
   * @param createDto - The data needed to create the activity
   * @returns A promise resolving to the created activity entity
   */
  async create(createDto: CreateActivityInterface): Promise<Activity> {
    try {
      const activityData: any = {
        name: createDto.name,
        requirementUpdated: false,
        requirementDeleted: false,
        requirementId: createDto.requirementId,
        useCaseId: createDto.useCaseId,
        useCase: {
          // Add useCase relationship
          where: [{ params: { id: createDto.useCaseId } }],
        },
      };

      // Add requirement relationship if provided
      if (createDto.requirementId) {
        activityData.requirement = {
          where: [{ params: { id: createDto.requirementId } }],
        };
      }

      const activity = await this.activityModel.createOne(activityData);

      return activity;
    } catch (error) {
      throw new Error(`Failed to create activity: ${error.message}`);
    }
  }

  /**
   * Updates an existing activity with the provided data.
   * @param id - The ID of the activity to update
   * @param updateDto - The data to update the activity with
   * @returns A promise resolving to the updated activity entity
   */
  async update(id: string, updateDto: UpdateActivityInterface): Promise<Activity> {
    try {
      await this.activityModel.updateOneOrThrow(updateDto, {
        where: { id },
      });

      // Get the updated entity with its relationships
      const updatedActivity = await this.activityModel.findOneWithRelations({
        where: { id },
        include: ["requirement", "useCase"], // Include relationships
      });

      if (!updatedActivity) {
        throw new NotFoundException(`Activity with ID ${id} not found after update`);
      }

      return updatedActivity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update activity: ${error.message}`);
    }
  }

  /**
   * Deletes an activity by ID.
   * @param id - The ID of the activity to delete
   * @returns A promise resolving to a boolean indicating deletion success
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.activityModel.delete({
        where: { id },
        detach: true, // Detach relationships before deletion
      });

      return result > 0;
    } catch (error) {
      throw new Error(`Failed to delete activity: ${error.message}`);
    }
  }

  /**
   * Retrieves an activity by ID.
   * @param id - The ID of the activity to retrieve
   * @returns A promise resolving to the activity entity or null if not found
   */
  async getById(id: string): Promise<Activity | null> {
    try {
      const activity = await this.activityModel.findOneWithRelations({
        where: { id },
        include: ["requirement", "useCase"], // Include both relationships
      });

      return activity ? activity : null;
    } catch (error) {
      throw new Error(`Failed to retrieve activity: ${error.message}`);
    }
  }

  // In ActivityRepository - add this method
  /**
   * Retrieves the related requirement for an activity
   * Returns null if requirement has been deleted or doesn't exist
   * @param activityId - The ID of the activity
   * @returns A promise resolving to the requirement or null
   */
  async getRelatedRequirement(activityId: string): Promise<RequirementListDto | null> {
    try {
      const activity = await this.activityModel.findOneWithRelations({
        where: { id: activityId },
        include: ["requirement"],
      });

      if (!activity) {
        throw new NotFoundException(`Activity with ID ${activityId} not found`);
      }

      return (activity.requirement as RequirementListDto) || null;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to retrieve related requirement: ${error.message}`);
    }
  }

  /**
   * Retrieves all activities.
   * @returns A promise resolving to an array of activity entities
   */
  async getAll(): Promise<Activity[]> {
    try {
      const activities = await this.activityModel.findManyWithRelations({
        include: ["requirement", "useCase"], // Include relationships
      });

      return activities;
    } catch (error) {
      throw new Error(`Failed to retrieve all activities: ${error.message}`);
    }
  }

  /**
   * Retrieves all activities for a specific requirement.
   * @param requirementId - The ID of the requirement
   * @returns A promise resolving to an array of activity entities
   */
  async getByRequirement(requirementId: string): Promise<Activity[]> {
    try {
      const activities = await this.activityModel.findByRelatedEntity({
        whereRelated: { id: requirementId },
        relationshipAlias: "requirement",
      });

      const activityIds = activities.map((activity) => activity.id);

      const activitiesWithRelationships = await this.activityModel.findManyWithRelations({
        where: { id: { [Op.in]: activityIds } },
        include: ["requirement", "useCase"], // Include relationships
      });

      return activitiesWithRelationships;
    } catch (error) {
      throw new Error(`Failed to retrieve activities for requirement: ${error.message}`);
    }
  }

  /**
   * Retrieves all activities for a specific use case.
   * @param useCaseId - The ID of the use case
   * @returns A promise resolving to an array of activity entities
   */
  async getByUseCase(useCaseId: string): Promise<Activity[]> {
    try {
      const activities = await this.activityModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      const activityIds = activities.map((activity) => activity.id);

      const activitiesWithRelationships = await this.activityModel.findManyWithRelations({
        where: { id: { [Op.in]: activityIds } },
        include: ["requirement", "useCase"], // Include relationships
      });

      return activitiesWithRelationships;
    } catch (error) {
      throw new Error(`Failed to retrieve activities for use case: ${error.message}`);
    }
  }
}
