import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { SystemRequirementModel, SystemRequirementModelType } from "../../models";
import { SystemRequirement } from "../../entities";
import { CreateSystemRequirementInterface } from "../../interfaces/create-requirement.interface";
import { UpdateSystemRequirementInterface } from "../../interfaces/update-requirement.interface";
import { RequirementRepositoryInterface } from "../../interfaces/requirement-repository.interface";

@Injectable()
export class SystemRequirementRepository
  implements RequirementRepositoryInterface<SystemRequirement>
{
  private systemRequirementModel: SystemRequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.systemRequirementModel = SystemRequirementModel(this.neo4jService.getNeogma());
  }

  async create(createDto: CreateSystemRequirementInterface): Promise<SystemRequirement> {
    try {
      const requirement = await this.systemRequirementModel.createOne({
        depth: createDto.depth,
        operation: createDto.operation,
        useCase: {
          where: [{ params: { id: createDto.useCaseId } }],
        },
        project: {
          where: [{ params: { id: createDto.projectId } }],
        },
      });

      return requirement;
    } catch (error) {
      throw new Error(`Failed to create system requirement: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateDto: UpdateSystemRequirementInterface,
  ): Promise<SystemRequirement[]> {
    try {
      const updated = await this.systemRequirementModel.update(updateDto, {
        where: { id },
      });

      if (!updated || updated.length === 0) {
        throw new NotFoundException(`System requirement with ID ${id} not found`);
      }

      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update system requirement: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.systemRequirementModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete system requirement: ${error.message}`);
    }
  }

  async getById(id: string): Promise<SystemRequirement | null> {
    try {
      const requirement = await this.systemRequirementModel.findOne({
        where: { id },
      });

      return requirement ?? null;
    } catch (error) {
      throw new Error(`Failed to retrieve system requirement: ${error.message}`);
    }
  }

  async getAll(): Promise<SystemRequirement[]> {
    try {
      const requirements = await this.systemRequirementModel.findMany({});
      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve all system requirements: ${error.message}`);
    }
  }

  async getByUseCase(useCaseId: string): Promise<SystemRequirement[]> {
    try {
      const requirements = await this.systemRequirementModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve system requirements for use case: ${error.message}`);
    }
  }

  async getByProject(projectId: string): Promise<SystemRequirement[]> {
    try {
      const requirements = await this.systemRequirementModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve system requirements for project: ${error.message}`);
    }
  }
}
