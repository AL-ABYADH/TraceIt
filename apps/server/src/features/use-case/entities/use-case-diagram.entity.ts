import { UseCase } from "./use-case.entity";

export class UseCaseDiagram extends UseCase {
  useCases: UseCase[];
  actors: any[];
  initial: object; // JSON
  final?: object; // JSON?
}
