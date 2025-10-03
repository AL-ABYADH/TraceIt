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
import { useActivityDiagram } from "../hooks/useActivityDiagram";
import { Connection } from "@xyflow/react";
import Button from "@/components/Button";
import { useParams } from "next/navigation";
import ActivitySelection from "./ActivitySelection";
import DecisionSelection from "./DecisionSelection";
import DecisionEdgeTypesSelection from "./DecisionEdgeTypesSelection";
import { DiagramType, EdgeType, NodeType } from "@repo/shared-schemas";
import Flow from "@/modules/core/flow/components/Flow";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

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
  const diagramId = useSelector(selectDiagramId);

  // Check if initial node already exists
  const hasInitialNode = nodes.some((node) => node.type === NodeType.INITIAL_NODE);
  // Check if final node already exists
  const hasFinalNode = nodes.some((node) => node.type === NodeType.FINAL_NODE);

  const handleAddNode = (nodeType: NodeType) => {
    console.log(nodeType);
    switch (nodeType) {
      case NodeType.ACTIVITY:
        setIsActivitiesDialogOpen(true);
        break;

      case NodeType.DECISION_NODE:
        setIsDecisionSelectionOpen(true);
        break;

      case NodeType.INITIAL_NODE:
        handleAddInitialNode();
        break;

      case NodeType.FINAL_NODE:
        handleAddFinalNode();
        break;

      case NodeType.MERGE_NODE:
        handleAddMergeNode();
        break;

      case NodeType.FORK_NODE:
        handleAddForkNode();
        break;

      case NodeType.JOIN_NODE:
        handleAddJoinNode();
        break;

      case NodeType.FLOW_FINAL_NODE:
        handleAddFinalFlowNode();
        break;

      default:
        break;
    }
  };

  const handleAddActivity = (activityId: string) => {
    dispatch(addNode({ type: NodeType.ACTIVITY, data: { id: activityId } }));
  };

  const handleAddDecisionNode = (decisionId: string) => {
    dispatch(addNode({ type: NodeType.DECISION_NODE, data: { id: decisionId } }));
  };

  const handleAddMergeNode = () => {
    dispatch(addNode({ type: NodeType.MERGE_NODE }));
  };

  const handleAddForkNode = () => {
    dispatch(addNode({ type: NodeType.FORK_NODE }));
  };

  const handleAddJoinNode = () => {
    dispatch(addNode({ type: NodeType.JOIN_NODE }));
  };

  const handleAddInitialNode = () => {
    if (hasInitialNode) {
      alert("Only one initial node is allowed per diagram");
      return;
    }
    dispatch(addNode({ type: NodeType.INITIAL_NODE }));
  };

  const handleAddFinalNode = () => {
    if (hasFinalNode) {
      alert("Only one final node is allowed per diagram");
      return;
    }
    dispatch(addNode({ type: NodeType.FINAL_NODE }));
  };

  const handleAddFinalFlowNode = () => {
    dispatch(addNode({ type: NodeType.FLOW_FINAL_NODE }));
  };

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
          diagramId: data.id,
        }),
      );
    }
  }, [data, dispatch]);

  if (isLoading) {
    return <Loading isOpen={isLoading} message="Loading activity diagram..." mode="dialog" />;
  }

  if (isError) {
    return <ErrorMessage message={`Error loading activity diagram: ${error!.message}`} />;
  }

  return (
    <>
      <ActivitySelection
        isOpen={isActivitiesDialogOpen}
        onClose={() => setIsActivitiesDialogOpen(false)}
        projectId={projectId}
        onActivityClick={(activity) => handleAddActivity(activity.id)}
      />

      <DecisionSelection
        isOpen={isDecisionSelectionOpen}
        onClose={() => setIsDecisionSelectionOpen(false)}
        projectId={projectId}
        onDecisionClick={(decision) => handleAddDecisionNode(decision.id)}
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

      <Flow onConnect={handleConnect} onAddNode={handleAddNode} type={DiagramType.ACTIVITY} />
    </>
  );
}
