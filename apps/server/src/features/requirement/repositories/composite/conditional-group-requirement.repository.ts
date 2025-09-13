import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import {
  ConditionalGroupRequirementModel,
  ConditionalGroupRequirementModelType,
} from "../../models";
import { ConditionalGroupRequirement } from "../../entities";
import { CreateConditionalGroupRequirementInterface } from "../../interfaces/create-requirement.interface";
import { UpdateConditionalGroupRequirementInterface } from "../../interfaces/update-requirement.interface";
import { RequirementRepositoryInterface } from "../../interfaces/requirement-repository.interface";

@Injectable()
export class ConditionalGroupRequirementRepository
  implements RequirementRepositoryInterface<ConditionalGroupRequirement>
{
  private conditionalGroupRequirementModel: ConditionalGroupRequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.conditionalGroupRequirementModel = ConditionalGroupRequirementModel(
      this.neo4jService.getNeogma(),
    );
  }

  async create(
    createDto: CreateConditionalGroupRequirementInterface,
  ): Promise<ConditionalGroupRequirement> {
    try {
      const requirement = await this.conditionalGroupRequirementModel.createOne({
        depth: createDto.depth,
        conditionalValue: createDto.conditionalValue,
        useCase: {
          where: [{ params: { id: createDto.useCaseId } }],
        },
        project: {
          where: [{ params: { id: createDto.projectId } }],
        },
        primaryCondition: {
          where: [{ params: { id: createDto.primaryConditionId } }],
        },
      });

      // Add alternative conditions
      for (const alternativeConditionId of createDto.alternativeConditionIds) {
        await this.conditionalGroupRequirementModel.relateTo({
          alias: "alternativeConditions",
          where: {
            source: { id: requirement.id },
            target: { id: alternativeConditionId },
          },
        });
      }

      // Add fallback condition if provided
      if (createDto.fallbackConditionId) {
        await this.conditionalGroupRequirementModel.relateTo({
          alias: "fallbackCondition",
          where: {
            source: { id: requirement.id },
            target: { id: createDto.fallbackConditionId },
          },
        });
      }

      // Add to subRequirements (inherited from CompositeRequirement)
      // Add primary condition
      await this.conditionalGroupRequirementModel.relateTo({
        alias: "subRequirements",
        where: {
          source: { id: requirement.id },
          target: { id: createDto.primaryConditionId },
        },
      });

      // Add alternative conditions to subRequirements
      for (const alternativeConditionId of createDto.alternativeConditionIds) {
        await this.conditionalGroupRequirementModel.relateTo({
          alias: "subRequirements",
          where: {
            source: { id: requirement.id },
            target: { id: alternativeConditionId },
          },
        });
      }

      // Add fallback condition to subRequirements if provided
      if (createDto.fallbackConditionId) {
        await this.conditionalGroupRequirementModel.relateTo({
          alias: "subRequirements",
          where: {
            source: { id: requirement.id },
            target: { id: createDto.fallbackConditionId },
          },
        });
      }

      // Get the created requirement with its relationships
      const createdRequirement = await this.conditionalGroupRequirementModel.findOneWithRelations({
        where: { id: requirement.id },
        include: ["primaryCondition", "alternativeConditions", "fallbackCondition"],
      });

      return createdRequirement ?? requirement;
    } catch (error) {
      throw new Error(`Failed to create conditional group requirement: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateDto: UpdateConditionalGroupRequirementInterface,
  ): Promise<ConditionalGroupRequirement[]> {
    try {
      // Create an object with only the fields to update
      const updateFields: Record<string, any> = {};
      if (updateDto.depth !== undefined) updateFields.depth = updateDto.depth;
      if (updateDto.conditionalValue !== undefined)
        updateFields.conditionalValue = updateDto.conditionalValue;

      // Update the requirement
      const updated = await this.conditionalGroupRequirementModel.update(updateFields, {
        where: { id },
      });

      if (!updated || updated.length === 0) {
        throw new NotFoundException(`Conditional group requirement with ID ${id} not found`);
      }

      // Update the primary condition relationship if provided
      if (updateDto.primaryConditionId) {
        await this.conditionalGroupRequirementModel.deleteRelationships({
          alias: "primaryCondition",
          where: {
            source: { id },
          },
        });

        await this.conditionalGroupRequirementModel.relateTo({
          alias: "primaryCondition",
          where: {
            source: { id },
            target: { id: updateDto.primaryConditionId },
          },
        });
      }

      // Update the alternative conditions relationships if provided
      if (updateDto.alternativeConditionIds && updateDto.alternativeConditionIds.length > 0) {
        // Delete existing alternative conditions relationships
        await this.conditionalGroupRequirementModel.deleteRelationships({
          alias: "alternativeConditions",
          where: {
            source: { id },
          },
        });

        // Create new alternative conditions relationships
        for (const alternativeConditionId of updateDto.alternativeConditionIds) {
          await this.conditionalGroupRequirementModel.relateTo({
            alias: "alternativeConditions",
            where: {
              source: { id },
              target: { id: alternativeConditionId },
            },
          });
        }
      }

      // Update the fallback condition relationship if provided
      if (updateDto.fallbackConditionId !== undefined) {
        // Delete existing fallback condition relationship
        await this.conditionalGroupRequirementModel.deleteRelationships({
          alias: "fallbackCondition",
          where: {
            source: { id },
          },
        });

        // Create new fallback condition relationship if a new ID is provided
        if (updateDto.fallbackConditionId) {
          await this.conditionalGroupRequirementModel.relateTo({
            alias: "fallbackCondition",
            where: {
              source: { id },
              target: { id: updateDto.fallbackConditionId },
            },
          });
        }
      }

      // Update subRequirements (inherited from CompositeRequirement)
      // First delete all existing subRequirements
      await this.conditionalGroupRequirementModel.deleteRelationships({
        alias: "subRequirements",
        where: {
          source: { id },
        },
      });

      // Add primary condition to subRequirements
      if (updateDto.primaryConditionId) {
        await this.conditionalGroupRequirementModel.relateTo({
          alias: "subRequirements",
          where: {
            source: { id },
            target: { id: updateDto.primaryConditionId },
          },
        });
      }

      // Add alternative conditions to subRequirements
      if (updateDto.alternativeConditionIds && updateDto.alternativeConditionIds.length > 0) {
        for (const alternativeConditionId of updateDto.alternativeConditionIds) {
          await this.conditionalGroupRequirementModel.relateTo({
            alias: "subRequirements",
            where: {
              source: { id },
              target: { id: alternativeConditionId },
            },
          });
        }
      }

      // Add fallback condition to subRequirements if provided
      if (updateDto.fallbackConditionId) {
        await this.conditionalGroupRequirementModel.relateTo({
          alias: "subRequirements",
          where: {
            source: { id },
            target: { id: updateDto.fallbackConditionId },
          },
        });
      }

      // Get the updated requirement with its relationships
      const updatedRequirement = await this.conditionalGroupRequirementModel.findOneWithRelations({
        where: { id },
        include: ["primaryCondition", "alternativeConditions", "fallbackCondition"],
      });

      return updatedRequirement ? [updatedRequirement] : [];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update conditional group requirement: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.conditionalGroupRequirementModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete conditional group requirement: ${error.message}`);
    }
  }

  async getById(id: string): Promise<ConditionalGroupRequirement | null> {
    try {
      const requirement = await this.conditionalGroupRequirementModel.findOneWithRelations({
        where: { id },
        include: ["primaryCondition", "alternativeConditions", "fallbackCondition"],
      });

      return requirement ?? null;
    } catch (error) {
      throw new Error(`Failed to retrieve conditional group requirement: ${error.message}`);
    }
  }

  async getAll(): Promise<ConditionalGroupRequirement[]> {
    try {
      const requirements = await this.conditionalGroupRequirementModel.findManyWithRelations({
        include: ["primaryCondition", "alternativeConditions", "fallbackCondition"],
      });
      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve all conditional group requirements: ${error.message}`);
    }
  }

  async getByUseCase(useCaseId: string): Promise<ConditionalGroupRequirement[]> {
    try {
      const requirements = await this.conditionalGroupRequirementModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      return requirements;
    } catch (error) {
      throw new Error(
        `Failed to retrieve conditional group requirements for use case: ${error.message}`,
      );
    }
  }

  async getByProject(projectId: string): Promise<ConditionalGroupRequirement[]> {
    try {
      const requirements = await this.conditionalGroupRequirementModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
      });

      return requirements;
    } catch (error) {
      throw new Error(
        `Failed to retrieve conditional group requirements for project: ${error.message}`,
      );
    }
  }
}
