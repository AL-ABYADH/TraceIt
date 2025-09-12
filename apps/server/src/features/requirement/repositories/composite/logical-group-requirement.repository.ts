import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { Op } from "@repo/custom-neogma";
import {
  LogicalGroupRequirementModel,
  LogicalGroupRequirementModelType,
} from "../../models/composite/logical-group-requirement.model";
import { LogicalGroupRequirement } from "../../entities/composite/logical-group-requirement.entity";
import { CreateLogicalGroupRequirementInterface } from "../../interfaces/create-requirement.interface";
import { UpdateLogicalGroupRequirementInterface } from "../../interfaces/update-requirement.interface";
import { RequirementRepositoryInterface } from "../../interfaces/requirement-repository.interface";

@Injectable()
export class LogicalGroupRequirementRepository
  implements RequirementRepositoryInterface<LogicalGroupRequirement>
{
  private logicalGroupRequirementModel: LogicalGroupRequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.logicalGroupRequirementModel = LogicalGroupRequirementModel(this.neo4jService.getNeogma());
  }

  async create(
    createDto: CreateLogicalGroupRequirementInterface,
  ): Promise<LogicalGroupRequirement> {
    try {
      const requirement = await this.logicalGroupRequirementModel.createOne({
        depth: createDto.depth,
        useCase: {
          where: [{ params: { id: createDto.useCaseId } }],
        },
        project: {
          where: [{ params: { id: createDto.projectId } }],
        },
        mainRequirement: {
          where: [{ params: { id: createDto.mainRequirementId } }],
        },
      });

      // Add detail requirements
      for (const detailRequirementId of createDto.detailRequirementIds) {
        await this.logicalGroupRequirementModel.relateTo({
          alias: "detailRequirements",
          where: {
            source: { id: requirement.id },
            target: { id: detailRequirementId },
          },
        });
      }

      // Add to subRequirements (inherited from CompositeRequirement)
      for (const detailRequirementId of createDto.detailRequirementIds) {
        await this.logicalGroupRequirementModel.relateTo({
          alias: "subRequirements",
          where: {
            source: { id: requirement.id },
            target: { id: detailRequirementId },
          },
        });
      }

      // Get the created requirement with its relationships
      const createdRequirement = await this.logicalGroupRequirementModel.findOneWithRelations({
        where: { id: requirement.id },
        include: ["mainRequirement", "detailRequirements"],
      });

      return createdRequirement ?? requirement;
    } catch (error) {
      throw new Error(`Failed to create logical group requirement: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateDto: UpdateLogicalGroupRequirementInterface,
  ): Promise<LogicalGroupRequirement[]> {
    try {
      // Create an object with only the fields to update
      const updateFields: Record<string, any> = {};
      if (updateDto.depth !== undefined) updateFields.depth = updateDto.depth;

      // Update the requirement
      const updated = await this.logicalGroupRequirementModel.update(updateFields, {
        where: { id },
      });

      if (!updated || updated.length === 0) {
        throw new NotFoundException(`Logical group requirement with ID ${id} not found`);
      }

      // Update the main requirement relationship if provided
      if (updateDto.mainRequirementId) {
        await this.logicalGroupRequirementModel.deleteRelationships({
          alias: "mainRequirement",
          where: {
            source: { id },
          },
        });

        await this.logicalGroupRequirementModel.relateTo({
          alias: "mainRequirement",
          where: {
            source: { id },
            target: { id: updateDto.mainRequirementId },
          },
        });
      }

      // Update the detail requirements relationships if provided
      if (updateDto.detailRequirementIds && updateDto.detailRequirementIds.length > 0) {
        // Delete existing detail requirements relationships
        await this.logicalGroupRequirementModel.deleteRelationships({
          alias: "detailRequirements",
          where: {
            source: { id },
          },
        });

        // Delete existing subRequirements relationships
        await this.logicalGroupRequirementModel.deleteRelationships({
          alias: "subRequirements",
          where: {
            source: { id },
          },
        });

        // Create new detail requirements relationships
        for (const detailRequirementId of updateDto.detailRequirementIds) {
          await this.logicalGroupRequirementModel.relateTo({
            alias: "detailRequirements",
            where: {
              source: { id },
              target: { id: detailRequirementId },
            },
          });

          // Also update subRequirements (inherited from CompositeRequirement)
          await this.logicalGroupRequirementModel.relateTo({
            alias: "subRequirements",
            where: {
              source: { id },
              target: { id: detailRequirementId },
            },
          });
        }
      }

      // Get the updated requirement with its relationships
      const updatedRequirement = await this.logicalGroupRequirementModel.findOneWithRelations({
        where: { id },
        include: ["mainRequirement", "detailRequirements"],
      });

      return updatedRequirement ? [updatedRequirement] : [];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update logical group requirement: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.logicalGroupRequirementModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete logical group requirement: ${error.message}`);
    }
  }

  async getById(id: string): Promise<LogicalGroupRequirement | null> {
    try {
      const requirement = await this.logicalGroupRequirementModel.findOneWithRelations({
        where: { id },
        include: ["mainRequirement", "detailRequirements"],
      });

      return requirement ?? null;
    } catch (error) {
      throw new Error(`Failed to retrieve logical group requirement: ${error.message}`);
    }
  }

  async getAll(): Promise<LogicalGroupRequirement[]> {
    try {
      const requirements = await this.logicalGroupRequirementModel.findManyWithRelations({
        include: ["mainRequirement", "detailRequirements"],
      });
      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve all logical group requirements: ${error.message}`);
    }
  }

  async getByUseCase(useCaseId: string): Promise<LogicalGroupRequirement[]> {
    try {
      const requirements = await this.logicalGroupRequirementModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      return requirements;
    } catch (error) {
      throw new Error(
        `Failed to retrieve logical group requirements for use case: ${error.message}`,
      );
    }
  }

  async getByProject(projectId: string): Promise<LogicalGroupRequirement[]> {
    try {
      const requirements = await this.logicalGroupRequirementModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
      });

      return requirements;
    } catch (error) {
      throw new Error(
        `Failed to retrieve logical group requirements for project: ${error.message}`,
      );
    }
  }
}
