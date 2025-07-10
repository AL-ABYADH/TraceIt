import { Injectable, NotImplementedException } from "@nestjs/common";
import { ActorRepositoryFactory } from "../../repositories/factory/actor-repository.factory";
import { Actor } from "../../entities/actor.entity";
import { UpdateActorInterface } from "../../interfaces/update-actor.interface";
import { AddActorParamsInterface } from "../../interfaces/add-actor-params.interface";

@Injectable()
export class ActorService {
  constructor(private readonly repositoryFactory: ActorRepositoryFactory) {}

  async add(actor: AddActorParamsInterface): Promise<Actor> {
    throw new NotImplementedException();
  }

  async listProjectActors(projectId: string): Promise<Actor[]> {
    throw new NotImplementedException();
  }

  async update(id: string, actor: UpdateActorInterface): Promise<Actor> {
    throw new NotImplementedException();
  }

  async remove(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }
}
