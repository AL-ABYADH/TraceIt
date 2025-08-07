import {
  Body,
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Param,
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
// import { AddActorParamsDto } from "../dtos/add-actor-params.dto";
// import { UpdateActorDto } from "../dtos/update-actor.dto";

@Controller("actors")
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Post()
  async add(@Body(zodBody(addActorSchema)) dto: AddActorDto): Promise<Actor> {
    throw new NotImplementedException();
  }

  @Get()
  async listProjectActors(
    @Query(zodQuery(uuidParamsSchema)) projectId: UuidParamsDto,
  ): Promise<Actor[]> {
    throw new NotImplementedException();
  }

  @Put(":id")
  async update(
    @Param(zodParam(uuidParamsSchema)) actorId: UuidParamsDto,
    @Body(zodBody(updateActorSchema)) dto: UpdateActorDto,
  ): Promise<Actor> {
    throw new NotImplementedException();
  }

  @Delete(":id")
  async remove(
    @Param(zodParam(uuidParamsSchema)) actorId: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    throw new NotImplementedException();
  }
}
