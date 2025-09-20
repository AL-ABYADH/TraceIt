import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { Op } from "@repo/custom-neogma";
import { ActorRequirementModel, ActorRequirementModelType } from "../../models";
import { ActorRequirement } from "../../entities";
import { CreateActorRequirementInterface } from "../../interfaces/create-requirement.interface";
import { UpdateActorRequirementInterface } from "../../interfaces/update-requirement.interface";
import { RequirementRepositoryInterface } from "../../interfaces/requirement-repository.interface";

@Injectable()
export class ActorRequirementRepository
  implements RequirementRepositoryInterface<ActorRequirement>
{
  private actorRequirementModel: ActorRequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.actorRequirementModel = ActorRequirementModel(this.neo4jService.getNeogma());
  }

  async create(createDto: CreateActorRequirementInterface): Promise<ActorRequirement> {
    try {
      const requirement = await this.actorRequirementModel.createOne({
        depth: createDto.depth,
        operation: createDto.operation,
        useCase: {
          where: [{ params: { id: createDto.useCaseId } }],
        },
        project: {
          where: [{ params: { id: createDto.projectId } }],
        },
        actors: {
          where: { params: { id: { [Op.in]: createDto.actorIds } } },
        },
      });

      return requirement;
    } catch (error) {
      throw new Error(`Failed to create actor requirement: ${error.message}`);
    }
  }

  async update(id: string, updateDto: UpdateActorRequirementInterface): Promise<ActorRequirement> {
    try {
      // Create an object with only the fields to update
      const updateFields: Record<string, any> = {};
      if (updateDto.depth !== undefined) updateFields.depth = updateDto.depth;
      if (updateDto.operation !== undefined) updateFields.operation = updateDto.operation;

      // Update the requirement
      const updated = await this.actorRequirementModel.updateOneOrThrow(updateFields, {
        where: { id },
      });

      if (!updated) {
        throw new NotFoundException(`Actor requirement with ID ${id} not found`);
      }

      // Update the actor relationships if provided
      if (updateDto.actorIds && updateDto.actorIds.length > 0) {
        await this.actorRequirementModel.deleteRelationships({
          alias: "actors",
          where: {
            source: { id },
          },
        });

        for (const actorId of updateDto.actorIds) {
          await this.actorRequirementModel.relateTo({
            alias: "actors",
            where: {
              source: { id },
              target: { id: actorId },
            },
          });
        }
      }

      // Get the updated requirement with its relationships
      const updatedRequirement = await this.actorRequirementModel.findOneWithRelations({
        where: { id },
        include: ["actors"],
      });
      if (!updatedRequirement) {
        throw new NotFoundException(`Requirement with ${id} not found!`);
      }

      return updatedRequirement;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update actor requirement: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.actorRequirementModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete actor requirement: ${error.message}`);
    }
  }

  async getById(id: string): Promise<ActorRequirement | null> {
    try {
      const requirement = await this.actorRequirementModel.findOneWithRelations({
        where: { id },
        include: ["actors"],
      });

      return requirement ?? null;
    } catch (error) {
      throw new Error(`Failed to retrieve actor requirement: ${error.message}`);
    }
  }

  async getAll(): Promise<ActorRequirement[]> {
    try {
      const requirements = await this.actorRequirementModel.findManyWithRelations({
        include: ["actors"],
      });
      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve all actor requirements: ${error.message}`);
    }
  }

  async getByUseCase(useCaseId: string): Promise<ActorRequirement[]> {
    try {
      const requirements = await this.actorRequirementModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve actor requirements for use case: ${error.message}`);
    }
  }

  async getByProject(projectId: string): Promise<ActorRequirement[]> {
    try {
      const requirements = await this.actorRequirementModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve actor requirements for project: ${error.message}`);
    }
  }
}
