import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import {
  RequirementExceptionModel,
  RequirementExceptionModelType,
} from "../models/requirement-exception.model";
import { CreateRequirementExceptionInterface } from "../interfaces/create-requirement.interface";
import { RequirementException } from "../entities/requirement-exception.entity";
import { RequirementRepository } from "./requirement.repository";

@Injectable()
export class ExceptionalRequirementRepository {
  private exceptionalRequirementModel: RequirementExceptionModelType;

  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly requirementRepository: RequirementRepository,
  ) {
    this.exceptionalRequirementModel = RequirementExceptionModel(this.neo4jService.getNeogma());
  }

  async create(createDto: CreateRequirementExceptionInterface): Promise<RequirementException> {
    try {
      const exception = await this.exceptionalRequirementModel.createOne({
        name: createDto.name,
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
        include: [
          "requirements", // requirements under this exception
          "requirement", // the requirement this exception belongs to
          "secondaryUseCase",
        ],
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

  // async delete(id: string): Promise<boolean> {
  //   try {
  //     const deletedCount = await this.exceptionalRequirementModel.delete({
  //       where: { id },
  //       detach: true,
  //     });
  //     return deletedCount > 0;
  //   } catch (error) {
  //     throw new Error(`Failed to delete requirement exception: ${error.message}`);
  //   }
  // }
  // async delete(id: string): Promise<boolean> {
  //   try {
  //     const query = `
  //     MATCH (ex:RequirementException {id: $id})

  //     OPTIONAL MATCH (ex)-[:BELONGS_TO]->(childReq:Requirement)

  //     OPTIONAL MATCH (childReq)<-[:DETAILS*0..]-(nestedReq:Requirement)

  //     OPTIONAL MATCH (childReq)<-[:EXCEPTION_AT]-(childException:RequirementException)

  //     OPTIONAL MATCH (childException)-[:BELONGS_TO]->(childExceptionReq:Requirement)

  //     OPTIONAL MATCH (childExceptionReq)<-[:DETAILS*0..]-(childExceptionNestedReq:Requirement)

  //     WITH COLLECT(DISTINCT ex) +
  //          COLLECT(DISTINCT childReq) +
  //          COLLECT(DISTINCT nestedReq) +
  //          COLLECT(DISTINCT childException) +
  //          COLLECT(DISTINCT childExceptionReq) +
  //          COLLECT(DISTINCT childExceptionNestedReq) AS nodesToDelete

  //     UNWIND nodesToDelete AS node
  //     WITH DISTINCT node
  //     WHERE node IS NOT NULL
  //     DETACH DELETE node

  //     RETURN COUNT(node) as deletedCount
  //   `;

  //     const result = await this.neo4jService.getNeogma().queryRunner.run(query, { id });
  //     const deletedCount = result.records[0]?.get("deletedCount")?.toNumber() || 0;
  //     return deletedCount > 0;
  //   } catch (error) {
  //     throw new Error(`Failed to delete requirement exception: ${error.message}`);
  //   }
  // }

  async delete(id: string): Promise<boolean> {
    try {
      const query = `
    MATCH (ex:RequirementException {id: $id})
    WITH ex
    MATCH (connected)
    WHERE (connected:Requirement OR connected:RequirementException)
    AND shortestPath((ex)<-[:BELONGS_TO|DETAILS|EXCEPTION_AT*0..10]-(connected)) IS NOT NULL
    WITH COLLECT(DISTINCT ex) + COLLECT(DISTINCT connected) AS nodesToDelete
    UNWIND nodesToDelete AS node
    DETACH DELETE node
    RETURN COUNT(node) as deletedCount
    `;

      const result = await this.neo4jService.getNeogma().queryRunner.run(query, { id });
      const deletedCount = result.records[0]?.get("deletedCount")?.toNumber() || 0;

      console.log(`✅ Deleted exception ${id} and ${deletedCount - 1} related nodes`);
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
  /**
   * Get all requirement exceptions for a specific use case - FIXED
   */
  // async getByUseCase(useCaseId: string): Promise<RequirementException[]> {
  //   try {
  //     // Use raw query to find exceptions via the correct EXCEPTION_AT relationship direction
  //     const result = await this.neo4jService.getNeogma().queryRunner.run(
  //       `
  //     MATCH (uc:UseCase {id: $useCaseId})<-[:BELONGS_TO]-(req:Requirement)<-[:EXCEPTION_AT]-(ex:RequirementException)
  //     RETURN DISTINCT ex
  //     ORDER BY ex.createdAt
  //   `,
  //       { useCaseId },
  //     );

  //     if (!result.records || result.records.length === 0) {
  //       return [];
  //     }

  //     // Get the full exception data with relationships
  //     const exceptions: RequirementException[] = [];

  //     for (const record of result.records) {
  //       const exceptionId = record.get("ex").properties.id;
  //       const fullException = await this.exceptionalRequirementModel.findOneWithRelations({
  //         where: { id: exceptionId },
  //         include: ["requirements", "secondaryUseCase"],
  //       });

  //       if (fullException) {
  //         exceptions.push(fullException);
  //       }
  //     }

  //     console.log(`Fetched ${exceptions.length} requirement exceptions for use case ${useCaseId}`);

  //     return exceptions;
  //   } catch (error: any) {
  //     throw new Error(
  //       `Failed to retrieve requirement exceptions for use case: ${error?.message ?? String(error)}`,
  //     );
  //   }
  // }
  async getByUseCase(useCaseId: string): Promise<RequirementException[]> {
    try {
      // Use raw query to find exceptions via the correct EXCEPTION_AT relationship direction
      // This query traverses through all nesting levels of requirements and exceptions
      const result = await this.neo4jService.getNeogma().queryRunner.run(
        `
      MATCH (uc:UseCase {id: $useCaseId})
      MATCH path = (uc)<-[:BELONGS_TO*1..1]-(req:Requirement)
                      <-[:EXCEPTION_AT|DETAILS|BELONGS_TO*0..10]-(ex:RequirementException)
      WITH COLLECT(DISTINCT ex) AS allExceptions
      UNWIND allExceptions AS exception
      WITH DISTINCT exception
      WHERE exception IS NOT NULL
      RETURN DISTINCT exception
      ORDER BY exception.createdAt
    `,
        { useCaseId },
      );

      if (!result.records || result.records.length === 0) {
        return [];
      }

      // Get the full exception data with relationships
      const exceptions: RequirementException[] = [];

      for (const record of result.records) {
        const exceptionId = record.get("exception").properties.id;
        const fullException = await this.exceptionalRequirementModel.findOneWithRelations({
          where: { id: exceptionId },
          include: ["requirements", "secondaryUseCase"],
        });

        if (fullException) {
          exceptions.push(fullException);
        }
      }

      console.log(`Fetched ${exceptions.length} requirement exceptions for use case ${useCaseId}`);

      return exceptions;
    } catch (error: any) {
      throw new Error(
        `Failed to retrieve requirement exceptions for use case: ${error?.message ?? String(error)}`,
      );
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

  /**
   * Adds secondary use case relationship
   * @param exceptionId - ID of the requirement
   * @param secondaryUseCaseId - ID of the use case to add
   * @returns Updated requirement
   */
  async addSecondaryUseCase(
    exceptionId: string,
    secondaryUseCaseId: string,
  ): Promise<RequirementException> {
    try {
      await this.exceptionalRequirementModel.relateTo({
        alias: "secondaryUseCase",
        where: {
          source: { id: exceptionId },
          target: { id: secondaryUseCaseId },
        },
      });

      const updatedException = await this.getById(exceptionId);
      if (!updatedException) {
        throw new NotFoundException(`Exception with ID ${exceptionId} not found after update`);
      }

      return updatedException;
    } catch (error) {
      throw new Error(`Failed to add exception: ${error}`);
    }
  }
}
