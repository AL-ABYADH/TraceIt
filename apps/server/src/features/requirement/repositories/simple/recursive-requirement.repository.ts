import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import {
  RecursiveRequirementModel,
  RecursiveRequirementModelType,
} from "../../models/simple/recursive-requirement.model";
import { RecursiveRequirement } from "../../entities/simple/recursive-requirement.entity";
import { CreateRecursiveRequirementInterface } from "../../interfaces/create-requirement.interface";
import { UpdateRecursiveRequirementInterface } from "../../interfaces/update-requirement.interface";
import { RequirementRepositoryInterface } from "../../interfaces/requirement-repository.interface";

@Injectable()
export class RecursiveRequirementRepository
  implements RequirementRepositoryInterface<RecursiveRequirement>
{
  private recursiveRequirementModel: RecursiveRequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.recursiveRequirementModel = RecursiveRequirementModel(this.neo4jService.getNeogma());
  }

  async create(createDto: CreateRecursiveRequirementInterface): Promise<RecursiveRequirement> {
    try {
      const requirement = await this.recursiveRequirementModel.createOne({
        depth: createDto.depth,
        useCase: {
          where: [{ params: { id: createDto.useCaseId } }],
        },
        project: {
          where: [{ params: { id: createDto.projectId } }],
        },
        requirement: {
          where: [{ params: { id: createDto.requirementId } }],
        },
      });

      return requirement;
    } catch (error) {
      throw new Error(`Failed to create recursive requirement: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateDto: UpdateRecursiveRequirementInterface,
  ): Promise<RecursiveRequirement[]> {
    try {
      // Create an object with only the fields to update
      const updateFields: Record<string, any> = {};
      if (updateDto.depth !== undefined) updateFields.depth = updateDto.depth;

      // Update the requirement
      const updated = await this.recursiveRequirementModel.update(updateFields, {
        where: { id },
      });

      if (!updated || updated.length === 0) {
        throw new NotFoundException(`Recursive requirement with ID ${id} not found`);
      }

      // Update the requirement relationship if provided
      if (updateDto.requirementId) {
        await this.recursiveRequirementModel.deleteRelationships({
          alias: "requirement",
          where: {
            source: { id },
          },
        });

        await this.recursiveRequirementModel.relateTo({
          alias: "requirement",
          where: {
            source: { id },
            target: { id: updateDto.requirementId },
          },
        });
      }

      // Get the updated requirement with its relationships
      const updatedRequirement = await this.recursiveRequirementModel.findOneWithRelations({
        where: { id },
        include: ["requirement"],
      });

      return updatedRequirement ? [updatedRequirement] : [];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update recursive requirement: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.recursiveRequirementModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete recursive requirement: ${error.message}`);
    }
  }

  async getById(id: string): Promise<RecursiveRequirement | null> {
    try {
      const requirement = await this.recursiveRequirementModel.findOneWithRelations({
        where: { id },
        include: ["requirement"],
      });

      return requirement ?? null;
    } catch (error) {
      throw new Error(`Failed to retrieve recursive requirement: ${error.message}`);
    }
  }

  async getAll(): Promise<RecursiveRequirement[]> {
    try {
      const requirements = await this.recursiveRequirementModel.findManyWithRelations({
        include: ["requirement"],
      });
      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve all recursive requirements: ${error.message}`);
    }
  }

  async getByUseCase(useCaseId: string): Promise<RecursiveRequirement[]> {
    try {
      const requirements = await this.recursiveRequirementModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve recursive requirements for use case: ${error.message}`);
    }
  }

  async getByProject(projectId: string): Promise<RecursiveRequirement[]> {
    try {
      const requirements = await this.recursiveRequirementModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve recursive requirements for project: ${error.message}`);
    }
  }
}
