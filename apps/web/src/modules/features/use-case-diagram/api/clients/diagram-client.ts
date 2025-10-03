import { http } from "@/services/api/http";
import { DiagramDetailDto, DiagramType, DiagramElementsDto } from "@repo/shared-schemas";
import { diagramEndpoints } from "../diagram-endpoints";

async function getUseCaseDiagram(projectId: string): Promise<DiagramDetailDto> {
  return http.get(diagramEndpoints.byRelation, {
    pathParams: { relationId: projectId },
    params: { type: DiagramType.USE_CASE },
  });
}

async function updateDiagram(id: string, diagram: DiagramElementsDto): Promise<void> {
  return http.put(diagramEndpoints.detail, { pathParams: { id }, body: diagram });
}

export const diagramClient = {
  getUseCaseDiagram,
  updateDiagram,
};
