import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { EventSystemRequirementModel, EventSystemRequirementModelType } from "../../models";
import { EventSystemRequirement } from "../../entities";
import { CreateEventSystemRequirementInterface } from "../../interfaces/create-requirement.interface";
import { UpdateEventSystemRequirementInterface } from "../../interfaces/update-requirement.interface";
import { RequirementRepositoryInterface } from "../../interfaces/requirement-repository.interface";

@Injectable()
export class EventSystemRequirementRepository
  implements RequirementRepositoryInterface<EventSystemRequirement>
{
  private eventSystemRequirementModel: EventSystemRequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.eventSystemRequirementModel = EventSystemRequirementModel(this.neo4jService.getNeogma());
  }

  async create(createDto: CreateEventSystemRequirementInterface): Promise<EventSystemRequirement> {
    try {
      const requirement = await this.eventSystemRequirementModel.createOne({
        depth: createDto.depth,
        operation: createDto.operation,
        useCase: {
          where: [{ params: { id: createDto.useCaseId } }],
        },
        project: {
          where: [{ params: { id: createDto.projectId } }],
        },
        event: {
          where: [{ params: { id: createDto.eventActorId } }],
        },
      });

      return requirement;
    } catch (error) {
      throw new Error(`Failed to create event system requirement: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateDto: UpdateEventSystemRequirementInterface,
  ): Promise<EventSystemRequirement[]> {
    try {
      // Create an object with only the fields to update
      const updateFields: Record<string, any> = {};
      if (updateDto.depth !== undefined) updateFields.depth = updateDto.depth;
      if (updateDto.operation !== undefined) updateFields.operation = updateDto.operation;

      // Update the requirement
      const updated = await this.eventSystemRequirementModel.update(updateFields, {
        where: { id },
      });

      if (!updated || updated.length === 0) {
        throw new NotFoundException(`Event system requirement with ID ${id} not found`);
      }

      // Update the event actor relationship if provided
      if (updateDto.eventActorId) {
        await this.eventSystemRequirementModel.deleteRelationships({
          alias: "event",
          where: {
            source: { id },
          },
        });

        await this.eventSystemRequirementModel.relateTo({
          alias: "event",
          where: {
            source: { id },
            target: { id: updateDto.eventActorId },
          },
        });
      }

      // Get the updated requirement with its relationships
      const updatedRequirement = await this.eventSystemRequirementModel.findOneWithRelations({
        where: { id },
      });

      return updatedRequirement ? [updatedRequirement] : [];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update event system requirement: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.eventSystemRequirementModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete event system requirement: ${error.message}`);
    }
  }

  async getById(id: string): Promise<EventSystemRequirement | null> {
    try {
      const requirement = await this.eventSystemRequirementModel.findOneWithRelations({
        where: { id },
        include: ["event"],
      });

      return requirement ?? null;
    } catch (error) {
      throw new Error(`Failed to retrieve event system requirement: ${error.message}`);
    }
  }

  async getAll(): Promise<EventSystemRequirement[]> {
    try {
      const requirements = await this.eventSystemRequirementModel.findManyWithRelations({
        include: ["event"],
      });
      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve all event system requirements: ${error.message}`);
    }
  }

  async getByUseCase(useCaseId: string): Promise<EventSystemRequirement[]> {
    try {
      const requirements = await this.eventSystemRequirementModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      return requirements;
    } catch (error) {
      throw new Error(
        `Failed to retrieve event system requirements for use case: ${error.message}`,
      );
    }
  }

  async getByProject(projectId: string): Promise<EventSystemRequirement[]> {
    try {
      const requirements = await this.eventSystemRequirementModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve event system requirements for project: ${error.message}`);
    }
  }
}
