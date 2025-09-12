import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import {
  UseCaseReferenceRequirementModel,
  UseCaseReferenceRequirementModelType,
} from "../../models/simple/use-case-reference-requirement.model";
import { UseCaseReferenceRequirement } from "../../entities/simple/use-case-reference-requirement.entity";
import { CreateUseCaseReferenceRequirementInterface } from "../../interfaces/create-requirement.interface";
import { UpdateUseCaseReferenceRequirementInterface } from "../../interfaces/update-requirement.interface";
import { RequirementRepositoryInterface } from "../../interfaces/requirement-repository.interface";

@Injectable()
export class UseCaseReferenceRequirementRepository
  implements RequirementRepositoryInterface<UseCaseReferenceRequirement>
{
  private useCaseReferenceRequirementModel: UseCaseReferenceRequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.useCaseReferenceRequirementModel = UseCaseReferenceRequirementModel(
      this.neo4jService.getNeogma(),
    );
  }

  async create(
    createDto: CreateUseCaseReferenceRequirementInterface,
  ): Promise<UseCaseReferenceRequirement> {
    try {
      const requirement = await this.useCaseReferenceRequirementModel.createOne({
        depth: createDto.depth,
        useCase: {
          where: [{ params: { id: createDto.useCaseId } }],
        },
        project: {
          where: [{ params: { id: createDto.projectId } }],
        },
        referencedUseCase: {
          where: [{ params: { id: createDto.referencedUseCaseId } }],
        },
      });

      return requirement;
    } catch (error) {
      throw new Error(`Failed to create use case reference requirement: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateDto: UpdateUseCaseReferenceRequirementInterface,
  ): Promise<UseCaseReferenceRequirement[]> {
    try {
      // Create an object with only the fields to update
      const updateFields: Record<string, any> = {};
      if (updateDto.depth !== undefined) updateFields.depth = updateDto.depth;

      // Update the requirement
      const updated = await this.useCaseReferenceRequirementModel.update(updateFields, {
        where: { id },
      });

      if (!updated || updated.length === 0) {
        throw new NotFoundException(`Use case reference requirement with ID ${id} not found`);
      }

      // Update the referenced use case relationship if provided
      if (updateDto.referencedUseCaseId) {
        await this.useCaseReferenceRequirementModel.deleteRelationships({
          alias: "referencedUseCase",
          where: {
            source: { id },
          },
        });

        await this.useCaseReferenceRequirementModel.relateTo({
          alias: "referencedUseCase",
          where: {
            source: { id },
            target: { id: updateDto.referencedUseCaseId },
          },
        });
      }

      // Get the updated requirement with its relationships
      const updatedRequirement = await this.useCaseReferenceRequirementModel.findOneWithRelations({
        where: { id },
        include: ["referencedUseCase"],
      });

      return updatedRequirement ? [updatedRequirement] : [];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update use case reference requirement: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.useCaseReferenceRequirementModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete use case reference requirement: ${error.message}`);
    }
  }

  async getById(id: string): Promise<UseCaseReferenceRequirement | null> {
    try {
      const requirement = await this.useCaseReferenceRequirementModel.findOneWithRelations({
        where: { id },
        include: ["referencedUseCase"],
      });

      return requirement ?? null;
    } catch (error) {
      throw new Error(`Failed to retrieve use case reference requirement: ${error.message}`);
    }
  }

  async getAll(): Promise<UseCaseReferenceRequirement[]> {
    try {
      const requirements = await this.useCaseReferenceRequirementModel.findManyWithRelations({
        include: ["referencedUseCase"],
      });
      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve all use case reference requirements: ${error.message}`);
    }
  }

  async getByUseCase(useCaseId: string): Promise<UseCaseReferenceRequirement[]> {
    try {
      const requirements = await this.useCaseReferenceRequirementModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      return requirements;
    } catch (error) {
      throw new Error(
        `Failed to retrieve use case reference requirements for use case: ${error.message}`,
      );
    }
  }

  async getByProject(projectId: string): Promise<UseCaseReferenceRequirement[]> {
    try {
      const requirements = await this.useCaseReferenceRequirementModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
      });

      return requirements;
    } catch (error) {
      throw new Error(
        `Failed to retrieve use case reference requirements for project: ${error.message}`,
      );
    }
  }
}
