import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ActorService } from "../services/actor/actor.service";
import { Actor } from "../entities/actor.entity";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
import {
  type AddActorDto,
  addActorSchema,
  type UpdateActorDto,
  updateActorSchema,
  type UuidParamsDto,
  uuidParamsSchema,
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
  async add(@Body(zodBody(addActorSchema)) dto: AddActorDto): Promise<Actor> {
    const newDto = {
      name: dto.name,
      projectId: dto.projectId,
      subType: dto.subType as ActorSubtype,
    };
    return this.actorService.add(newDto);
  }

  /**
   * Retrieve all actors for a specific project by subtype
   */
  @Get("subtype/:subtype")
  async listProjectActorsBySubtype(
    @Query(zodQuery(uuidParamsSchema)) params: UuidParamsDto,
    @Param("subtype", new ParseEnumPipe(ActorSubtype)) subtype: ActorSubtype,
  ): Promise<Actor[]> {
    return this.actorService.listProjectActorsBySubtype(params.id, subtype);
  }

  /**
   * Retrieve all actors for a specific project by type
   */
  @Get("type/:type")
  async listProjectActorsByType(
    @Query(zodQuery(uuidParamsSchema)) params: UuidParamsDto,
    @Param("type", new ParseEnumPipe(ActorType)) type: ActorType,
  ): Promise<Actor[]> {
    return this.actorService.listProjectActorsByType(params.id, type);
  }

  /**
   * Retrieve all actors for a specific project
   */
  @Get()
  async listProjectActors(
    @Query(zodQuery(uuidParamsSchema)) params: UuidParamsDto,
  ): Promise<Actor[]> {
    return this.actorService.listProjectActors(params.id);
  }

  /**
   * Update an existing actor
   */
  @Put(":id")
  async update(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateActorSchema)) dto: UpdateActorDto,
  ): Promise<Actor> {
    return this.actorService.update(params.id, dto);
  }

  /**
   * Delete an actor
   */
  @Delete(":id")
  async remove(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    const success = await this.actorService.remove(params.id);
    return { success };
  }
}
