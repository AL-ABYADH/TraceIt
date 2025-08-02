import { Injectable, NotImplementedException } from "@nestjs/common";
import { UseCaseRepositoryFactory } from "../../repositories/factory/use-case-repository.factory";
import { UseCase } from "../../entities/use-case.entity";
import { AddUseCaseParamsInterface } from "../../interfaces/add-use-case.interface";
import { UpdateUseCaseInterface } from "../../interfaces/update-use-case.interface";

@Injectable()
export class UseCaseService {
  constructor(private readonly repositoryFactory: UseCaseRepositoryFactory) {}

  async add(params: AddUseCaseParamsInterface): Promise<UseCase> {
    throw new NotImplementedException();
  }

  async listByProject(projectId: string): Promise<UseCase[]> {
    throw new NotImplementedException();
  }

  async update(id: string, params: UpdateUseCaseInterface): Promise<UseCase> {
    throw new NotImplementedException();
  }

  async remove(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }
}
