import { Body, Controller, Post } from "@nestjs/common";
import { TraceabilityService } from "../services/traceability.service";
import { zodBody } from "../../../common/pipes/zod";
import {
  type EntityRelationshipRequestDto,
  postEntityWithRelationshipsSchemas,
} from "@repo/shared-schemas";

/**
 * Controller for managing entity traceability operations
 * Provides endpoints to retrieve entities with their relationships
 */
@Controller("traceability")
export class TraceabilityController {
  constructor(private readonly traceabilityService: TraceabilityService) {}

  @Post("relationships")
  async getEntityWithRelationships(
    @Body(zodBody(postEntityWithRelationshipsSchemas)) dto: EntityRelationshipRequestDto,
  ) {
    const label = await this.traceabilityService.getEntityLabel(dto.entityId);

    return this.traceabilityService.getEntityWithRelationships(
      label,
      dto.entityId,
      dto.projectId,
      dto.models,
    );
  }
}
