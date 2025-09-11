import { Requirement } from "../entities/requirement.entity";
import { CreateRequirementInterface } from "./create-requirement.interface";

export interface RequirementFactoryInterface<
  T extends Requirement,
  C extends CreateRequirementInterface,
> {
  create(params: C): Promise<T>;
}
