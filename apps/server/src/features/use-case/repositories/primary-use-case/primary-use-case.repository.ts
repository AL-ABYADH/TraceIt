import { Injectable, NotFoundException } from "@nestjs/common";
import { PrimaryUseCaseModel, PrimaryUseCaseModelType } from "../../models/primary-use-case.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { UpdatePrimaryUseCaseInterface } from "../../interfaces/update-use-case.interface";
import { Op } from "@repo/custom-neogma";
import { CreateUseCaseInterface } from "../../interfaces/create-use-case.interface";
import { PrimaryUseCase } from "../../entities/primary-use-case.entity";

@Injectable()
export class PrimaryUseCaseRepository {
  private primaryUseCaseModel: PrimaryUseCaseModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.primaryUseCaseModel = PrimaryUseCaseModel(this.neo4jService.getNeogma());
    console.log(this.primaryUseCaseModel.relationships);
  }

  /**
   * Creates a new primary use case with the provided data.
   * @param createDto - The data needed to create the primary use case
   * @returns A promise resolving to the created primary use case entity
   */
  async create(createDto: CreateUseCaseInterface): Promise<PrimaryUseCase> {
    try {
      const useCase = await this.primaryUseCaseModel.createOne({
        name: createDto.name,
        description: createDto.description,
        project: {
          where: [{ params: { id: createDto.projectId } }],
        },
        primaryActors: {
          where: { params: { id: { [Op.in]: createDto.primaryActorIds } } },
        },
        secondaryActors: {
          where: { params: { id: { [Op.in]: createDto.secondaryActorIds } } },
        },
      });

      return useCase;
    } catch (error) {
      throw new Error(`Failed to create primary use case: ${error.message}`);
    }
  }

  /**
   * Updates an existing primary use case with the provided data.
   * @param id - The ID of the primary use case to update
   * @param updateDto - The data to update the primary use case with
   * @returns A promise resolving to the updated primary use case entity
   */
  async update(id: string, updateDto: UpdatePrimaryUseCaseInterface): Promise<PrimaryUseCase> {
    try {
      // First, update basic properties
      const updateData: Record<string, any> = {};
      const updateRelation: Record<string, any> = {};

      if (updateDto.name !== undefined) {
        updateData.name = updateDto.name;
      }

      if (updateDto.description !== undefined) {
        updateData.description = updateDto.description;
      }

      if (updateDto.primaryActorIds !== undefined) {
        updateRelation.primaryActorIds = updateDto.primaryActorIds;
      } else {
        updateRelation.primaryActorIds = [];
      }

      if (updateDto.secondaryActorIds !== undefined) {
        updateRelation.secondaryActorIds = updateDto.secondaryActorIds;
      } else {
        updateRelation.secondaryActorIds = [];
      }

      await this.primaryUseCaseModel.updateOneOrThrow(updateData, {
        where: { id },
      });

      // Handle actor relationships if provided
      if (
        updateRelation.primaryActorIds?.length > 0 ||
        updateRelation.secondaryActorIds?.length > 0
      ) {
        // Delete existing actor relationships if we're updating actors
        if (updateRelation.primaryActorIds?.length > 0) {
          await this.primaryUseCaseModel.deleteRelationships({
            alias: "primaryActors",
            where: {
              source: { id },
            },
          });

          // Create new relationships
          for (const actorId of updateRelation.primaryActorIds) {
            await this.primaryUseCaseModel.relateTo({
              alias: "primaryActors",
              where: {
                source: { id },
                target: { id: actorId },
              },
            });
          }
        }

        if (updateRelation.secondaryActorIds?.length > 0) {
          await this.primaryUseCaseModel.deleteRelationships({
            alias: "secondaryActors",
            where: {
              source: { id },
            },
          });

          // Create new relationships
          for (const actorId of updateRelation.secondaryActorIds) {
            await this.primaryUseCaseModel.relateTo({
              alias: "secondaryActors",
              where: {
                source: { id },
                target: { id: actorId },
              },
            });
          }
        }
      }

      // Get the updated entity with its relationships
      const updatedUseCase = await this.primaryUseCaseModel.findOneWithRelations({
        where: { id },
      });

      if (!updatedUseCase) {
        throw new NotFoundException(`Primary use case with ID ${id} not found after update`);
      }

      return updatedUseCase;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update primary use case: ${error.message}`);
    }
  }

  /**
   * Deletes a primary use case by ID.
   * @param id - The ID of the primary use case to delete
   * @returns A promise resolving to a boolean indicating deletion success
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.primaryUseCaseModel.delete({
        where: { id },
        detach: true, // Detach relationships before deletion
      });

      return result > 0;
    } catch (error) {
      throw new Error(`Failed to delete primary use case: ${error.message}`);
    }
  }

  /**
   * Retrieves a primary use case by ID.
   * @param id - The ID of the primary use case to retrieve
   * @returns A promise resolving to the primary use case entity or null if not found
   */
  async getById(id: string): Promise<PrimaryUseCase | null> {
    try {
      const useCase = await this.primaryUseCaseModel.findOneWithRelations({
        where: { id },
        include: ["primaryActors", "secondaryActors", "project", "requirements", "classes"],
      });

      return useCase ? useCase : null;
    } catch (error) {
      throw new Error(`Failed to retrieve primary use case: ${error.message}`);
    }
  }

  /**
   * Retrieves all primary use cases.
   * @returns A promise resolving to an array of primary use case entities
   */
  async getAll(): Promise<PrimaryUseCase[]> {
    try {
      const useCases = await this.primaryUseCaseModel.findManyWithRelations({});

      return useCases;
    } catch (error) {
      throw new Error(`Failed to retrieve all primary use cases: ${error.message}`);
    }
  }

  /**
   * Retrieves all primary use cases for a specific project.
   * @param projectId - The ID of the project
   * @returns A promise resolving to an array of primary use case entities
   */
  async getByProject(projectId: string): Promise<PrimaryUseCase[]> {
    try {
      const useCases = await this.primaryUseCaseModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
      });
      const useCasesIds = useCases.map((uc) => uc.id);

      const useCaseWithRelationships = await this.primaryUseCaseModel.findManyWithRelations({
        where: { id: { [Op.in]: useCasesIds } },
      });

      return useCaseWithRelationships;
    } catch (error) {
      throw new Error(`Failed to retrieve primary use cases for project: ${error.message}`);
    }
  }
}
