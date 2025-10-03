"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addNode,
  loadFlowData,
  onConnect,
  selectDiagramId,
  selectEdges,
  selectNodes,
} from "@/modules/core/flow/store/flow-slice";
import { useUseCaseDiagram } from "../hooks/useUseCaseDiagram";
import { Connection } from "@xyflow/react";
import Button from "@/components/Button";
import { useParams } from "next/navigation";
import UseCaseSelection from "./UseCasesSelection";
import ActorSelection from "./ActorsSelection";
import { DiagramElementsDto, EdgeType, NodeType } from "@repo/shared-schemas";
import UseCaseEdgeTypesSelection from "./UseCaseEdgeTypesSelection";
import Flow from "@/modules/core/flow/components/Flow";
import { useUpdateDiagram } from "../hooks/useUpdateDiagram";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";

export default function UseCaseDiagramFlow() {
  const params = useParams<"/projects/[project-id]/use-case-diagram">();
  const projectId = params["project-id"];

  const [isUseCasesDialogOpen, setIsUseCasesDialogOpen] = useState(false);
  const [isActorsDialogOpen, setIsActorsDialogOpen] = useState(false);
  const [isEdgeTypeDialogOpen, setIsEdgeTypeDialogOpen] = useState(false);

  const [newConnection, setNewConnection] = useState<Connection | null>(null);

  const dispatch = useDispatch();

  const nodes = useSelector(selectNodes);
  const edges = useSelector(selectEdges);
  const diagramId = useSelector(selectDiagramId);

  const updateDiagramMutation = useUpdateDiagram({ diagramId: diagramId! });

  const handleConnect = (conn: Connection) => {
    const sourceNode = nodes.find((node) => node.id === conn.source);
    const targetNode = nodes.find((node) => node.id === conn.target);

    const edge = edges.find(
      (edge) =>
        (edge.source === conn.source && edge.target === conn.target) ||
        (edge.source === conn.target && edge.target === conn.source),
    );

    if (edge || conn.source === conn.target || targetNode?.type === NodeType.ACTOR) return;

    if (sourceNode?.type === NodeType.USE_CASE && targetNode?.type === NodeType.USE_CASE) {
      setNewConnection(conn);
      setIsEdgeTypeDialogOpen(true);
      return;
    }

    dispatch(onConnect({ ...conn, type: EdgeType.ASSOCIATION }));
  };

  const handleSave = (elements: DiagramElementsDto) => {
    if (diagramId === null) return;
    updateDiagramMutation.mutate(elements);
  };

  const { data, isLoading, isError, error } = useUseCaseDiagram(projectId);

  useEffect(() => {
    if (data) {
      dispatch(
        loadFlowData({
          nodes: data.nodes,
          edges: data.edges,
          diagramId: data.id,
        }),
      );
    }
  }, [data, dispatch]);

  if (isLoading) {
    return <Loading isOpen={isLoading} message="Loading use case diagram..." mode="dialog" />;
  }

  if (isError) {
    return <ErrorMessage message={`Error loading use case diagram: ${error!.message}`} />;
  }

  return (
    <>
      {updateDiagramMutation.isError && (
        <ErrorMessage
          message={`Failed to save diagram: ${
            (updateDiagramMutation.error as any)?.message ?? "Unknown error"
          }`}
        />
      )}

      <UseCaseSelection
        isOpen={isUseCasesDialogOpen}
        onClose={() => setIsUseCasesDialogOpen(false)}
        projectId={projectId}
        onUseCaseClick={(useCase) => dispatch(addNode({ type: NodeType.USE_CASE, data: useCase }))}
      />
      <ActorSelection
        isOpen={isActorsDialogOpen}
        onClose={() => setIsActorsDialogOpen(false)}
        projectId={projectId}
        onActorClick={(actor) => dispatch(addNode({ type: NodeType.ACTOR, data: actor }))}
      />
      <UseCaseEdgeTypesSelection
        onClose={() => setIsEdgeTypeDialogOpen(false)}
        isOpen={isEdgeTypeDialogOpen}
        onUseCaseEdgeTypesClick={(type) => {
          if (!newConnection) return;
          dispatch(onConnect({ ...newConnection, type }));
        }}
      />

      <Button onClick={() => setIsUseCasesDialogOpen(true)}>Add Use Case</Button>
      <Button
        onClick={() => {
          setIsActorsDialogOpen(true);
        }}
      >
        Add Use Actor
      </Button>
      <Flow
        onConnect={handleConnect}
        onSave={handleSave}
        isSaving={updateDiagramMutation.isPending}
      />
    </>
  );
}
