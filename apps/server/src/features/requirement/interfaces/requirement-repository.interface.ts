import { Requirement } from "../entities/requirement.entity";

export interface RequirementRepositoryInterface<T extends Requirement> {
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<boolean>;
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  getByUseCase(useCaseId: string): Promise<T[]>;
  getByProject(projectId: string): Promise<T[]>;
}
