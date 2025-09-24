import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import {
  RequirementExceptionModel,
  RequirementExceptionModelType,
} from "../models/requirement-exception.model";
import { CreateRequirementExceptionInterface } from "../interfaces/create-requirement.interface";
import { RequirementException } from "../entities/requirement-exception.entity";

@Injectable()
export class ExceptionalRequirementRepository {
  private exceptionalRequirementModel: RequirementExceptionModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.exceptionalRequirementModel = RequirementExceptionModel(this.neo4jService.getNeogma());
  }

  async create(createDto: CreateRequirementExceptionInterface): Promise<RequirementException> {
    try {
      const exception = await this.exceptionalRequirementModel.createOne({
        name: createDto.name,
        requirements: {
          where: { params: { id: createDto.requirementId } },
        },
      });
      return exception;
    } catch (error) {
      throw new Error(`Failed to create requirement exception: ${error.message}`);
    }
  }

  async getById(id: string): Promise<RequirementException | null> {
    try {
      const exception = await this.exceptionalRequirementModel.findOneWithRelations({
        where: { id },
      });
      return exception ?? null;
    } catch (error) {
      throw new Error(`Failed to retrieve requirement exception: ${error.message}`);
    }
  }

  async update(id: string, name?: string): Promise<RequirementException> {
    try {
      const updated = await this.exceptionalRequirementModel.updateOneOrThrow(
        { name: name },
        { where: { id } },
      );
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update requirement exception: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.exceptionalRequirementModel.delete({
        where: { id },
        detach: true,
      });
      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete requirement exception: ${error.message}`);
    }
  }

  async addRequirement(exceptionId: string, requirementId: string): Promise<RequirementException> {
    try {
      await this.exceptionalRequirementModel.relateTo({
        alias: "requirements",
        where: {
          source: { id: exceptionId },
          target: { id: requirementId },
        },
      });

      const updatedException = await this.getById(exceptionId);
      if (!updatedException) {
        throw new NotFoundException(`Exception with ID ${exceptionId} not found after update`);
      }

      return updatedException;
    } catch (error) {
      throw new Error(`Failed to add requirement to exception: ${error.message}`);
    }
  }

  async removeRequirement(exceptionId: string, requirementId: string): Promise<boolean> {
    try {
      const result = await this.exceptionalRequirementModel.deleteRelationships({
        alias: "requirements",
        where: {
          source: { id: exceptionId },
          target: { id: requirementId },
        },
      });

      return result > 0;
    } catch (error) {
      throw new Error(`Failed to remove requirement from exception: ${error.message}`);
    }
  }
}
