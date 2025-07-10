import { Injectable } from "@nestjs/common";
import { ActorModel, ActorModelType } from "../../models/actor.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";

@Injectable()
export class ActorRepository {
  private actorModel: ActorModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.actorModel = ActorModel(neo4jService.getNeogma());
  }
}
