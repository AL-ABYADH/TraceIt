import { Injectable } from "@nestjs/common";
import { UseCaseModel, UseCaseModelType } from "../../models/use-case.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";

@Injectable()
export class UseCaseRepository {
  private useCaseModel: UseCaseModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.useCaseModel = UseCaseModel(neo4jService.getNeogma());
  }
}
