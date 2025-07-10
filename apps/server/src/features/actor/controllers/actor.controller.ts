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
import { AddActorParamsDto } from "../dtos/add-actor-params.dto";
import { UpdateActorDto } from "../dtos/update-actor.dto";

@Controller("actors")
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Post()
  async add(@Body() dto: AddActorParamsDto): Promise<Actor> {
    throw new NotImplementedException();
  }

  @Get()
  async listProjectActors(@Query("projectId") projectId: string): Promise<Actor[]> {
    throw new NotImplementedException();
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateActorDto): Promise<Actor> {
    throw new NotImplementedException();
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<{ success: boolean }> {
    throw new NotImplementedException();
  }
}
