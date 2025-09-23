import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { Op } from "@repo/custom-neogma";
import {
  SystemActorCommunicationRequirementModel,
  SystemActorCommunicationRequirementModelType,
} from "../../models";
import { SystemActorCommunicationRequirement } from "../../entities";
import { CreateSystemActorCommunicationRequirementInterface } from "../../interfaces/create-requirement.interface";
import { UpdateSystemActorCommunicationRequirementInterface } from "../../interfaces/update-requirement.interface";
import { RequirementRepositoryInterface } from "../../interfaces/requirement-repository.interface";

@Injectable()
export class SystemActorCommunicationRequirementRepository
  implements RequirementRepositoryInterface<SystemActorCommunicationRequirement>
{
  private systemActorCommunicationRequirementModel: SystemActorCommunicationRequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.systemActorCommunicationRequirementModel = SystemActorCommunicationRequirementModel(
      this.neo4jService.getNeogma(),
    );
  }

  async create(
    createDto: CreateSystemActorCommunicationRequirementInterface,
  ): Promise<SystemActorCommunicationRequirement> {
    try {
      const requirement = await this.systemActorCommunicationRequirementModel.createOne({
        depth: createDto.depth,
        communicationInfo: createDto.communicationInfo,
        communicationFacility: createDto.communicationFacility,
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
      throw new Error(`Failed to create system-actor communication requirement: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateDto: UpdateSystemActorCommunicationRequirementInterface,
  ): Promise<SystemActorCommunicationRequirement> {
    try {
      // Create an object with only the fields to update
      const updateFields: Record<string, any> = {};
      if (updateDto.depth !== undefined) updateFields.depth = updateDto.depth;
      if (updateDto.communicationInfo !== undefined)
        updateFields.communicationInfo = updateDto.communicationInfo;
      if (updateDto.communicationFacility !== undefined)
        updateFields.communicationFacility = updateDto.communicationFacility;

      // Update the requirement
      const updated = await this.systemActorCommunicationRequirementModel.updateOneOrThrow(
        updateFields,
        {
          where: { id },
        },
      );

      if (!updated) {
        throw new NotFoundException(
          `System-actor communication requirement with ID ${id} not found`,
        );
      }

      // Update the actor relationships if provided
      if (updateDto.actorIds && updateDto.actorIds.length > 0) {
        await this.systemActorCommunicationRequirementModel.deleteRelationships({
          alias: "actors",
          where: {
            source: { id },
          },
        });

        for (const actorId of updateDto.actorIds) {
          await this.systemActorCommunicationRequirementModel.relateTo({
            alias: "actors",
            where: {
              source: { id },
              target: { id: actorId },
            },
          });
        }
      }

      // Get the updated requirement with its relationships
      const updatedRequirement =
        await this.systemActorCommunicationRequirementModel.findOneWithRelations({
          where: { id },
          include: ["actors"],
        });
      if (!updatedRequirement) {
        throw new NotFoundException(`Requirement with ${id} Not found!`);
      }

      return updatedRequirement;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update system-actor communication requirement: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.systemActorCommunicationRequirementModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete system-actor communication requirement: ${error.message}`);
    }
  }

  async getById(id: string): Promise<SystemActorCommunicationRequirement | null> {
    try {
      const requirement = await this.systemActorCommunicationRequirementModel.findOneWithRelations({
        where: { id },
        include: ["actors"],
      });

      return requirement ?? null;
    } catch (error) {
      throw new Error(
        `Failed to retrieve system-actor communication requirement: ${error.message}`,
      );
    }
  }

  async getAll(): Promise<SystemActorCommunicationRequirement[]> {
    try {
      const requirements =
        await this.systemActorCommunicationRequirementModel.findManyWithRelations({
          include: ["actors"],
        });
      return requirements;
    } catch (error) {
      throw new Error(
        `Failed to retrieve all system-actor communication requirements: ${error.message}`,
      );
    }
  }

  async getByUseCase(useCaseId: string): Promise<SystemActorCommunicationRequirement[]> {
    try {
      const requirements = await this.systemActorCommunicationRequirementModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      return requirements;
    } catch (error) {
      throw new Error(
        `Failed to retrieve system-actor communication requirements for use case: ${error.message}`,
      );
    }
  }

  async getByProject(projectId: string): Promise<SystemActorCommunicationRequirement[]> {
    try {
      const requirements = await this.systemActorCommunicationRequirementModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
      });

      return requirements;
    } catch (error) {
      throw new Error(
        `Failed to retrieve system-actor communication requirements for project: ${error.message}`,
      );
    }
  }
}
