import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ActorRepositoryFactory } from "../../repositories/factory/actor-repository.factory";
import { Actor } from "../../entities/actor.entity";
import { UpdateActorInterface } from "../../interfaces/update-actor.interface";
import { AddActorParamsInterface } from "../../interfaces/add-actor-params.interface";
import { ProjectService } from "../../../project/services/project/project.service";
import { ActorRepository } from "../../repositories/actor/actor.repository";
import { ActorSubtype } from "../../enums/actor-subtype.enum";
import { ActorType } from "../../enums/actor-type.enum";

@Injectable()
export class ActorService {
  constructor(
    private readonly repositoryFactory: ActorRepositoryFactory,
    private readonly projectService: ProjectService,
    private readonly actorRepo: ActorRepository,
  ) {}

  async add(actor: AddActorParamsInterface): Promise<Actor> {
    // Verify project exists
    await this.projectService.findById(actor.projectId);

    // Get appropriate repository based on actor type
    const repository = this.repositoryFactory.getConcreteRepository(actor.subType);

    // Create the actor
    return repository.create({
      name: actor.name,
      projectId: actor.projectId,
    });
  }

  async listProjectActors(projectId: string): Promise<Actor[]> {
    return this.actorRepo.getAllByProject(projectId);
  }

  async listProjectActorsBySubtype(projectId: string, subtype: ActorSubtype): Promise<Actor[]> {
    await this.projectService.findById(projectId);

    return this.actorRepo.getByProjectAndSubtype(projectId, subtype);
  }

  async listProjectActorsByType(projectId: string, type: ActorType): Promise<Actor[]> {
    await this.projectService.findById(projectId);

    return this.actorRepo.getByProjectAndType(projectId, type);
  }

  async update(actorId: string, actorData: UpdateActorInterface): Promise<Actor> {
    // Find the actor to determine its type
    const actor = await this.findById(actorId);

    if (actor.name === actorData.name) {
      throw new BadRequestException("Cannot update actor: the name is already in use.");
    }

    // Get the appropriate repository
    const repository = this.repositoryFactory.getConcreteRepository(actor.subtype);

    // Update the actor
    return repository.update(actorId, actorData);
  }

  async remove(id: string): Promise<boolean> {
    const actor = await this.findById(id);
    const repository = this.repositoryFactory.getConcreteRepository(actor.subtype);
    return repository.delete(id);
  }

  public async findById(id: string): Promise<Actor> {
    const actor = await this.actorRepo.getById(id);
    if (!actor) {
      throw new NotFoundException(`Actor with ID ${id} not found`);
    }
    return actor;
  }
}
