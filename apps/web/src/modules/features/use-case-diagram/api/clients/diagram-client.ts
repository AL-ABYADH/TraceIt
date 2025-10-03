import { http } from "@/services/api/http";
import {
  DiagramDetailDto,
  DiagramType,
  DiagramElementsDto,
  DiagramListDto,
  CreateDiagramDto,
} from "@repo/shared-schemas";
import { diagramEndpoints } from "../diagram-endpoints";

async function getDiagramByRelation(
  relationId: string,
  type: DiagramType,
): Promise<DiagramDetailDto> {
  return http.get(diagramEndpoints.byRelation, {
    pathParams: { relationId },
    params: { type },
  });
}

async function updateDiagram(id: string, diagram: DiagramElementsDto): Promise<void> {
  return http.put(diagramEndpoints.detail, { pathParams: { id }, body: diagram });
}

async function createDiagram(diagram: CreateDiagramDto): Promise<DiagramListDto> {
  return http.post(diagramEndpoints.list, { body: diagram });
}

export const diagramClient = {
  getDiagramByRelation,
  updateDiagram,
  createDiagram,
};
