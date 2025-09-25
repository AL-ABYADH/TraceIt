"use client";

import Flow from "@/components/Flow";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import {
  addNode,
  loadFlowData,
  markAsSaved,
  onConnect,
  onEdgesChange,
  onNodesChange,
  selectEdges,
  selectIsDirty,
  selectNodes,
} from "@/modules/core/flow/store/flow-slice";
import { useUseCaseDiagram } from "../hooks/useUseCaseDiagram";
import { Connection, EdgeChange, NodeChange } from "@xyflow/react";
import Button from "@/components/Button";
import { useParams } from "next/navigation";
import UseCaseSelection from "./UseCasesSelection";
import ActorSelection from "./ActorsSelection";
import { EdgeType, NodeType } from "@repo/shared-schemas";
import UseCaseEdgeTypesSelection from "./UseCaseEdgeTypesSelection";

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
  const isDirty = useSelector(selectIsDirty);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    dispatch(onNodesChange(changes));
  }, []);

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    dispatch(onEdgesChange(changes));
  }, []);

  const handleConnect = (conn: Connection) => {
    const sourceNode = nodes.find((node) => node.id == conn.source);
    const targetNode = nodes.find((node) => node.id == conn.target);

    const edge = edges.find((edge) => edge.target == conn.target && edge.source == conn.source);
    if (edge) return;

    if (targetNode?.type === NodeType.ACTOR) return;

    if (sourceNode?.type === NodeType.USE_CASE && targetNode?.type === NodeType.USE_CASE) {
      setNewConnection(conn);
      setIsEdgeTypeDialogOpen(true);
      return;
    }

    dispatch(onConnect({ ...conn, type: EdgeType.ASSOCIATION }));
  };

  const { data, isLoading, isError, error } = useUseCaseDiagram(projectId);

  useEffect(() => {
    if (data) {
      dispatch(
        loadFlowData({
          nodes: data.nodes,
          edges: data.edges,
        }),
      );
    }
  }, [data, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading use cases...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-destructive bg-destructive/10 border border-destructive/20 p-4 rounded-xl">
          Error loading use cases: {error.message}
        </div>
      </div>
    );
  }

  return (
    <>
      <UseCaseSelection
        isOpen={isUseCasesDialogOpen}
        onClose={() => setIsUseCasesDialogOpen(false)}
        projectId={projectId}
        onUseCaseClick={(useCase) =>
          dispatch(addNode({ id: useCase.id, type: NodeType.USE_CASE, data: useCase }))
        }
      />
      <ActorSelection
        isOpen={isActorsDialogOpen}
        onClose={() => setIsActorsDialogOpen(false)}
        projectId={projectId}
        onActorClick={(actor) =>
          dispatch(addNode({ id: actor.id, type: NodeType.ACTOR, data: actor }))
        }
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
      <Button
        onClick={() => {
          dispatch(markAsSaved());
        }}
        disabled={!isDirty}
      >
        Save
      </Button>
      <Flow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
      />
    </>
  );
}
