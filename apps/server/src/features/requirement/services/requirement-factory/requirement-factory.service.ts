import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { RequirementType } from "../../enums/requirement-type.enum";
import { RequirementRepositoryFactory } from "../../repositories/factory/requirement-repository.factory";
import { UseCaseService } from "../../../use-case/services/use-case/use-case.service";
import { ProjectService } from "../../../project/services/project/project.service";
import { ActorService } from "../../../actor/services/actor/actor.service";
import { ActorSubtype } from "../../../actor/enums/actor-subtype.enum";

// Import all create interfaces
import {
  CreateRequirementInterface,
  CreateSystemRequirementInterface,
  CreateEventSystemRequirementInterface,
  CreateActorRequirementInterface,
  CreateSystemActorCommunicationRequirementInterface,
  CreateConditionalRequirementInterface,
  CreateRecursiveRequirementInterface,
  CreateUseCaseReferenceRequirementInterface,
  CreateLogicalGroupRequirementInterface,
  CreateConditionalGroupRequirementInterface,
  CreateSimultaneousRequirementInterface,
  CreateExceptionalRequirementInterface,
} from "../../interfaces/create-requirement.interface";

// Import all entities
import { Requirement } from "../../entities";

@Injectable()
export class RequirementFactoryService {
  constructor(
    private readonly repositoryFactory: RequirementRepositoryFactory,
    private readonly useCaseService: UseCaseService,
    private readonly projectService: ProjectService,
    private readonly actorService: ActorService,
  ) {}

  /**
   * Creates a requirement based on its type
   */
  async create(type: RequirementType, params: any): Promise<Requirement> {
    // Validate common parameters
    await this.validateCommonParams(params);

    // Validate type-specific parameters
    await this.validateTypeSpecificParams(type, params);

    // Get the appropriate repository
    const repository = this.repositoryFactory.getConcreteRepository(type);

    // Create the requirement
    return repository.create(params);
  }

  /**
   * Validates parameters common to all requirement types
   */
  private async validateCommonParams(params: CreateRequirementInterface): Promise<void> {
    // Check if use case exists
    await this.useCaseService.findById(params.useCaseId);

    // Check if project exists
    await this.projectService.findById(params.projectId);

    // Validate depth is a non-negative integer
    if (params.depth < 0 || !Number.isInteger(params.depth)) {
      throw new BadRequestException("Depth must be a non-negative integer");
    }
  }

  /**
   * Validates parameters specific to each requirement type
   */
  private async validateTypeSpecificParams(type: RequirementType, params: any): Promise<void> {
    switch (type) {
      case RequirementType.SYSTEM_REQUIREMENT:
        this.validateSystemRequirementParams(params as CreateSystemRequirementInterface);
        break;

      case RequirementType.EVENT_SYSTEM_REQUIREMENT:
        await this.validateEventSystemRequirementParams(
          params as CreateEventSystemRequirementInterface,
        );
        break;

      case RequirementType.ACTOR_REQUIREMENT:
        await this.validateActorRequirementParams(params as CreateActorRequirementInterface);
        break;

      case RequirementType.SYSTEM_ACTOR_COMMUNICATION_REQUIREMENT:
        await this.validateSystemActorCommunicationRequirementParams(
          params as CreateSystemActorCommunicationRequirementInterface,
        );
        break;

      case RequirementType.CONDITIONAL_REQUIREMENT:
        await this.validateConditionalRequirementParams(
          params as CreateConditionalRequirementInterface,
        );
        break;

      case RequirementType.RECURSIVE_REQUIREMENT:
        await this.validateRecursiveRequirementParams(
          params as CreateRecursiveRequirementInterface,
        );
        break;

      case RequirementType.USE_CASE_REFERENCE_REQUIREMENT:
        await this.validateUseCaseReferenceRequirementParams(
          params as CreateUseCaseReferenceRequirementInterface,
        );
        break;

      case RequirementType.LOGICAL_GROUP_REQUIREMENT:
        await this.validateLogicalGroupRequirementParams(
          params as CreateLogicalGroupRequirementInterface,
        );
        break;

      case RequirementType.CONDITIONAL_GROUP_REQUIREMENT:
        await this.validateConditionalGroupRequirementParams(
          params as CreateConditionalGroupRequirementInterface,
        );
        break;

      case RequirementType.SIMULTANEOUS_REQUIREMENT:
        await this.validateSimultaneousRequirementParams(
          params as CreateSimultaneousRequirementInterface,
        );
        break;

      case RequirementType.EXCEPTIONAL_REQUIREMENT:
        await this.validateExceptionalRequirementParams(
          params as CreateExceptionalRequirementInterface,
        );
        break;

      default:
        throw new BadRequestException(`Invalid requirement type: ${type}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /**
   * Fetch labels for a requirement or throw if none.
   */
  private async getLabelsOrThrow(id: string, notFoundMsg?: string): Promise<string[]> {
    const labels = await this.repositoryFactory.getAbstractRepository().getLabelsById(id);
    if (!labels || labels.length === 0) {
      throw new NotFoundException(notFoundMsg ?? `Requirement with ID ${id} has no labels`);
    }
    return labels;
  }

  /**
   * Fetch last (most concrete) label for a requirement or throw.
   */
  private async getLastLabelOrThrow(id: string, notFoundMsg?: string): Promise<string> {
    const labels = await this.getLabelsOrThrow(id, notFoundMsg);
    const lastLabel = labels.at(-1);
    if (!lastLabel) {
      throw new NotFoundException(notFoundMsg ?? `Requirement with ID ${id} has no labels`);
    }
    return lastLabel;
  }

  /**
   * Whether labels set indicates a SimpleRequirement.
   */
  private isSimpleRequirement(labels: string[]): boolean {
    return labels.includes("SimpleRequirement");
  }

  /**
   * Assert a string starts with a Unicode letter.
   */
  private assertUnicodeLetterStart(value: string, fieldName: string): void {
    if (!/^\p{L}/u.test(value)) {
      throw new BadRequestException(`${fieldName} must start with a letter`);
    }
  }

  /**
   * Validates actor IDs ensuring they exist and are of the correct type
   */
  async validateActorIds(actorIds: string[], allowedSubtypes?: ActorSubtype[]): Promise<void> {
    for (const actorId of actorIds) {
      const actor = await this.actorService.findById(actorId);
      if (allowedSubtypes && !allowedSubtypes.includes(actor.subtype)) {
        throw new BadRequestException(
          `Actor with ID ${actorId} is of type ${actor.subtype}, but must be one of: ${allowedSubtypes.join(", ")}`,
        );
      }
    }
  }

  /**
   * Validates that a requirement exists
   */
  async validateRequirementId(requirementId: string): Promise<void> {
    const requirement = await this.repositoryFactory.getAbstractRepository().getById(requirementId);
    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${requirementId} not found`);
    }
  }

  // ---------------------------------------------------------------------------
  // Validation methods for specific requirement types
  // ---------------------------------------------------------------------------

  private validateSystemRequirementParams(params: CreateSystemRequirementInterface): void {
    if (!params.operation) {
      throw new BadRequestException("Operation is required for system requirements");
    }
    if (params.operation.length > 100) {
      throw new BadRequestException("Operation must not exceed 100 characters");
    }
    // Unicode-friendly check
    this.assertUnicodeLetterStart(params.operation, "Operation");
  }

  private async validateEventSystemRequirementParams(
    params: CreateEventSystemRequirementInterface,
  ): Promise<void> {
    // Validate operation as in system requirement
    this.validateSystemRequirementParams(params);

    // Validate that event actor exists and is of type EVENT
    const actor = await this.actorService.findById(params.eventActorId);
    if (actor.subtype !== ActorSubtype.EVENT) {
      throw new BadRequestException(`Actor with ID ${params.eventActorId} must be of type EVENT`);
    }
  }

  private async validateActorRequirementParams(
    params: CreateActorRequirementInterface,
  ): Promise<void> {
    // Validate operation
    if (!params.operation) {
      throw new BadRequestException("Operation is required for actor requirements");
    }
    if (params.operation.length > 100) {
      throw new BadRequestException("Operation must not exceed 100 characters");
    }
    this.assertUnicodeLetterStart(params.operation, "Operation");

    // Validate that actor IDs exist and are not of type EVENT
    if (!params.actorIds || params.actorIds.length === 0) {
      throw new BadRequestException("At least one actor is required for actor requirements");
    }

    await this.validateActorIds(params.actorIds, [
      ActorSubtype.HUMAN,
      ActorSubtype.SOFTWARE,
      ActorSubtype.HARDWARE,
      ActorSubtype.AI_AGENT,
    ]);
  }

  private async validateSystemActorCommunicationRequirementParams(
    params: CreateSystemActorCommunicationRequirementInterface,
  ): Promise<void> {
    // Validate communication info
    if (!params.communicationInfo) {
      throw new BadRequestException("Communication info is required");
    }
    if (params.communicationInfo.length > 200) {
      throw new BadRequestException("Communication info must not exceed 200 characters");
    }

    // Validate communication facility
    if (!params.communicationFacility) {
      throw new BadRequestException("Communication facility is required");
    }
    if (params.communicationFacility.length > 30) {
      throw new BadRequestException("Communication facility must not exceed 30 characters");
    }

    // Validate that actor IDs exist and are of type HUMAN
    if (!params.actorIds || params.actorIds.length === 0) {
      throw new BadRequestException(
        "At least one actor is required for system-actor communication requirements",
      );
    }

    await this.validateActorIds(params.actorIds, [ActorSubtype.HUMAN]);
  }

  private async validateConditionalRequirementParams(
    params: CreateConditionalRequirementInterface,
  ): Promise<void> {
    // Validate condition
    if (!params.condition) {
      throw new BadRequestException("Condition is required");
    }
    if (params.condition.length > 50) {
      throw new BadRequestException("Condition must not exceed 50 characters");
    }

    // Validate that requirement ID exists
    await this.validateRequirementId(params.requirementId);

    // Ensure referenced requirement is not exceptional/conditional-group/conditional
    const last = await this.getLastLabelOrThrow(params.requirementId);
    if (
      ["ExceptionalRequirement", "ConditionalGroupRequirement", "ConditionalRequirement"].includes(
        last,
      )
    ) {
      throw new BadRequestException(
        "Conditional requirement cannot reference an exceptional, conditional group, or another conditional requirement",
      );
    }
  }

  private async validateRecursiveRequirementParams(
    params: CreateRecursiveRequirementInterface,
  ): Promise<void> {
    // Validate that requirement ID exists
    await this.validateRequirementId(params.requirementId);
  }

  private async validateUseCaseReferenceRequirementParams(
    params: CreateUseCaseReferenceRequirementInterface,
  ): Promise<void> {
    // Validate that referenced use case exists
    try {
      await this.useCaseService.findById(params.referencedUseCaseId);
    } catch (error) {
      throw new BadRequestException(
        `Referenced use case with ID ${params.referencedUseCaseId} not found`,
      );
    }
  }

  private async validateLogicalGroupRequirementParams(
    params: CreateLogicalGroupRequirementInterface,
  ): Promise<void> {
    // Validate that main requirement exists and is a simple requirement
    await this.validateRequirementId(params.mainRequirementId);

    const mainLabels = await this.getLabelsOrThrow(
      params.mainRequirementId,
      `Requirement with ID ${params.mainRequirementId} has no labels`,
    );
    const lastMain = mainLabels.at(-1)!;

    // Check that main requirement is a simple requirement of the allowed types
    if (
      !this.isSimpleRequirement(mainLabels) ||
      [
        "SystemActorCommunicationRequirement",
        "RecursiveRequirement",
        "UseCaseReferenceRequirement",
      ].includes(lastMain)
    ) {
      throw new BadRequestException(
        "Main requirement cannot be a system-actor communication, recursive, composite, or use case reference requirement",
      );
    }

    // Validate that detail requirements exist
    if (!params.detailRequirementIds || params.detailRequirementIds.length < 2) {
      throw new BadRequestException("At least two detail requirements are required");
    }

    // Validate each detail requirement
    for (const requirementId of params.detailRequirementIds) {
      await this.validateRequirementId(requirementId);

      const labels = await this.getLabelsOrThrow(
        requirementId,
        `Requirement with ID ${requirementId} has no labels`,
      );
      const last = labels.at(-1)!;

      // Check that detail requirements are not recursive or logical group requirements
      if (["RecursiveRequirement", "LogicalGroupRequirement"].includes(last)) {
        throw new BadRequestException(
          "Detail requirements cannot be recursive or logical group requirements",
        );
      }
    }

    // Check that the first detail requirement is not an exceptional requirement
    if (params.detailRequirementIds.length > 0 && params.detailRequirementIds[0]) {
      const firstLabels = await this.getLabelsOrThrow(params.detailRequirementIds[0]);
      const lastFirst = firstLabels.at(-1)!;
      if (lastFirst === "ExceptionalRequirement") {
        throw new BadRequestException(
          "First detail requirement cannot be an exceptional requirement",
        );
      }
    }
  }

  private async validateConditionalGroupRequirementParams(
    params: CreateConditionalGroupRequirementInterface,
  ): Promise<void> {
    // Validate conditional value
    if (!params.conditionalValue) {
      throw new BadRequestException("Conditional value is required");
    }
    if (params.conditionalValue.length > 50) {
      throw new BadRequestException("Conditional value must not exceed 50 characters");
    }

    // Validate that primary condition exists and is a conditional requirement
    await this.validateRequirementId(params.primaryConditionId);
    const primaryLast = await this.getLastLabelOrThrow(params.primaryConditionId);
    if (primaryLast !== "ConditionalRequirement") {
      throw new BadRequestException("Primary condition must be a conditional requirement");
    }

    // Validate that alternative conditions exist
    if (!params.alternativeConditionIds || params.alternativeConditionIds.length === 0) {
      throw new BadRequestException("At least one alternative condition is required");
    }

    // Validate each alternative condition
    for (const conditionId of params.alternativeConditionIds) {
      await this.validateRequirementId(conditionId);
      const last = await this.getLastLabelOrThrow(conditionId);
      if (last !== "ConditionalRequirement") {
        throw new BadRequestException("Alternative conditions must be conditional requirements");
      }
    }

    // Validate fallback condition if provided
    if (params.fallbackConditionId) {
      await this.validateRequirementId(params.fallbackConditionId);
    }
  }

  private async validateSimultaneousRequirementParams(
    params: CreateSimultaneousRequirementInterface,
  ): Promise<void> {
    // Validate that simple requirements exist
    if (!params.simpleRequirementIds || params.simpleRequirementIds.length < 2) {
      throw new BadRequestException("At least two simple requirements are required");
    }

    // Validate each simple requirement
    for (const requirementId of params.simpleRequirementIds) {
      await this.validateRequirementId(requirementId);
      const labels = await this.getLabelsOrThrow(requirementId);
      if (!this.isSimpleRequirement(labels)) {
        throw new BadRequestException("Requirements must be simple requirements");
      }
    }
  }

  private async validateExceptionalRequirementParams(
    params: CreateExceptionalRequirementInterface,
  ): Promise<void> {
    // Validate exception
    if (!params.exception) {
      throw new BadRequestException("Exception is required");
    }
    if (params.exception.length > 100) {
      throw new BadRequestException("Exception must not exceed 100 characters");
    }

    // Validate that requirements exist
    if (!params.requirementIds || params.requirementIds.length === 0) {
      throw new BadRequestException("At least one requirement is required");
    }

    // Validate each requirement
    for (const requirementId of params.requirementIds) {
      await this.validateRequirementId(requirementId);
      const last = await this.getLastLabelOrThrow(requirementId);

      // Check that requirements are not logical group or exceptional requirements
      if (["LogicalGroupRequirement", "ExceptionalRequirement"].includes(last)) {
        throw new BadRequestException(
          "Requirements within an exceptional requirement cannot be logical group or exceptional requirements",
        );
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Factory methods for creating specific requirement types
  // ---------------------------------------------------------------------------

  async createSystemRequirement(params: CreateSystemRequirementInterface): Promise<Requirement> {
    return this.create(RequirementType.SYSTEM_REQUIREMENT, params);
  }

  async createEventSystemRequirement(
    params: CreateEventSystemRequirementInterface,
  ): Promise<Requirement> {
    return this.create(RequirementType.EVENT_SYSTEM_REQUIREMENT, params);
  }

  async createActorRequirement(params: CreateActorRequirementInterface): Promise<Requirement> {
    return this.create(RequirementType.ACTOR_REQUIREMENT, params);
  }

  async createSystemActorCommunicationRequirement(
    params: CreateSystemActorCommunicationRequirementInterface,
  ): Promise<Requirement> {
    return this.create(RequirementType.SYSTEM_ACTOR_COMMUNICATION_REQUIREMENT, params);
  }

  async createConditionalRequirement(
    params: CreateConditionalRequirementInterface,
  ): Promise<Requirement> {
    return this.create(RequirementType.CONDITIONAL_REQUIREMENT, params);
  }

  async createRecursiveRequirement(
    params: CreateRecursiveRequirementInterface,
  ): Promise<Requirement> {
    return this.create(RequirementType.RECURSIVE_REQUIREMENT, params);
  }

  async createUseCaseReferenceRequirement(
    params: CreateUseCaseReferenceRequirementInterface,
  ): Promise<Requirement> {
    return this.create(RequirementType.USE_CASE_REFERENCE_REQUIREMENT, params);
  }

  async createLogicalGroupRequirement(
    params: CreateLogicalGroupRequirementInterface,
  ): Promise<Requirement> {
    return this.create(RequirementType.LOGICAL_GROUP_REQUIREMENT, params);
  }

  async createConditionalGroupRequirement(
    params: CreateConditionalGroupRequirementInterface,
  ): Promise<Requirement> {
    return this.create(RequirementType.CONDITIONAL_GROUP_REQUIREMENT, params);
  }

  async createSimultaneousRequirement(
    params: CreateSimultaneousRequirementInterface,
  ): Promise<Requirement> {
    return this.create(RequirementType.SIMULTANEOUS_REQUIREMENT, params);
  }

  async createExceptionalRequirement(
    params: CreateExceptionalRequirementInterface,
  ): Promise<Requirement> {
    return this.create(RequirementType.EXCEPTIONAL_REQUIREMENT, params);
  }
}
