"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addNode,
  loadFlowData,
  onConnect,
  selectEdges,
  selectNodes,
} from "@/modules/core/flow/store/flow-slice";
import { Connection } from "@xyflow/react";
import UseCaseSelection from "./UseCasesSelection";
import ActorSelection from "./ActorsSelection";
import {
  DiagramDetailDto,
  DiagramType,
  EdgeType,
  NodeType,
  UseCaseListDto,
  ActorDto,
} from "@repo/shared-schemas";
import UseCaseEdgeTypesSelection from "./UseCaseEdgeTypesSelection";
import Flow from "@/modules/core/flow/components/Flow";

export default function UseCaseDiagramFlow({ diagram }: { diagram: DiagramDetailDto }) {
  const [isUseCasesDialogOpen, setIsUseCasesDialogOpen] = useState(false);
  const [isActorsDialogOpen, setIsActorsDialogOpen] = useState(false);
  const [isEdgeTypeDialogOpen, setIsEdgeTypeDialogOpen] = useState(false);
  const [newConnection, setNewConnection] = useState<Connection | null>(null);

  const dispatch = useDispatch();
  const nodes = useSelector(selectNodes);
  const edges = useSelector(selectEdges);

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
    <>
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

      <Flow onConnect={handleConnect} onAddNode={handleAddNode} type={DiagramType.USE_CASE} />
    </>
  );
}
