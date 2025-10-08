import { Injectable, NotFoundException } from "@nestjs/common";
import { Op } from "@repo/custom-neogma";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { Condition } from "../entities/condition.entity";
import { CreateConditionInterface } from "../interfaces/create-condition.interface";
import { UpdateConditionInterface } from "../interfaces/update-condition.interface";
import { ConditionModel, ConditionModelType } from "../models/condition.model";
import { RequirementListDto } from "@repo/shared-schemas";

@Injectable()
export class ConditionRepository {
  private conditionModel: ConditionModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.conditionModel = ConditionModel(this.neo4jService.getNeogma());
  }

  // In ConditionRepository - add this method
  /**
   * Retrieves the related requirement for a condition
   * Returns null if requirement has been deleted or doesn't exist
   * @param conditionId - The ID of the condition
   * @returns A promise resolving to the requirement or null
   */
  async getRelatedRequirement(conditionId: string): Promise<RequirementListDto | null> {
    try {
      const condition = await this.conditionModel.findOneWithRelations({
        where: { id: conditionId },
        include: ["requirement"],
      });

      if (!condition) {
        throw new NotFoundException(`Condition with ID ${conditionId} not found`);
      }

      return (condition.requirement as RequirementListDto) || null;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to retrieve related requirement: ${error.message}`);
    }
  }

  /**
   * Creates a new condition with the provided data.
   * @param createDto - The data needed to create the condition
   * @returns A promise resolving to the created condition entity
   */
  async create(createDto: CreateConditionInterface): Promise<Condition> {
    try {
      const conditionData: any = {
        name: createDto.name,
        requirementUpdated: false,
        requirementDeleted: false,
        useCase: {
          where: [{ params: { id: createDto.useCaseId } }],
        },
      };

      // Add requirement relationship if provided
      if (createDto.requirementId) {
        conditionData.requirement = {
          where: [{ params: { id: createDto.requirementId } }],
        };
      }

      const condition = await this.conditionModel.createOne(conditionData);
      return condition;
    } catch (error) {
      throw new Error(`Failed to create condition: ${error.message}`);
    }
  }

  /**
   * Updates an existing condition with the provided data.
   * @param id - The ID of the condition to update
   * @param updateDto - The data to update the condition with
   * @returns A promise resolving to the updated condition entity
   */
  async update(id: string, updateDto: UpdateConditionInterface): Promise<Condition> {
    try {
      // Update basic properties
      const updateData: Record<string, any> = {};

      if (updateDto.name !== undefined) {
        updateData.name = updateDto.name;
      }

      await this.conditionModel.updateOneOrThrow(updateData, {
        where: { id },
      });

      // Get the updated entity with its relationships
      const updatedCondition = await this.conditionModel.findOneWithRelations({
        where: { id },
        include: ["requirement", "useCase"],
      });

      if (!updatedCondition) {
        throw new NotFoundException(`Condition with ID ${id} not found after update`);
      }

      return updatedCondition;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update condition: ${error.message}`);
    }
  }

  /**
   * Deletes a condition by ID.
   * @param id - The ID of the condition to delete
   * @returns A promise resolving to a boolean indicating deletion success
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.conditionModel.delete({
        where: { id },
        detach: true,
      });

      return result > 0;
    } catch (error) {
      throw new Error(`Failed to delete condition: ${error.message}`);
    }
  }

  /**
   * Retrieves a condition by ID.
   * @param id - The ID of the condition to retrieve
   * @returns A promise resolving to the condition entity or null if not found
   */
  async getById(id: string): Promise<Condition | null> {
    try {
      const condition = await this.conditionModel.findOneWithRelations({
        where: { id },
        include: ["requirement", "useCase"],
      });

      return condition ? condition : null;
    } catch (error) {
      throw new Error(`Failed to retrieve condition: ${error.message}`);
    }
  }

  /**
   * Retrieves all conditions.
   * @returns A promise resolving to an array of condition entities
   */
  async getAll(): Promise<Condition[]> {
    try {
      const conditions = await this.conditionModel.findManyWithRelations({
        include: ["requirement", "useCase"],
      });

      return conditions;
    } catch (error) {
      throw new Error(`Failed to retrieve all conditions: ${error.message}`);
    }
  }

  /**
   * Retrieves all conditions for a specific requirement.
   * @param requirementId - The ID of the requirement
   * @returns A promise resolving to an array of condition entities
   */
  async getByRequirement(requirementId: string): Promise<Condition[]> {
    try {
      const conditions = await this.conditionModel.findByRelatedEntity({
        whereRelated: { id: requirementId },
        relationshipAlias: "requirement",
      });

      const conditionIds = conditions.map((condition) => condition.id);

      const conditionsWithRelationships = await this.conditionModel.findManyWithRelations({
        where: { id: { [Op.in]: conditionIds } },
        include: ["requirement", "useCase"],
      });

      return conditionsWithRelationships;
    } catch (error) {
      throw new Error(`Failed to retrieve conditions for requirement: ${error.message}`);
    }
  }

  /**
   * Retrieves all conditions for a specific use case.
   * @param useCaseId - The ID of the use case
   * @returns A promise resolving to an array of condition entities
   */
  async getByUseCase(useCaseId: string): Promise<Condition[]> {
    try {
      const conditions = await this.conditionModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      const conditionIds = conditions.map((condition) => condition.id);

      const conditionsWithRelationships = await this.conditionModel.findManyWithRelations({
        where: { id: { [Op.in]: conditionIds } },
        include: ["requirement", "useCase"],
      });

      return conditionsWithRelationships;
    } catch (error) {
      throw new Error(`Failed to retrieve conditions for use case: ${error.message}`);
    }
  }
}
