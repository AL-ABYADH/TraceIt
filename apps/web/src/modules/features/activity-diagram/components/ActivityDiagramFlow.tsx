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
import ActivitySelection from "./ActivitySelection";
import DecisionEdgeTypesSelection from "./DecisionEdgeTypesSelection";
import {
  DiagramDetailDto,
  DiagramType,
  EdgeType,
  NodeType,
  RequirementListDto,
  RequirementExceptionDto,
} from "@repo/shared-schemas";
import Flow from "@/modules/core/flow/components/Flow";
import DecisionTypeSelection from "./DecisionTypeSelection";
import ConditionSelection from "./ConditionSelection";
import ExceptionSelection from "./ExceptionSelection";
import { showErrorNotification } from "@/components/notifications";

export default function ActivityDiagramFlow({
  diagram,
  useCaseId,
}: {
  diagram: DiagramDetailDto;
  useCaseId: string;
}) {
  const [isActivitySelectionOpen, setIsActivitySelectionOpen] = useState(false);
  const [isDecisionTypeDialogOpen, setIsDecisionTypeDialogOpen] = useState(false);
  const [isConditionSelectionOpen, setIsConditionSelectionOpen] = useState(false);
  const [isExceptionSelectionOpen, setIsExceptionSelectionOpen] = useState(false);
  const [isDecisionEdgeTypeDialogOpen, setIsDecisionEdgeTypeDialogOpen] = useState(false);
  const [newConnection, setNewConnection] = useState<Connection | null>(null);
  const [decisionSourceNodeId, setDecisionSourceNodeId] = useState<string | undefined>();

  const dispatch = useDispatch();
  const nodes = useSelector(selectNodes);
  const edges = useSelector(selectEdges);

  // Add validation checks back from old code
  const hasInitialNode = nodes.some((node) => node.type === NodeType.INITIAL_NODE);
  const hasFinalNode = nodes.some((node) => node.type === NodeType.FINAL_NODE);

  // Validate useCaseId for activity diagram
  useEffect(() => {
    if (diagram.type === DiagramType.ACTIVITY && !useCaseId) {
      showErrorNotification("ActivityDiagramFlow: missing useCaseId prop for an activity diagram.");
    }
  }, [diagram, useCaseId]);

  const handleAddNode = (nodeType: NodeType) => {
    switch (nodeType) {
      case NodeType.ACTIVITY:
        setIsActivitySelectionOpen(true);
        break;
      case NodeType.DECISION_NODE:
        setIsDecisionTypeDialogOpen(true);
        break;
      case NodeType.INITIAL_NODE:
        // Add validation back from old code
        if (hasInitialNode) {
          showErrorNotification("Only one initial node is allowed");
          return;
        }
        dispatch(addNode({ type: NodeType.INITIAL_NODE }));
        break;
      case NodeType.FINAL_NODE:
        // Add validation back from old code
        if (hasFinalNode) {
          showErrorNotification("Only one final node is allowed");
          return;
        }
        dispatch(addNode({ type: NodeType.FINAL_NODE }));
        break;
      case NodeType.MERGE_NODE:
        dispatch(addNode({ type: NodeType.MERGE_NODE }));
        break;
      case NodeType.FORK_NODE:
        dispatch(addNode({ type: NodeType.FORK_NODE }));
        break;
      case NodeType.JOIN_NODE:
        dispatch(addNode({ type: NodeType.JOIN_NODE }));
        break;
      case NodeType.FLOW_FINAL_NODE:
        dispatch(addNode({ type: NodeType.FLOW_FINAL_NODE }));
        break;
      default:
        break;
    }
  };

  const handleAddActivity = (requirement: RequirementListDto) => {
    dispatch(
      addNode({
        type: NodeType.ACTIVITY,
        data: requirement,
      }),
    );
  };

  const handleAddCondition = (requirement: RequirementListDto) => {
    dispatch(
      addNode({
        type: NodeType.DECISION_NODE,
        data: requirement,
      }),
    );
  };

  const handleAddException = (exception: RequirementExceptionDto) => {
    dispatch(
      addNode({
        type: NodeType.DECISION_NODE,
        data: exception,
      }),
    );
  };

  const handleConnect = (conn: Connection) => {
    const sourceNode = nodes.find((node) => node.id === conn.source);
    const targetNode = nodes.find((node) => node.id === conn.target);

    // Add null checks from old code
    if (!sourceNode || !targetNode) return;

    const edge = edges.find(
      (edge) =>
        (edge.source === conn.source && edge.target === conn.target) ||
        (edge.source === conn.target && edge.target === conn.source),
    );

    if (edge || conn.source === conn.target) return;

    if (sourceNode?.type === NodeType.DECISION_NODE) {
      setNewConnection(conn);
      setDecisionSourceNodeId(conn.source);
      setIsDecisionEdgeTypeDialogOpen(true);
      return;
    }

    dispatch(onConnect({ ...conn, type: EdgeType.CONTROL_FLOW }));
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
      {/* Dialogs */}
      <ActivitySelection
        isOpen={isActivitySelectionOpen}
        onClose={() => setIsActivitySelectionOpen(false)}
        useCaseId={useCaseId}
        onActivitySelect={handleAddActivity}
      />
      <DecisionTypeSelection
        isOpen={isDecisionTypeDialogOpen}
        onClose={() => setIsDecisionTypeDialogOpen(false)}
        onConditionSelect={() => {
          setIsDecisionTypeDialogOpen(false);
          setIsConditionSelectionOpen(true);
        }}
        onExceptionSelect={() => {
          setIsDecisionTypeDialogOpen(false);
          setIsExceptionSelectionOpen(true);
        }}
      />
      <ConditionSelection
        isOpen={isConditionSelectionOpen}
        onClose={() => setIsConditionSelectionOpen(false)}
        useCaseId={useCaseId}
        onConditionSelect={handleAddCondition}
      />
      <ExceptionSelection
        isOpen={isExceptionSelectionOpen}
        onClose={() => setIsExceptionSelectionOpen(false)}
        useCaseId={useCaseId}
        onExceptionSelect={handleAddException}
      />
      <DecisionEdgeTypesSelection
        onClose={() => setIsDecisionEdgeTypeDialogOpen(false)}
        isOpen={isDecisionEdgeTypeDialogOpen}
        sourceNodeId={decisionSourceNodeId}
        onDecisionEdgeTypesClick={(type) => {
          if (!newConnection) return;
          const edgeType = type === "TRUE" ? EdgeType.TRUE : EdgeType.FALSE;
          dispatch(onConnect({ ...newConnection, type: edgeType }));
        }}
      />

      {/* The Flow itself fills remaining height */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Flow onConnect={handleConnect} onAddNode={handleAddNode} type={DiagramType.ACTIVITY} />
      </div>
    </div>
  );
}
