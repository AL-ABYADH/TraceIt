import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { Op } from "@repo/custom-neogma";
import {
  ExceptionalRequirementModel,
  ExceptionalRequirementModelType,
} from "../../models/composite/exceptional-requirement.model";
import { ExceptionalRequirement } from "../../entities/composite/exceptional-requirement.entity";
import { CreateExceptionalRequirementInterface } from "../../interfaces/create-requirement.interface";
import { UpdateExceptionalRequirementInterface } from "../../interfaces/update-requirement.interface";
import { RequirementRepositoryInterface } from "../../interfaces/requirement-repository.interface";

@Injectable()
export class ExceptionalRequirementRepository
  implements RequirementRepositoryInterface<ExceptionalRequirement>
{
  private exceptionalRequirementModel: ExceptionalRequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.exceptionalRequirementModel = ExceptionalRequirementModel(this.neo4jService.getNeogma());
  }

  async create(createDto: CreateExceptionalRequirementInterface): Promise<ExceptionalRequirement> {
    try {
      const requirement = await this.exceptionalRequirementModel.createOne({
        depth: createDto.depth,
        exception: createDto.exception,
        useCase: {
          where: [{ params: { id: createDto.useCaseId } }],
        },
        project: {
          where: [{ params: { id: createDto.projectId } }],
        },
      });

      // Add requirements for exception handling
      for (const requirementId of createDto.requirementIds) {
        await this.exceptionalRequirementModel.relateTo({
          alias: "requirements",
          where: {
            source: { id: requirement.id },
            target: { id: requirementId },
          },
        });
      }

      // Add to subRequirements (inherited from CompositeRequirement)
      for (const requirementId of createDto.requirementIds) {
        await this.exceptionalRequirementModel.relateTo({
          alias: "subRequirements",
          where: {
            source: { id: requirement.id },
            target: { id: requirementId },
          },
        });
      }

      // Get the created requirement with its relationships
      const createdRequirement = await this.exceptionalRequirementModel.findOneWithRelations({
        where: { id: requirement.id },
        include: ["requirements"],
      });

      return createdRequirement ?? requirement;
    } catch (error) {
      throw new Error(`Failed to create exceptional requirement: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateDto: UpdateExceptionalRequirementInterface,
  ): Promise<ExceptionalRequirement[]> {
    try {
      // Create an object with only the fields to update
      const updateFields: Record<string, any> = {};
      if (updateDto.depth !== undefined) updateFields.depth = updateDto.depth;
      if (updateDto.exception !== undefined) updateFields.exception = updateDto.exception;

      // Update the requirement
      const updated = await this.exceptionalRequirementModel.update(updateFields, {
        where: { id },
      });

      if (!updated || updated.length === 0) {
        throw new NotFoundException(`Exceptional requirement with ID ${id} not found`);
      }

      // Update the requirements relationships if provided
      if (updateDto.requirementIds && updateDto.requirementIds.length > 0) {
        // Delete existing requirements relationships
        await this.exceptionalRequirementModel.deleteRelationships({
          alias: "requirements",
          where: {
            source: { id },
          },
        });

        // Delete existing subRequirements relationships
        await this.exceptionalRequirementModel.deleteRelationships({
          alias: "subRequirements",
          where: {
            source: { id },
          },
        });

        // Create new requirements relationships
        for (const requirementId of updateDto.requirementIds) {
          await this.exceptionalRequirementModel.relateTo({
            alias: "requirements",
            where: {
              source: { id },
              target: { id: requirementId },
            },
          });

          // Also update subRequirements (inherited from CompositeRequirement)
          await this.exceptionalRequirementModel.relateTo({
            alias: "subRequirements",
            where: {
              source: { id },
              target: { id: requirementId },
            },
          });
        }
      }

      // Get the updated requirement with its relationships
      const updatedRequirement = await this.exceptionalRequirementModel.findOneWithRelations({
        where: { id },
        include: ["requirements"],
      });

      return updatedRequirement ? [updatedRequirement] : [];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update exceptional requirement: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.exceptionalRequirementModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete exceptional requirement: ${error.message}`);
    }
  }

  async getById(id: string): Promise<ExceptionalRequirement | null> {
    try {
      const requirement = await this.exceptionalRequirementModel.findOneWithRelations({
        where: { id },
        include: ["requirements"],
      });

      return requirement ?? null;
    } catch (error) {
      throw new Error(`Failed to retrieve exceptional requirement: ${error.message}`);
    }
  }

  async getAll(): Promise<ExceptionalRequirement[]> {
    try {
      const requirements = await this.exceptionalRequirementModel.findManyWithRelations({
        include: ["requirements"],
      });
      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve all exceptional requirements: ${error.message}`);
    }
  }

  async getByUseCase(useCaseId: string): Promise<ExceptionalRequirement[]> {
    try {
      const requirements = await this.exceptionalRequirementModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve exceptional requirements for use case: ${error.message}`);
    }
  }

  async getByProject(projectId: string): Promise<ExceptionalRequirement[]> {
    try {
      const requirements = await this.exceptionalRequirementModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve exceptional requirements for project: ${error.message}`);
    }
  }
}
