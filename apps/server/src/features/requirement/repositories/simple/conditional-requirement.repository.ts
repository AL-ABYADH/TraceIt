import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { ConditionalRequirementModel, ConditionalRequirementModelType } from "../../models";
import { ConditionalRequirement } from "../../entities";
import { CreateConditionalRequirementInterface } from "../../interfaces/create-requirement.interface";
import { UpdateConditionalRequirementInterface } from "../../interfaces/update-requirement.interface";
import { RequirementRepositoryInterface } from "../../interfaces/requirement-repository.interface";

@Injectable()
export class ConditionalRequirementRepository
  implements RequirementRepositoryInterface<ConditionalRequirement>
{
  private conditionalRequirementModel: ConditionalRequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.conditionalRequirementModel = ConditionalRequirementModel(this.neo4jService.getNeogma());
  }

  async create(createDto: CreateConditionalRequirementInterface): Promise<ConditionalRequirement> {
    try {
      const requirement = await this.conditionalRequirementModel.createOne({
        depth: createDto.depth,
        condition: createDto.condition,
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
      throw new Error(`Failed to create conditional requirement: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateDto: UpdateConditionalRequirementInterface,
  ): Promise<ConditionalRequirement> {
    try {
      // Create an object with only the fields to update
      const updateFields: Record<string, any> = {};
      if (updateDto.depth !== undefined) updateFields.depth = updateDto.depth;
      if (updateDto.condition !== undefined) updateFields.condition = updateDto.condition;

      // Update the requirement
      const updated = await this.conditionalRequirementModel.updateOneOrThrow(updateFields, {
        where: { id },
      });

      if (!updated) {
        throw new NotFoundException(`Conditional requirement with ID ${id} not found`);
      }

      // Update the requirement relationship if provided
      if (updateDto.requirementId) {
        await this.conditionalRequirementModel.deleteRelationships({
          alias: "requirement",
          where: {
            source: { id },
          },
        });

        await this.conditionalRequirementModel.relateTo({
          alias: "requirement",
          where: {
            source: { id },
            target: { id: updateDto.requirementId },
          },
        });
      }

      // Get the updated requirement with its relationships
      const updatedRequirement = await this.conditionalRequirementModel.findOneWithRelations({
        where: { id },
        include: ["requirement"],
      });
      if (!updatedRequirement) {
        throw new NotFoundException(`Requirement with ${id} not found!`);
      }

      return updatedRequirement;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update conditional requirement: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.conditionalRequirementModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete conditional requirement: ${error.message}`);
    }
  }

  async getById(id: string): Promise<ConditionalRequirement | null> {
    try {
      const requirement = await this.conditionalRequirementModel.findOneWithRelations({
        where: { id },
        include: ["requirement"],
      });

      return requirement ?? null;
    } catch (error) {
      throw new Error(`Failed to retrieve conditional requirement: ${error.message}`);
    }
  }

  async getAll(): Promise<ConditionalRequirement[]> {
    try {
      const requirements = await this.conditionalRequirementModel.findManyWithRelations({
        include: ["requirement"],
      });
      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve all conditional requirements: ${error.message}`);
    }
  }

  async getByUseCase(useCaseId: string): Promise<ConditionalRequirement[]> {
    try {
      const requirements = await this.conditionalRequirementModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve conditional requirements for use case: ${error.message}`);
    }
  }

  async getByProject(projectId: string): Promise<ConditionalRequirement[]> {
    try {
      const requirements = await this.conditionalRequirementModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve conditional requirements for project: ${error.message}`);
    }
  }
}
