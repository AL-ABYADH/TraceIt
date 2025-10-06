import { Injectable, NotFoundException } from "@nestjs/common";
import { Op } from "@repo/custom-neogma";
import { Neo4jService } from "../../../core/neo4j/neo4j.service";
import { Requirement } from "../entities/requirement.entity";
import { CreateRequirementInterface } from "../interfaces/create-requirement.interface";
import { UpdateRequirementInterface } from "../interfaces/update-requirement.interface";
import { RequirementModel, RequirementModelType } from "../models/requirement.model";

/**
 * Repository for managing requirement entities in Neo4j database
 * Handles CRUD operations and relationship management for requirements
 */
@Injectable()
export class RequirementRepository {
  private requirementModel: RequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.requirementModel = RequirementModel(this.neo4jService.getNeogma());
  }

  //====================================
  // CRUD Operations
  //====================================

  /**
   * Creates a new requirement
   * @param createDto - Data for creating the requirement
   * @returns Newly created requirement
   */
  async create(createDto: CreateRequirementInterface): Promise<Requirement> {
    try {
      const requirement = await this.requirementModel.createOne({
        operation: createDto.operation,
        condition: createDto.condition,
        useCase: createDto.useCaseId
          ? { where: [{ params: { id: createDto.useCaseId } }] }
          : undefined,
        actors: {
          where: createDto.actorIds ? [{ params: { id: { [Op.in]: createDto.actorIds } } }] : [],
        },
      });

      return requirement;
    } catch (error) {
      throw new Error(`Failed to create requirement: ${error.message}`);
    }
  }

  /**
   * Updates an existing requirement
   * @param id - ID of the requirement to update
   * @param updateDto - Data for updating the requirement
   * @returns Updated requirement with relationships
   */
  async update(id: string, updateDto: UpdateRequirementInterface): Promise<Requirement> {
    try {
      const updateData: Record<string, any> = {};

      if (updateDto.operation !== undefined) {
        updateData.operation = updateDto.operation;
      }

      if (updateDto.condition !== undefined) {
        updateData.condition = updateDto.condition;
      }

      await this.requirementModel.updateOneOrThrow(updateData, {
        where: { id },
      });

      // Update actor relationships if provided
      if (updateDto.actorIds !== undefined) {
        await this.requirementModel.deleteRelationships({
          alias: "actors",
          where: {
            source: { id },
          },
        });

        if (updateDto.actorIds.length > 0) {
          for (const actorId of updateDto.actorIds) {
            await this.requirementModel.relateTo({
              alias: "actors",
              where: {
                source: { id },
                target: { id: actorId },
              },
            });
          }
        }
      }

      const updatedRequirement = await this.requirementModel.findOneWithRelations({
        where: { id },
      });

      if (!updatedRequirement) {
        throw new NotFoundException(`Requirement with ID ${id} not found after update`);
      }

      if (updatedRequirement.relatedActivity) {
        this.neo4jService
          .getNeogma()
          .queryRunner.run("MATCH (n) WHERE n.id = $id SET n.requirementUpdated = $boolean", {
            id: updatedRequirement?.relatedActivity?.id,
            boolean: true,
          });
      }
      if (updatedRequirement.relatedCondition) {
        this.neo4jService
          .getNeogma()
          .queryRunner.run("MATCH (n) WHERE n.id = $id SET n.requirementUpdated = $boolean", {
            id: updatedRequirement?.relatedCondition?.id,
            boolean: true,
          });
      }
      return updatedRequirement;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update requirement: ${error.message}`);
    }
  }

  /**
   * Deletes a requirement
   * @param id - ID of the requirement to delete
   * @returns True if deletion was successful
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.requirementModel.delete({
        where: { id },
        detach: true,
      });

      return result > 0;
    } catch (error) {
      throw new Error(`Failed to delete requirement: ${error.message}`);
    }
  }

  /**
   * Retrieves a requirement by its ID with all relationships
   * @param id - ID of the requirement to retrieve
   * @returns Requirement with relationships or null if not found
   */
  async getById(id: string): Promise<Requirement | null> {
    try {
      const requirement = await this.requirementModel.findOneWithRelations({
        where: { id },
        include: [
          "useCase",
          "secondaryUseCase",
          "actors",
          "nestedRequirements",
          "exceptions",
          "requirementException",
        ],
      });

      return requirement ?? null;
    } catch (error) {
      throw new Error(`Failed to retrieve requirement: ${error.message}`);
    }
  }

  /**
   * Retrieves all requirements associated with a specific use case
   * without duplicating requirements that appear as nested requirements
   * @param useCaseId - ID of the use case to fetch requirements for
   * @returns Array of requirements with their relationships, without duplication
   */
  async getByUseCase(useCaseId: string): Promise<Requirement[]> {
    try {
      // fetch all requirements with relations
      const requirements = await this.requirementModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
        include: [
          "nestedRequirements",
          "secondaryUseCase",
          "actors",
          "exceptions",
          "requirementException",
        ],
      });

      console.log("Fetched requirements:", requirements.length);

      if (!requirements || requirements.length === 0) {
        return [];
      }

      // Collect IDs of all nested/exception requirements (children we want to exclude)
      const childIds = new Set<string>();

      for (const req of requirements) {
        // nestedRequirements: array of requirement objects
        if (Array.isArray(req.nestedRequirements) && req.nestedRequirements.length > 0) {
          for (const nested of req.nestedRequirements) {
            if (nested && nested.id) childIds.add(nested.id);
          }
        }

        // requirementException: can be an array
        const exc = req.requirementException;
        if (Array.isArray(exc) && exc.length > 0) {
          for (const e of exc) {
            if (e && e.id) childIds.add(e.id);
          }
        } else if (exc && "id" in exc && typeof exc.id === "string" && exc.id) {
          childIds.add(exc.id);
        }
      }

      // Return only requirements whose id is NOT a nested/exception id
      const filteredRequirements = requirements.filter((req) => !childIds.has(req.id));

      return filteredRequirements;
    } catch (error: any) {
      throw new Error(
        `Failed to retrieve requirements for use case: ${error?.message ?? String(error)}`,
      );
    }
  }

  //====================================
  // Relationship Management
  //====================================

  /**
   * Adds a nested requirement relationship
   * @param parentId - ID of the parent requirement
   * @param childId - ID of the child requirement to nest
   * @returns Updated parent requirement
   */
  async addNestedRequirement(parentId: string, childId: string): Promise<Requirement> {
    try {
      await this.requirementModel.relateTo({
        alias: "nestedRequirements",
        where: {
          source: { id: parentId },
          target: { id: childId },
        },
      });

      const updatedRequirement = await this.getById(parentId);
      if (!updatedRequirement) {
        throw new NotFoundException(`Requirement with ID ${parentId} not found after update`);
      }

      return updatedRequirement;
    } catch (error) {
      throw new Error(`Failed to add nested requirement: ${error.message}`);
    }
  }

  /**
   * Removes a nested requirement relationship
   * @param parentId - ID of the parent requirement
   * @param childId - ID of the child requirement to remove
   * @returns True if removal was successful
   */
  async removeNestedRequirement(parentId: string, childId: string): Promise<boolean> {
    try {
      const result = await this.requirementModel.deleteRelationships({
        alias: "nestedRequirements",
        where: {
          source: { id: parentId },
          target: { id: childId },
        },
      });

      return result > 0;
    } catch (error) {
      throw new Error(`Failed to remove nested requirement: ${error.message}`);
    }
  }

  /**
   * Adds secondary use case relationship
   * @param requirementId - ID of the requirement
   * @param secondaryUseCaseId - ID of the use case to add
   * @returns Updated requirement
   */
  async addSecondaryUseCase(
    requirementId: string,
    secondaryUseCaseId: string,
  ): Promise<Requirement> {
    try {
      await this.requirementModel.relateTo({
        alias: "secondaryUseCase",
        where: {
          source: { id: requirementId },
          target: { id: secondaryUseCaseId },
        },
      });

      const updatedRequirement = await this.getById(requirementId);
      if (!updatedRequirement) {
        throw new NotFoundException(`Requirement with ID ${requirementId} not found after update`);
      }

      return updatedRequirement;
    } catch (error) {
      throw new Error(`Failed to add exception: ${error.message}`);
    }
  }

  /**
   * Adds an exception relationship
   * @param requirementId - ID of the requirement
   * @param exceptionId - ID of the exception to add
   * @returns Updated requirement
   */
  async addException(requirementId: string, exceptionId: string): Promise<Requirement> {
    try {
      await this.requirementModel.relateTo({
        alias: "exceptions",
        where: {
          source: { id: requirementId },
          target: { id: exceptionId },
        },
      });

      const updatedRequirement = await this.getById(requirementId);
      if (!updatedRequirement) {
        throw new NotFoundException(`Requirement with ID ${requirementId} not found after update`);
      }

      return updatedRequirement;
    } catch (error) {
      throw new Error(`Failed to add exception: ${error.message}`);
    }
  }

  /**
   * Removes an exception relationship
   * @param requirementId - ID of the requirement
   * @param exceptionId - ID of the exception to remove
   * @returns True if removal was successful
   */
  async removeException(requirementId: string, exceptionId: string): Promise<boolean> {
    try {
      const result = await this.requirementModel.deleteRelationships({
        alias: "exceptions",
        where: {
          source: { id: requirementId },
          target: { id: exceptionId },
        },
      });

      return result > 0;
    } catch (error) {
      throw new Error(`Failed to remove exception: ${error.message}`);
    }
  }

  /**
   * add the use case association for a requirement
   * @param requirementId - ID of the requirement to move
   * @param useCaseId - ID of the target use case
   * @returns True if the change was successful
   */
  async addUseCase(requirementId: string, useCaseId: string): Promise<boolean> {
    // Create relationship with the new use case
    await this.requirementModel.relateTo({
      alias: "useCase",
      where: {
        source: { id: requirementId },
        target: { id: useCaseId },
      },
    });

    return true;
  }
  catch(error) {
    throw new Error(`Failed to transfer requirement to new use case: ${error.message}`);
  }

  /**
   * Checks if a Requirement already has incoming relationships
   * from Condition or Activity nodes.
   */
  async checkRelationships(
    requirementId: string,
  ): Promise<{ hasCondition: boolean; hasActivity: boolean }> {
    try {
      const query = `
        MATCH (r:Requirement {id: $requirementId})
        OPTIONAL MATCH (c:Condition)-[:RELATED_TO]->(r)
        OPTIONAL MATCH (a:Activity)-[:RELATED_TO]->(r)
        RETURN 
          COUNT(DISTINCT c) > 0 AS hasCondition,
          COUNT(DISTINCT a) > 0 AS hasActivity
      `;

      const result = await this.neo4jService.getNeogma().queryRunner.run(query, { requirementId });

      // Defensive check — ensure we have records
      if (!result.records || result.records.length === 0) {
        return { hasCondition: false, hasActivity: false };
      }

      // Safely extract and cast values
      const record = result.records[0];
      const hasCondition = Boolean(record?.get("hasCondition"));
      const hasActivity = Boolean(record?.get("hasActivity"));

      return { hasCondition, hasActivity };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to check requirement relationships: ${message}`);
    }
  }
}
