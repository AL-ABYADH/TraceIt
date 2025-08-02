import { Injectable, NotImplementedException } from "@nestjs/common";
import { ConcreteUseCaseRepositoryInterface } from "../interfaces/concrete-use-case-repository.interface";
import { UseCaseDiagram } from "../../entities/use-case-diagram.entity";
import { UseCaseDiagramModel, UseCaseDiagramModelType } from "../../models/use-case-diagram.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { CreateUseCaseInterface } from "../../interfaces/create-use-case.interface";
import { UpdateUseCaseInterface } from "../../interfaces/update-use-case.interface";

@Injectable()
export class UseCaseDiagramRepository
  implements ConcreteUseCaseRepositoryInterface<UseCaseDiagram>
{
  private diagramModel: UseCaseDiagramModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.diagramModel = UseCaseDiagramModel(neo4jService.getNeogma());
  }

  create(createDto: CreateUseCaseInterface): Promise<UseCaseDiagram> {
    throw new NotImplementedException();
  }

  update(updateDto: UpdateUseCaseInterface): Promise<UseCaseDiagram> {
    throw new NotImplementedException();
  }

  delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  getById(id: string): Promise<UseCaseDiagram | null> {
    throw new NotImplementedException();
  }

  getAll(): Promise<UseCaseDiagram[]> {
    throw new NotImplementedException();
  }
}
