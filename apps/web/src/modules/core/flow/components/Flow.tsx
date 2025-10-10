"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  ConnectionLineType,
  NodeChange,
  EdgeChange,
  Connection,
  Viewport,
} from "@xyflow/react";
import { getEdgeTypesForReactFlow, getNodeTypesForReactFlow } from "@/modules/core/flow/registry";
import {
  deleteEdges,
  deleteNodes,
  selectEdges,
  selectNodes,
  undo,
  redo,
  selectCanUndo,
  selectCanRedo,
  markAsSaved,
  selectIsDirty,
  onNodesChange,
  onEdgesChange,
  selectIsSynced,
  markAsSynced,
  updateViewport,
  selectDiagramId,
} from "@/modules/core/flow/store/flow-slice";
import { useDispatch, useSelector } from "react-redux";
import { Undo, Redo, Save, Plus, Maximize, Minimize } from "lucide-react";
import { DiagramType, EdgeDto, NodeDto, NodeType } from "@repo/shared-schemas";
import Loading from "@/components/Loading";
import FlowNodeSelection from "./FlowNodeSelection";

import { useBeforeUnloadWarning } from "@/hooks/useBeforeUnloadWarning";
import { useLatest } from "@/hooks/useLatest";
import ErrorMessage from "@/components/ErrorMessage";
import { useUpdateDiagram } from "../hooks/useUpdateDiagram";

type Props = {
  onConnect: (conn: Connection) => void;
  onAddNode: (nodeType: NodeType) => void;
  type: DiagramType;
};

import { useMaximization } from "@/contexts/MaximizationContext";

export default function Flow({ onConnect, onAddNode, type }: Props) {
  const [isActorsDialogOpen, setIsActorsDialogOpen] = useState(false);
  const { isMaximized, toggleMaximize } = useMaximization();

  const nodes = useSelector(selectNodes);
  const edges = useSelector(selectEdges);
  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);
  const isDirty = useSelector(selectIsDirty);
  const isSynced = useSelector(selectIsSynced);

  const nodeTypes = useMemo(() => getNodeTypesForReactFlow(), []);
  const edgeTypes = useMemo(() => getEdgeTypesForReactFlow(), []);

  const dispatch = useDispatch();
  const diagramId = useSelector(selectDiagramId);

  const updateDiagramMutation = useUpdateDiagram();

  // Show browser confirmation before leaving the page if there are unsaved changes.
  useBeforeUnloadWarning(isDirty);

  const latestIsDirty = useLatest(isDirty);
  const latestNodes = useLatest(nodes);
  const latestEdges = useLatest(edges);
  const latestDiagramId = useLatest(diagramId);

  // Save on unmount if there are unsaved changes.
  useEffect(() => {
    return () => {
      if (latestIsDirty.current) {
        if (latestDiagramId.current === null) return;
        updateDiagramMutation.mutate({
          diagramId: latestDiagramId.current as string,
          diagram: {
            nodes: latestNodes.current as NodeDto[],
            edges: latestEdges.current as EdgeDto[],
          },
        });
      }
    };
  }, []);

  const handleUndo = useCallback(() => {
    if (canUndo) {
      dispatch(undo());
    }
  }, [dispatch, canUndo]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      dispatch(redo());
    }
  }, [dispatch, canRedo]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      dispatch(onNodesChange(changes));
    },
    [dispatch],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      dispatch(onEdgesChange(changes));
    },
    [dispatch],
  );

  const handleSave = useCallback(() => {
    dispatch(markAsSaved());
  }, [dispatch]);

  const handleDelete = useCallback(() => {
    const selectedNode = nodes.find((node) => node.selected);
    const selectedEdge = edges.find((edge) => edge.selected);

    if (selectedNode) dispatch(deleteNodes([selectedNode.id]));
    if (selectedEdge) dispatch(deleteEdges([selectedEdge.id]));
  }, [nodes, edges, dispatch]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      const key = (event.key || "").toLowerCase();

      // don't hijack typing in inputs/textareas or contentEditable
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      const isTyping =
        tag === "INPUT" || tag === "TEXTAREA" || (target?.isContentEditable ?? false);
      if (isTyping) return;

      // Handle Ctrl/Cmd+S (Save)
      if (isCtrlOrCmd && key === "s") {
        event.preventDefault();
        event.stopPropagation();

        if (!isDirty) return;
        handleSave();
        return;
      }

      // Handle Ctrl+Z (Undo)
      if (isCtrlOrCmd && key === "z" && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
        return;
      }

      // Handle Ctrl+Y (Redo) or Ctrl+Shift+Z (Redo alternative)
      if (isCtrlOrCmd && (key === "y" || (key === "z" && event.shiftKey))) {
        event.preventDefault();
        handleRedo();
        return;
      }

      // Handle Delete key
      if (key === "delete") {
        handleDelete();
        return;
      }
    },
    [nodes, edges, dispatch, canUndo, canRedo, handleSave, isDirty],
  );

  const handleUpdateViewport = useCallback(
    (viewport: Viewport) => {
      dispatch(updateViewport(viewport));
    },
    [dispatch],
  );

  useEffect(() => {
    if (!isSynced) {
      if (diagramId === null) return;
      updateDiagramMutation.mutate({
        diagramId: diagramId!,
        diagram: {
          nodes: nodes as NodeDto[],
          edges: edges as EdgeDto[],
        },
      });
      dispatch(markAsSynced());
    }
  }, [isSynced]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div style={{ width: "100%", height: isMaximized ? "calc(100vh - 64px)" : "600px" }}>
      <FlowNodeSelection
        isOpen={isActorsDialogOpen}
        onClose={() => setIsActorsDialogOpen(false)}
        type={type}
        onClick={onAddNode}
      />

      {updateDiagramMutation.isPending && (
        <Loading isOpen={updateDiagramMutation.isPending} message="Saving..." />
      )}

      {updateDiagramMutation.isError && (
        <ErrorMessage
          message={`Failed to save diagram: ${
            (updateDiagramMutation.error as any)?.message ?? "Unknown error"
          }`}
        />
      )}

      <div className="relative top-2 right-2">
        <button
          onClick={handleUndo}
          className={`p-3 rounded-lg ${canUndo ? "text-foreground" : "text-muted-foreground opacity-50"}`}
        >
          <Undo />
        </button>
        <button
          onClick={handleRedo}
          className={`p-3 rounded-lg ${canRedo ? "text-foreground" : "text-muted-foreground opacity-50"}`}
        >
          <Redo />
        </button>

        <button
          onClick={isDirty ? handleSave : undefined}
          className={`p-3 rounded-lg ${isDirty ? "text-foreground" : "text-muted-foreground opacity-50"}`}
        >
          <Save />
        </button>

        <button
          onClick={() => setIsActorsDialogOpen(true)}
          className="p-3 rounded-lg text-foreground"
        >
          <Plus />
        </button>
        <button onClick={toggleMaximize} className="p-3 rounded-lg text-foreground">
          {isMaximized ? <Minimize /> : <Maximize />}
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineType={ConnectionLineType.Straight}
        proOptions={{ hideAttribution: true }}
        colorMode="dark"
        onViewportChange={handleUpdateViewport}
        fitView
      >
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}
