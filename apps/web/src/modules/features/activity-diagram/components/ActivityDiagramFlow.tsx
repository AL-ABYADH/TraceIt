"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addNode,
  loadFlowData,
  onConnect,
  selectEdges,
  selectNodes,
  selectDiagramId,
} from "@/modules/core/flow/store/flow-slice";
import { Connection } from "@xyflow/react";
import ActivitySelection from "./ActivitySelection";
import DecisionEdgeTypesSelection from "./DecisionEdgeTypesSelection";
import ActivitySelectionDialog from "./ActivitySelectionDialog";
import RequirementSelection from "./RequirementSelection";
import NameInput from "../../../../components/NameInput";
import {
  DiagramDetailDto,
  DiagramType,
  EdgeType,
  NodeType,
  DiagramElementsDto,
  ActivityDto,
  ConditionDto,
  RequirementExceptionDto,
} from "@repo/shared-schemas";
import Flow from "@/modules/core/flow/components/Flow";
import { useUpdateDiagram } from "@/modules/features/use-case-diagram/hooks/useUpdateDiagram";
import ErrorMessage from "@/components/ErrorMessage";
import { useCreateActivity } from "../hooks/useCreateActivity";
import { useCreateCondition } from "../hooks/useCreateCondition";
import { SuccessNotification } from "@/components/SuccessNotification";
import { ErrorNotification } from "@/components/ErrorNotification";
import DecisionTypeSelection from "./DecisionTypeSelection";
import ConditionSelectionDialog from "./ConditionSelectionDialog";
import ConditionSelection from "./ConditionSelection";
import ExceptionSelection from "./ExceptionSelection";
import { getCreationMessage } from "@/utils/messages";
import { requirementClient } from "../../requirement/api/clients/requirement-client";

export default function ActivityDiagramFlow({
  diagram,
  useCaseId,
}: {
  diagram: DiagramDetailDto;
  useCaseId: string;
}) {
  const dispatch = useDispatch();

  const nodes = useSelector(selectNodes);
  const edges = useSelector(selectEdges);
  const diagramId = useSelector(selectDiagramId);

  const updateDiagramMutation = useUpdateDiagram({ diagramId: diagramId! });
  const createActivityMutation = useCreateActivity();
  const createConditionMutation = useCreateCondition();

  // Dialog states
  const [isActivitiesDialogOpen, setIsActivitiesDialogOpen] = useState(false);
  const [isDecisionEdgeTypeDialogOpen, setIsDecisionEdgeTypeDialogOpen] = useState(false);
  const [isActivitySelectionDialogOpen, setIsActivitySelectionDialogOpen] = useState(false);
  const [isRequirementSelectionOpen, setIsRequirementSelectionOpen] = useState(false);
  const [isNameInputOpen, setIsNameInputOpen] = useState(false);
  const [isDecisionTypeDialogOpen, setIsDecisionTypeDialogOpen] = useState(false);
  const [isConditionSelectionDialogOpen, setIsConditionSelectionDialogOpen] = useState(false);
  const [isConditionSelectionOpen, setIsConditionSelectionOpen] = useState(false);
  const [isExceptionSelectionOpen, setIsExceptionSelectionOpen] = useState(false);

  // Data states
  const [pendingActivityName, setPendingActivityName] = useState("");
  const [selectedRequirement, setSelectedRequirement] = useState<{
    id: string;
    operation: string;
  } | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [newConnection, setNewConnection] = useState<Connection | null>(null);
  const [decisionSourceNodeId, setDecisionSourceNodeId] = useState<string | undefined>();
  const [pendingConditionData, setPendingConditionData] = useState<{
    type: "new" | "existing";
    initialName?: string;
    id?: string;
  } | null>(null);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Validate useCaseId for activity diagram
  useEffect(() => {
    if (diagram.type === DiagramType.ACTIVITY && !useCaseId) {
      console.error("ActivityDiagramFlow: missing useCaseId prop for an activity diagram.");
    }
  }, [diagram, useCaseId]);

  // Load diagram data
  useEffect(() => {
    if (diagram) {
      dispatch(loadFlowData({ nodes: diagram.nodes, edges: diagram.edges, diagramId: diagram.id }));
    }
  }, [diagram, dispatch]);

  // Check for existing initial/final nodes
  const hasInitialNode = nodes.some((node) => node.type === NodeType.INITIAL_NODE);
  const hasFinalNode = nodes.some((node) => node.type === NodeType.FINAL_NODE);

  // ------------------------
  // Decision flow handlers
  // ------------------------
  const handleConditionSelected = (condition: ConditionDto) => {
    dispatch(
      addNode({
        type: NodeType.DECISION_NODE,
        data: {
          id: condition.id,
          name: condition.name,
          conditionType: "condition",
        },
      }),
    );

    const creationMessage = getCreationMessage(NodeType.DECISION_NODE, condition.name);
    if (creationMessage) {
      setNotification({ type: "success", message: creationMessage });
    }
  };

  const handleNewConditionFromRequirement = (requirement: any) => {
    setPendingConditionData({
      type: "new",
      initialName: requirement.condition || requirement.operation,
      id: requirement.id,
    });
    setIsRequirementSelectionOpen(false);
    setIsNameInputOpen(true);
  };

  const handleConditionNameConfirm = async (name: string) => {
    if (!pendingConditionData || !useCaseId) return;

    try {
      const newCondition = await createConditionMutation.mutateAsync({
        name: name,
        requirementId: pendingConditionData.id!,
        useCaseId: useCaseId,
      });

      dispatch(
        addNode({
          type: NodeType.DECISION_NODE,
          data: newCondition,
        }),
      );

      const creationMessage = getCreationMessage(NodeType.DECISION_NODE, newCondition.name);
      if (creationMessage) {
        setNotification({ type: "success", message: creationMessage });
      }

      setPendingConditionData(null);
      setIsNameInputOpen(false);
    } catch (error) {
      console.error("Failed to create condition:", error);
      setNotification({ type: "error", message: "Failed to create condition. Please try again." });
    }
  };

  const handleExceptionSelected = (exception: RequirementExceptionDto) => {
    dispatch(
      addNode({
        type: NodeType.DECISION_NODE,
        data: exception,
      }),
    );

    // const creationMessage = getCreationMessage(NodeType.DECISION_NODE, exception.name);
    // if (creationMessage) {
    //   setNotification({ type: "success", message: creationMessage });
    // }
  };

  // ------------------------
  // Activity creation handlers
  // ------------------------
  const handleCreateNewActivity = () => {
    if (!useCaseId) {
      setNotification({ type: "error", message: "Cannot create activity: Use case ID is missing" });
      return;
    }
    setIsActivitySelectionDialogOpen(false);
    setPendingConditionData(null);
    setIsRequirementSelectionOpen(true);
  };

  const handlePickExistingActivity = () => {
    setIsActivitySelectionDialogOpen(false);
    setIsActivitiesDialogOpen(true);
  };

  const handleRequirementSelect = async (requirement: any) => {
    setIsRequirementSelectionOpen(false);

    const isConditionMode = !!pendingConditionData;

    try {
      const { hasActivity, hasCondition } = await requirementClient.getRequirementRelationships({
        requirementId: requirement.id,
      });

      if (isConditionMode && hasCondition) {
        setNotification({
          type: "error",
          message: "This requirement already has a condition linked.",
        });
        setIsRequirementSelectionOpen(true);
        return;
      }
      if (!isConditionMode && hasActivity) {
        setNotification({
          type: "error",
          message: "This requirement already has an activity linked.",
        });
        setIsRequirementSelectionOpen(true);
        return;
      }

      if (isConditionMode) {
        handleNewConditionFromRequirement(requirement);
      } else {
        setSelectedRequirement(requirement);
        setPendingActivityName(requirement.operation);
        setIsNameInputOpen(true);
      }
    } catch (err: any) {
      console.error("Failed to verify requirement relationships:", err);
      setNotification({
        type: "error",
        message: `Could not verify relationships: ${err?.message ?? "Unknown error"}`,
      });
      setIsRequirementSelectionOpen(true);
    }
  };

  const handleActivityNameConfirm = async (name: string) => {
    if (!selectedRequirement || !useCaseId) {
      setNotification({ type: "error", message: "Missing requirement or use case information" });
      return;
    }

    try {
      const { hasActivity } = await requirementClient.getRequirementRelationships({
        requirementId: selectedRequirement.id,
      });

      if (hasActivity) {
        setNotification({
          type: "error",
          message: "This requirement already has an activity linked.",
        });
        setSelectedRequirement(null);
        setPendingActivityName("");
        setIsNameInputOpen(false);
        return;
      }

      const newActivity = await createActivityMutation.mutateAsync({
        name,
        requirementId: selectedRequirement.id,
        useCaseId,
      });

      dispatch(
        addNode({
          type: NodeType.ACTIVITY,
          data: newActivity,
        }),
      );

      const creationMessage = getCreationMessage(NodeType.ACTIVITY, newActivity.name);
      if (creationMessage) {
        setNotification({ type: "success", message: creationMessage });
      }

      setSelectedRequirement(null);
      setPendingActivityName("");
      setIsNameInputOpen(false);
    } catch (error) {
      console.error("Failed to create activity:", error);
      setNotification({ type: "error", message: "Failed to create activity. Please try again." });
    }
  };

  // ------------------------
  // Node addition handlers
  // ------------------------
  const handleAddNode = (nodeType: NodeType) => {
    switch (nodeType) {
      case NodeType.ACTIVITY:
        setIsActivitySelectionDialogOpen(true);
        break;
      case NodeType.DECISION_NODE:
        setIsDecisionTypeDialogOpen(true);
        break;
      case NodeType.INITIAL_NODE:
        if (hasInitialNode) {
          setNotification({ type: "error", message: "Only one initial node is allowed" });
          return;
        }
        dispatch(addNode({ type: NodeType.INITIAL_NODE }));
        break;
      case NodeType.FINAL_NODE:
        if (hasFinalNode) {
          setNotification({ type: "error", message: "Only one final node is allowed" });
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
    }
  };

  const handleAddActivity = (activity: ActivityDto) => {
    dispatch(
      addNode({
        type: NodeType.ACTIVITY,
        data: activity,
      }),
    );
  };

  // ------------------------
  // Edge handling
  // ------------------------
  const handleConnect = (conn: Connection) => {
    const sourceNode = nodes.find((n) => n.id === conn.source);
    const targetNode = nodes.find((n) => n.id === conn.target);

    if (!sourceNode || !targetNode) return;

    const duplicateEdge = edges.find(
      (e) =>
        (e.source === conn.source && e.target === conn.target) ||
        (e.source === conn.target && e.target === conn.source),
    );

    if (duplicateEdge || conn.source === conn.target) return;

    if (sourceNode.type === NodeType.DECISION_NODE) {
      setNewConnection(conn);
      setDecisionSourceNodeId(conn.source);
      setIsDecisionEdgeTypeDialogOpen(true);
      return;
    }

    dispatch(onConnect({ ...conn, type: EdgeType.ACTIVITY_FLOW }));
  };

  const handleSave = (elements: DiagramElementsDto) => {
    if (!diagramId) return;
    updateDiagramMutation.mutate(elements);
  };

  // ------------------------
  // JSX return
  // ------------------------
  return (
    <>
      {notification?.type === "success" && (
        <SuccessNotification message={notification.message} onClose={() => setNotification(null)} />
      )}

      {notification?.type === "error" && (
        <ErrorNotification message={notification.message} onClose={() => setNotification(null)} />
      )}

      {updateDiagramMutation.isError && (
        <ErrorMessage
          message={`Failed to save diagram: ${(updateDiagramMutation.error as any)?.message ?? "Unknown error"}`}
        />
      )}

      <DecisionTypeSelection
        isOpen={isDecisionTypeDialogOpen}
        onClose={() => setIsDecisionTypeDialogOpen(false)}
        onConditionSelect={() => {
          setIsDecisionTypeDialogOpen(false);
          setIsConditionSelectionDialogOpen(true);
        }}
        onExceptionSelect={() => {
          setIsDecisionTypeDialogOpen(false);
          setIsExceptionSelectionOpen(true);
        }}
      />

      <ConditionSelectionDialog
        isOpen={isConditionSelectionDialogOpen}
        onClose={() => setIsConditionSelectionDialogOpen(false)}
        onCreateNew={() => {
          setIsConditionSelectionDialogOpen(false);
          setPendingConditionData({ type: "new" });
          setIsRequirementSelectionOpen(true);
        }}
        onPickExisting={() => {
          setIsConditionSelectionDialogOpen(false);
          setIsConditionSelectionOpen(true);
        }}
      />

      <ConditionSelection
        isOpen={isConditionSelectionOpen}
        onClose={() => setIsConditionSelectionOpen(false)}
        useCaseId={useCaseId}
        onConditionSelect={handleConditionSelected}
      />

      <ExceptionSelection
        isOpen={isExceptionSelectionOpen}
        onClose={() => setIsExceptionSelectionOpen(false)}
        useCaseId={useCaseId}
        onExceptionSelect={handleExceptionSelected}
      />

      <ActivitySelectionDialog
        isOpen={isActivitySelectionDialogOpen}
        onClose={() => setIsActivitySelectionDialogOpen(false)}
        onCreateNew={handleCreateNewActivity}
        onPickExisting={handlePickExistingActivity}
      />

      {useCaseId && (
        <RequirementSelection
          isOpen={isRequirementSelectionOpen}
          onClose={() => {
            setIsRequirementSelectionOpen(false);
            if (pendingConditionData) {
              setPendingConditionData(null);
            }
          }}
          useCaseId={useCaseId}
          isConditionMode={!!pendingConditionData}
          onRequirementSelect={handleRequirementSelect}
        />
      )}

      <NameInput
        isOpen={isNameInputOpen}
        onClose={() => {
          setIsNameInputOpen(false);
          if (pendingConditionData) {
            setPendingConditionData(null);
          } else {
            setSelectedRequirement(null);
            setPendingActivityName("");
          }
        }}
        initialName={pendingConditionData?.initialName || pendingActivityName}
        onConfirm={(name) => {
          if (pendingConditionData) {
            handleConditionNameConfirm(name);
          } else {
            handleActivityNameConfirm(name);
          }
        }}
      />

      <ActivitySelection
        isOpen={isActivitiesDialogOpen}
        onClose={() => setIsActivitiesDialogOpen(false)}
        useCaseId={useCaseId}
        onActivityClick={handleAddActivity}
      />

      <DecisionEdgeTypesSelection
        isOpen={isDecisionEdgeTypeDialogOpen}
        sourceNodeId={decisionSourceNodeId}
        onClose={() => {
          setIsDecisionEdgeTypeDialogOpen(false);
          setDecisionSourceNodeId(undefined);
        }}
        onDecisionEdgeTypesClick={(type) => {
          if (!newConnection) return;
          const edgeType = type === "TRUE" ? EdgeType.TRUE : EdgeType.FALSE;
          dispatch(onConnect({ ...newConnection, type: edgeType }));
        }}
      />

      <Flow
        onConnect={handleConnect}
        onAddNode={handleAddNode}
        onSave={handleSave}
        isSaving={updateDiagramMutation.isPending}
        type={DiagramType.ACTIVITY}
      />
    </>
  );
}
