import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ActorService } from "../services/actor/actor.service";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
import {
  actorTypeSchema,
  type AddActorDto,
  addActorSchema,
  type SubTypeActorDto,
  actorSubtypeSchema,
  type UpdateActorDto,
  updateActorSchema,
  type UuidParamsDto,
  uuidParamsSchema,
  ActorDto,
  type ActorIdDto,
  actorIdSchema,
} from "@repo/shared-schemas";
import { ActorSubtype } from "../enums/actor-subtype.enum";
import { ActorType } from "../enums/actor-type.enum";

@Controller("actors")
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  /**
   * Add a new actor
   */
  @Post()
  async add(@Body(zodBody(addActorSchema)) dto: AddActorDto): Promise<ActorDto> {
    const newDto = {
      name: dto.name,
      projectId: dto.projectId,
      subType: dto.subType,
    };
    return this.actorService.add(newDto);
  }

  /**
   * Retrieve all actors for a specific project by subtype
   */
  @Get("subtype/:subtype")
  async listProjectActorsBySubtype(
    @Query(zodQuery(actorIdSchema)) params: ActorIdDto,
    @Param(zodParam(actorSubtypeSchema)) subtype: SubTypeActorDto,
  ): Promise<ActorDto[]> {
    return this.actorService.listProjectActorsBySubtype(
      params.actorId,
      subtype as unknown as ActorSubtype,
    );
  }

  /**
   * Retrieve all actors for a specific project by type
   */
  @Get("type/:type")
  async listProjectActorsByType(
    @Query(zodQuery(uuidParamsSchema)) params: UuidParamsDto,
    @Param(zodParam(actorTypeSchema)) type: ActorType,
  ): Promise<ActorDto[]> {
    return this.actorService.listProjectActorsByType(params.id, type as unknown as ActorType);
  }

  /**
   * Retrieve all actors for a specific project
   */
  @Get()
  async listProjectActors(@Query(zodQuery(actorIdSchema)) params: ActorIdDto): Promise<ActorDto[]> {
    return this.actorService.listProjectActors(params.actorId);
  }

  /**
   * Update an existing actor
   */
  @Put(":actorId")
  async update(
    @Param(zodParam(uuidParamsSchema)) params: ActorIdDto,
    @Body(zodBody(updateActorSchema)) dto: UpdateActorDto,
  ): Promise<ActorDto> {
    return this.actorService.update(params.actorId, dto);
  }

  /**
   * Delete an actor
   */
  @Delete(":actorId")
  async remove(@Param(zodParam(actorIdSchema)) params: ActorIdDto): Promise<{ success: boolean }> {
    const success = await this.actorService.remove(params.actorId);
    return { success };
  }
}
