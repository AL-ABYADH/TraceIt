// import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
// import { ConditionRepository } from "../repositories/condition.repository";
// import { Condition } from "../entities/condition.entity";
// import { CreateConditionInterface } from "../interfaces/create-condition.interface";
// import { UpdateConditionInterface } from "../interfaces/update-condition.interface";
// import { RequirementService } from "src/features/requirement/services/requirement.service";

// @Injectable()
// export class ConditionService {
//   constructor(
//     private readonly conditionRepository: ConditionRepository,
//     private readonly requirementService: RequirementService,
//   ) {}

//   /**
//    * Creates a new condition with validation to ensure requirement has condition field
//    * @param createDto - Data transfer object containing condition details
//    * @returns Promise resolving to the created condition
//    * @throws BadRequestException if the requirement doesn't have condition field
//    */
//   async create(createDto: CreateConditionInterface): Promise<Condition> {
//     try {
//       // If requirement is provided, validate it has condition field
//       if (createDto.requirementId) {
//         await this.validateRequirementHasCondition(createDto.requirementId);
//       }

//       const condition = await this.conditionRepository.create(createDto);
//       return condition;
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw new BadRequestException(error.message);
//       }
//       throw error;
//     }
//   }

//   /**
//    * Updates an existing condition (only name can be updated, not relationships)
//    * @param id - ID of the condition to update
//    * @param updateDto - Data to update in the condition (only name)
//    * @returns Promise resolving to the updated condition
//    * @throws NotFoundException if the condition doesn't exist
//    */
//   async update(id: string, updateDto: UpdateConditionInterface): Promise<Condition> {
//     try {
//       // Verify condition exists
//       await this.findById(id);

//       // Only allow name updates, not relationship changes
//       return await this.conditionRepository.update(id, updateDto);
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       throw new BadRequestException(`Failed to update condition: ${error.message}`);
//     }
//   }

//   /**
//    * Validates that a requirement has a condition field
//    * @param requirementId - ID of the requirement to validate
//    * @throws BadRequestException if requirement doesn't have condition field
//    */
//   private async validateRequirementHasCondition(requirementId: string): Promise<void> {
//     try {
//       // Get the requirement
//       const requirement = await this.requirementService.findById(requirementId);

//       // Check if requirement has condition field
//       if (!requirement.condition || requirement.condition.trim() === '') {
//         throw new BadRequestException(
//           `Requirement ${requirementId} must have a condition field to be linked to a condition entity.`
//         );
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw new BadRequestException(`Requirement with ID ${requirementId} not found`);
//       }
//       throw error;
//     }
//   }

//   /**
//    * Retrieves a condition by its ID, throwing an exception if not found
//    * @param id - ID of the condition to find
//    * @returns Promise resolving to the condition
//    * @throws NotFoundException if the condition doesn't exist
//    */
//   async findById(id: string): Promise<Condition> {
//     const condition = await this.conditionRepository.getById(id);
//     if (!condition) {
//       throw new NotFoundException(`Condition with ID ${id} not found`);
//     }
//     return condition;
//   }

//   /**
//    * Retrieves all conditions for a specific requirement
//    * @param requirementId - ID of the requirement
//    * @returns Promise resolving to an array of conditions
//    * @throws BadRequestException if the requirement doesn't exist
//    */
//   async listByRequirement(requirementId: string): Promise<Condition[]> {
//     try {
//       await this.requirementService.findById(requirementId);
//       return this.conditionRepository.getByRequirement(requirementId);
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw new BadRequestException(`Requirement with ID ${requirementId} not found`);
//       }
//       throw error;
//     }
//   }

//   /**
//    * Removes a condition
//    * @param id - ID of the condition to remove
//    * @returns Promise resolving to a boolean indicating success
//    * @throws NotFoundException if the condition doesn't exist
//    */
//   async remove(id: string): Promise<boolean> {
//     const condition = await this.findById(id);
//     if (!condition) {
//       throw new NotFoundException(`Condition with ID ${id} not found`);
//     }

//     return this.conditionRepository.delete(id);
//   }

//   /**
//    * Retrieves all conditions
//    * @returns Promise resolving to an array of all conditions
//    */
//   async listAll(): Promise<Condition[]> {
//     return this.conditionRepository.getAll();
//   }
// }

import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { ConditionRepository } from "../repositories/condition.repository";
import { Condition } from "../entities/condition.entity";
import { CreateConditionInterface } from "../interfaces/create-condition.interface";
import { UpdateConditionInterface } from "../interfaces/update-condition.interface";
import { RequirementService } from "src/features/requirement/services/requirement.service";
import { UseCaseService } from "../../use-case/services/use-case/use-case.service"; // Add this

@Injectable()
export class ConditionService {
  constructor(
    private readonly conditionRepository: ConditionRepository,
    private readonly requirementService: RequirementService,
    private readonly useCaseService: UseCaseService, // Add UseCaseService
  ) {}

  /**
   * Creates a new condition with validation to ensure requirement has condition field and belongs to same use case
   * @param createDto - Data transfer object containing condition details
   * @returns Promise resolving to the created condition
   * @throws BadRequestException if the requirement doesn't have condition field or doesn't belong to the same use case
   */
  async create(createDto: CreateConditionInterface): Promise<Condition> {
    try {
      // Validate use case exists and is required
      if (!createDto.useCaseId) {
        throw new BadRequestException("useCaseId is required to create a condition");
      }
      await this.useCaseService.findById(createDto.useCaseId);

      // If requirement is provided, validate it has condition field and belongs to same use case
      if (createDto.requirementId) {
        await this.validateRequirementHasCondition(createDto.requirementId);
        await this.validateRequirementBelongsToUseCase(
          createDto.requirementId,
          createDto.useCaseId,
        );
      }

      const condition = await this.conditionRepository.create(createDto);
      return condition;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Updates an existing condition (only name can be updated, not relationships)
   * @param id - ID of the condition to update
   * @param updateDto - Data to update in the condition (only name)
   * @returns Promise resolving to the updated condition
   * @throws NotFoundException if the condition doesn't exist
   */
  async update(id: string, updateDto: UpdateConditionInterface): Promise<Condition> {
    try {
      // Verify condition exists
      await this.findById(id);

      // Only allow name updates, not relationship changes
      return await this.conditionRepository.update(id, updateDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update condition: ${error.message}`);
    }
  }

  /**
   * Validates that a requirement has a condition field
   * @param requirementId - ID of the requirement to validate
   * @throws BadRequestException if requirement doesn't have condition field
   */
  private async validateRequirementHasCondition(requirementId: string): Promise<void> {
    try {
      // Get the requirement
      const requirement = await this.requirementService.findById(requirementId);

      // Check if requirement has condition field
      if (!requirement.condition || requirement.condition.trim() === "") {
        throw new BadRequestException(
          `Requirement ${requirementId} must have a condition field to be linked to a condition entity.`,
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Requirement with ID ${requirementId} not found`);
      }
      throw error;
    }
  }

  /**
   * Validates that a requirement belongs to the specified use case
   * @param requirementId - ID of the requirement to validate
   * @param useCaseId - ID of the use case it should belong to
   * @throws BadRequestException if requirement doesn't belong to the use case
   */
  private async validateRequirementBelongsToUseCase(
    requirementId: string,
    useCaseId: string,
  ): Promise<void> {
    try {
      // Get the requirement with its use case relationship
      const requirement = await this.requirementService.findById(requirementId);

      // Since both PrimaryUseCase and SecondaryUseCase extend UseCase,
      // we can simply check if the requirement's useCase matches
      if (requirement.useCase?.id !== useCaseId) {
        throw new BadRequestException(
          `Requirement ${requirementId} does not belong to use case ${useCaseId}. ` +
            `It belongs to use case ${requirement.useCase?.id || "none"}.`,
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Requirement with ID ${requirementId} not found`);
      }
      throw error;
    }
  }

  /**
   * Retrieves a condition by its ID, throwing an exception if not found
   * @param id - ID of the condition to find
   * @returns Promise resolving to the condition
   * @throws NotFoundException if the condition doesn't exist
   */
  async findById(id: string): Promise<Condition> {
    const condition = await this.conditionRepository.getById(id);
    if (!condition) {
      throw new NotFoundException(`Condition with ID ${id} not found`);
    }
    return condition;
  }

  /**
   * Retrieves all conditions for a specific requirement
   * @param requirementId - ID of the requirement
   * @returns Promise resolving to an array of conditions
   * @throws BadRequestException if the requirement doesn't exist
   */
  async listByRequirement(requirementId: string): Promise<Condition[]> {
    try {
      await this.requirementService.findById(requirementId);
      return this.conditionRepository.getByRequirement(requirementId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Requirement with ID ${requirementId} not found`);
      }
      throw error;
    }
  }

  /**
   * Retrieves all conditions for a specific use case
   * @param useCaseId - ID of the use case (can be Primary or Secondary)
   * @returns Promise resolving to an array of conditions
   * @throws BadRequestException if the use case doesn't exist
   */
  async listByUseCase(useCaseId: string): Promise<Condition[]> {
    try {
      await this.useCaseService.findById(useCaseId);
      return this.conditionRepository.getByUseCase(useCaseId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Use case with ID ${useCaseId} not found`);
      }
      throw error;
    }
  }

  /**
   * Removes a condition
   * @param id - ID of the condition to remove
   * @returns Promise resolving to a boolean indicating success
   * @throws NotFoundException if the condition doesn't exist
   */
  async remove(id: string): Promise<boolean> {
    const condition = await this.findById(id);
    if (!condition) {
      throw new NotFoundException(`Condition with ID ${id} not found`);
    }

    return this.conditionRepository.delete(id);
  }

  /**
   * Retrieves all conditions
   * @returns Promise resolving to an array of all conditions
   */
  async listAll(): Promise<Condition[]> {
    return this.conditionRepository.getAll();
  }
}
