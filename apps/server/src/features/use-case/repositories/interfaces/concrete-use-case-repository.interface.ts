import { UseCase } from "../../entities/use-case.entity";
import { CreateUseCaseInterface } from "../../interfaces/create-use-case.interface";
import { UpdateUseCaseInterface } from "../../interfaces/update-use-case.interface";

export interface ConcreteUseCaseRepositoryInterface<T extends UseCase> {
  create(createDto: CreateUseCaseInterface): Promise<T>;
  update(updateDto: UpdateUseCaseInterface): Promise<T>;
  delete(id: string): Promise<boolean>;
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
}
