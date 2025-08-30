import { Injectable, NotImplementedException } from "@nestjs/common";
import { ConcreteUseCaseRepositoryInterface } from "../interfaces/concrete-use-case-repository.interface";
import { UseCaseRelationship } from "../../entities/use-case-relationship.entity";
import {
  UseCaseRelationshipModel,
  UseCaseRelationshipModelType,
} from "../../models/use-case-relationship.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { UpdateUseCaseInterface } from "../../interfaces/update-use-case.interface";
import { CreateUseCaseInterface } from "../../interfaces/create-use-case.interface";

@Injectable()
export class UseCaseRelationshipRepository {
  private relationshipModel: UseCaseRelationshipModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.relationshipModel = UseCaseRelationshipModel(neo4jService.getNeogma());
  }

  create(createDto: CreateUseCaseInterface): Promise<UseCaseRelationship> {
    throw new NotImplementedException();
  }

  update(updateDto: UpdateUseCaseInterface): Promise<UseCaseRelationship> {
    throw new NotImplementedException();
  }

  delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  getById(id: string): Promise<UseCaseRelationship | null> {
    throw new NotImplementedException();
  }

  getAll(): Promise<UseCaseRelationship[]> {
    throw new NotImplementedException();
  }
}
