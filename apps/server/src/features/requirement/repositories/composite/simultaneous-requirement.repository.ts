import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { SimultaneousRequirementModel, SimultaneousRequirementModelType } from "../../models";
import { SimultaneousRequirement } from "../../entities";
import { CreateSimultaneousRequirementInterface } from "../../interfaces/create-requirement.interface";
import { UpdateSimultaneousRequirementInterface } from "../../interfaces/update-requirement.interface";
import { RequirementRepositoryInterface } from "../../interfaces/requirement-repository.interface";

@Injectable()
export class SimultaneousRequirementRepository
  implements RequirementRepositoryInterface<SimultaneousRequirement>
{
  private simultaneousRequirementModel: SimultaneousRequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.simultaneousRequirementModel = SimultaneousRequirementModel(this.neo4jService.getNeogma());
  }

  async create(
    createDto: CreateSimultaneousRequirementInterface,
  ): Promise<SimultaneousRequirement> {
    try {
      const requirement = await this.simultaneousRequirementModel.createOne({
        depth: createDto.depth,
        useCase: {
          where: [{ params: { id: createDto.useCaseId } }],
        },
        project: {
          where: [{ params: { id: createDto.projectId } }],
        },
      });

      // Add simple requirements
      for (const simpleRequirementId of createDto.simpleRequirementIds) {
        await this.simultaneousRequirementModel.relateTo({
          alias: "simpleRequirements",
          where: {
            source: { id: requirement.id },
            target: { id: simpleRequirementId },
          },
        });
      }

      // Add to subRequirements (inherited from CompositeRequirement)
      for (const simpleRequirementId of createDto.simpleRequirementIds) {
        await this.simultaneousRequirementModel.relateTo({
          alias: "subRequirements",
          where: {
            source: { id: requirement.id },
            target: { id: simpleRequirementId },
          },
        });
      }

      // Get the created requirement with its relationships
      const createdRequirement = await this.simultaneousRequirementModel.findOneWithRelations({
        where: { id: requirement.id },
        include: ["simpleRequirements"],
      });

      return createdRequirement ?? requirement;
    } catch (error) {
      throw new Error(`Failed to create simultaneous requirement: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateDto: UpdateSimultaneousRequirementInterface,
  ): Promise<SimultaneousRequirement[]> {
    try {
      // Create an object with only the fields to update
      const updateFields: Record<string, any> = {};
      if (updateDto.depth !== undefined) updateFields.depth = updateDto.depth;

      // Update the requirement
      const updated = await this.simultaneousRequirementModel.update(updateFields, {
        where: { id },
      });

      if (!updated || updated.length === 0) {
        throw new NotFoundException(`Simultaneous requirement with ID ${id} not found`);
      }

      // Update the simple requirements relationships if provided
      if (updateDto.simpleRequirementIds && updateDto.simpleRequirementIds.length > 0) {
        // Delete existing simple requirements relationships
        await this.simultaneousRequirementModel.deleteRelationships({
          alias: "simpleRequirements",
          where: {
            source: { id },
          },
        });

        // Delete existing subRequirements relationships
        await this.simultaneousRequirementModel.deleteRelationships({
          alias: "subRequirements",
          where: {
            source: { id },
          },
        });

        // Create new simple requirements relationships
        for (const simpleRequirementId of updateDto.simpleRequirementIds) {
          await this.simultaneousRequirementModel.relateTo({
            alias: "simpleRequirements",
            where: {
              source: { id },
              target: { id: simpleRequirementId },
            },
          });

          // Also update subRequirements (inherited from CompositeRequirement)
          await this.simultaneousRequirementModel.relateTo({
            alias: "subRequirements",
            where: {
              source: { id },
              target: { id: simpleRequirementId },
            },
          });
        }
      }

      // Get the updated requirement with its relationships
      const updatedRequirement = await this.simultaneousRequirementModel.findOneWithRelations({
        where: { id },
        include: ["simpleRequirements"],
      });

      return updatedRequirement ? [updatedRequirement] : [];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update simultaneous requirement: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.simultaneousRequirementModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete simultaneous requirement: ${error.message}`);
    }
  }

  async getById(id: string): Promise<SimultaneousRequirement | null> {
    try {
      const requirement = await this.simultaneousRequirementModel.findOneWithRelations({
        where: { id },
        include: ["simpleRequirements"],
      });

      return requirement ?? null;
    } catch (error) {
      throw new Error(`Failed to retrieve simultaneous requirement: ${error.message}`);
    }
  }

  async getAll(): Promise<SimultaneousRequirement[]> {
    try {
      const requirements = await this.simultaneousRequirementModel.findManyWithRelations({
        include: ["simpleRequirements"],
      });
      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve all simultaneous requirements: ${error.message}`);
    }
  }

  async getByUseCase(useCaseId: string): Promise<SimultaneousRequirement[]> {
    try {
      const requirements = await this.simultaneousRequirementModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      return requirements;
    } catch (error) {
      throw new Error(
        `Failed to retrieve simultaneous requirements for use case: ${error.message}`,
      );
    }
  }

  async getByProject(projectId: string): Promise<SimultaneousRequirement[]> {
    try {
      const requirements = await this.simultaneousRequirementModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve simultaneous requirements for project: ${error.message}`);
    }
  }
}
