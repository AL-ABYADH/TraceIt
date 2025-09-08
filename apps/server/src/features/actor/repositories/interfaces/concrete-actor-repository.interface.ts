import { Actor } from "../../entities/actor.entity";
import { CreateActorInterface } from "../../interfaces/create-actor.interface";
import { UpdateActorInterface } from "../../interfaces/update-actor.interface";

export interface ConcreteActorRepositoryInterface<T extends Actor> {
  create(createActorInterface: CreateActorInterface): Promise<T>;
  update(id: string, updateActorInterface: UpdateActorInterface): Promise<T[]>;
  delete(id: string): Promise<boolean>;
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
}
