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
import { useActivityDiagram } from "../hooks/useActivityDiagram";
import { Connection } from "@xyflow/react";
import Button from "@/components/Button";
import { useParams } from "next/navigation";
import ActivitySelection from "./ActivitySelection";
import DecisionSelection from "./DecisionSelection";
import DecisionEdgeTypesSelection from "./DecisionEdgeTypesSelection";
import { EdgeType, NodeType } from "@repo/shared-schemas";
import Flow from "@/modules/core/flow/components/Flow";

export default function ActivityDiagramFlow() {
  const params = useParams<"/projects/[project-id]/use-case-diagram">();
  const projectId = params["project-id"];

  const [isActivitiesDialogOpen, setIsActivitiesDialogOpen] = useState(false);
  const [isDecisionSelectionOpen, setIsDecisionSelectionOpen] = useState(false);
  const [isDecisionEdgeTypeDialogOpen, setIsDecisionEdgeTypeDialogOpen] = useState(false);

  const [newConnection, setNewConnection] = useState<Connection | null>(null);
  const [decisionSourceNodeId, setDecisionSourceNodeId] = useState<string | undefined>();

  const dispatch = useDispatch();

  const nodes = useSelector(selectNodes);
  const edges = useSelector(selectEdges);

  // Check if initial node already exists
  const hasInitialNode = nodes.some((node) => node.type === NodeType.INITIAL_NODE);
  // Check if final node already exists
  const hasFinalNode = nodes.some((node) => node.type === NodeType.FINAL_NODE);

  const handleConnect = (conn: Connection) => {
    const sourceNode = nodes.find((node) => node.id === conn.source);
    const targetNode = nodes.find((node) => node.id === conn.target);

    const edge = edges.find(
      (edge) =>
        (edge.source === conn.source && edge.target === conn.target) ||
        (edge.source === conn.target && edge.target === conn.source),
    );

    // Prevent self-connections and duplicate connections
    if (edge || conn.source === conn.target) return;

    // For decision nodes as source, show TRUE/FALSE selection
    if (sourceNode?.type === NodeType.DECISION_NODE) {
      setNewConnection(conn);
      setDecisionSourceNodeId(conn.source);
      setIsDecisionEdgeTypeDialogOpen(true);
      return;
    }

    // Default connection type for other cases
    dispatch(onConnect({ ...conn, type: EdgeType.ACTIVITY_FLOW }));
  };

  const { data, isLoading, isError, error } = useActivityDiagram(projectId);

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
        <div className="text-muted-foreground">Loading activity diagram...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-destructive bg-destructive/10 border border-destructive/20 p-4 rounded-xl">
          Error loading activity diagram: {error.message}
        </div>
      </div>
    );
  }

  return (
    <>
      <ActivitySelection
        isOpen={isActivitiesDialogOpen}
        onClose={() => setIsActivitiesDialogOpen(false)}
        projectId={projectId}
        onActivityClick={(activity) =>
          dispatch(addNode({ id: activity.id, type: NodeType.ACTIVITY, data: activity }))
        }
      />

      <DecisionSelection
        isOpen={isDecisionSelectionOpen}
        onClose={() => setIsDecisionSelectionOpen(false)}
        projectId={projectId}
        onDecisionClick={(decision) =>
          dispatch(
            addNode({
              id: decision.id,
              type: NodeType.DECISION_NODE,
              data: decision,
              position: { x: 200, y: 200 },
            }),
          )
        }
      />

      <DecisionEdgeTypesSelection
        onClose={() => {
          setIsDecisionEdgeTypeDialogOpen(false);
          setDecisionSourceNodeId(undefined);
        }}
        isOpen={isDecisionEdgeTypeDialogOpen}
        onDecisionEdgeTypesClick={(type) => {
          if (!newConnection) return;
          const edgeType = type === "TRUE" ? EdgeType.TRUE : EdgeType.FALSE;
          dispatch(onConnect({ ...newConnection, type: edgeType }));
        }}
        sourceNodeId={decisionSourceNodeId}
      />

      <div className="flex gap-2 p-4 border-b">
        <Button onClick={() => setIsActivitiesDialogOpen(true)}>Add Activity</Button>

        {/* Add Decision button - changed to primary blue like Add Activity */}
        <Button onClick={() => setIsDecisionSelectionOpen(true)}>Add Decision</Button>

        <Button
          variant="ghost"
          onClick={() => {
            if (hasInitialNode) {
              alert("Only one initial node is allowed per diagram");
              return;
            }
            dispatch(
              addNode({
                id: `start-${Date.now()}`,
                type: NodeType.INITIAL_NODE,
                data: { name: "Start" },
                position: { x: 100, y: 100 },
              }),
            );
          }}
          disabled={hasInitialNode}
        >
          {hasInitialNode ? "Start Node Added" : "Add Start Node"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            dispatch(
              addNode({
                id: `fork-${Date.now()}`,
                type: NodeType.FORK_NODE,
                data: { name: "Fork" },
                position: { x: 200, y: 300 },
              }),
            );
          }}
        >
          Add Fork
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            dispatch(
              addNode({
                id: `join-${Date.now()}`,
                type: NodeType.JOIN_NODE,
                data: { name: "Join" },
                position: { x: 400, y: 300 },
              }),
            );
          }}
        >
          Add Join
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            dispatch(
              addNode({
                id: `merge-${Date.now()}`,
                type: NodeType.MERGE_NODE,
                data: { name: "Merge" },
                position: { x: 600, y: 200 },
              }),
            );
          }}
        >
          Add Merge
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            if (hasFinalNode) {
              alert("Only one final node is allowed per diagram");
              return;
            }
            dispatch(
              addNode({
                id: `end-${Date.now()}`,
                type: NodeType.FINAL_NODE,
                data: { name: "End" },
                position: { x: 300, y: 100 },
              }),
            );
          }}
          disabled={hasFinalNode}
        >
          {hasFinalNode ? "End Node Added" : "Add End Node"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            dispatch(
              addNode({
                id: `flow-final-${Date.now()}`,
                type: NodeType.FLOW_FINAL_NODE,
                data: { name: "Flow End" },
                position: { x: 500, y: 200 },
              }),
            );
          }}
        >
          Add Flow End
        </Button>
      </div>

      <Flow onConnect={handleConnect} />
    </>
  );
}
