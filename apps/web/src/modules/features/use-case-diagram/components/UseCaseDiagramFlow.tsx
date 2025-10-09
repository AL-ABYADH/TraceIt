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
import { Connection } from "@xyflow/react";
import UseCaseSelection from "./UseCasesSelection";
import ActorSelection from "./ActorsSelection";
import {
  DiagramDetailDto,
  DiagramType,
  DiagramElementsDto,
  EdgeType,
  NodeType,
  UseCaseListDto,
  ActorDto,
} from "@repo/shared-schemas";
import UseCaseEdgeTypesSelection from "./UseCaseEdgeTypesSelection";
import Flow from "@/modules/core/flow/components/Flow";
import { useUpdateDiagram } from "../hooks/useUpdateDiagram";
import ErrorMessage from "@/components/ErrorMessage";

export default function UseCaseDiagramFlow({ diagram }: { diagram: DiagramDetailDto }) {
  const [isUseCasesDialogOpen, setIsUseCasesDialogOpen] = useState(false);
  const [isActorsDialogOpen, setIsActorsDialogOpen] = useState(false);
  const [isEdgeTypeDialogOpen, setIsEdgeTypeDialogOpen] = useState(false);
  const [newConnection, setNewConnection] = useState<Connection | null>(null);

  const dispatch = useDispatch();
  const nodes = useSelector(selectNodes);
  const edges = useSelector(selectEdges);
  const diagramId = useSelector(selectDiagramId);

  const updateDiagramMutation = useUpdateDiagram({ diagramId: diagramId! });

  const handleAddNode = (nodeType: NodeType) => {
    switch (nodeType) {
      case NodeType.USE_CASE:
        setIsUseCasesDialogOpen(true);
        break;
      case NodeType.ACTOR:
        setIsActorsDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleAddUseCase = (useCase: UseCaseListDto) => {
    dispatch(addNode({ type: NodeType.USE_CASE, data: useCase }));
  };

  const handleAddActor = (actor: ActorDto) => {
    dispatch(addNode({ type: NodeType.ACTOR, data: actor }));
  };

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

  useEffect(() => {
    dispatch(
      loadFlowData({
        nodes: diagram.nodes,
        edges: diagram.edges,
        diagramId: diagram.id,
      }),
    );
  }, [diagram, dispatch]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {updateDiagramMutation.isError && (
        <ErrorMessage
          message={`Failed to save diagram: ${
            (updateDiagramMutation.error as any)?.message ?? "Unknown error"
          }`}
        />
      )}

      {/* Dialogs */}
      <UseCaseSelection
        isOpen={isUseCasesDialogOpen}
        onClose={() => setIsUseCasesDialogOpen(false)}
        onUseCaseClick={(useCase) => handleAddUseCase(useCase)}
      />
      <ActorSelection
        isOpen={isActorsDialogOpen}
        onClose={() => setIsActorsDialogOpen(false)}
        onActorClick={(actor) => handleAddActor(actor)}
      />
      <UseCaseEdgeTypesSelection
        onClose={() => setIsEdgeTypeDialogOpen(false)}
        isOpen={isEdgeTypeDialogOpen}
        onUseCaseEdgeTypesClick={(type) => {
          if (!newConnection) return;
          dispatch(onConnect({ ...newConnection, type }));
        }}
      />

      {/* The Flow itself fills remaining height */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Flow
          onConnect={handleConnect}
          onAddNode={handleAddNode}
          onSave={handleSave}
          isSaving={updateDiagramMutation.isPending}
          type={DiagramType.USE_CASE}
        />
      </div>
    </div>
  );
}
