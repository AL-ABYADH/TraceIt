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
} from "@/modules/core/flow/store/flow-slice";
import { useDispatch, useSelector } from "react-redux";
import { Undo, Redo, Save, Plus } from "lucide-react";
import { DiagramElementsDto, DiagramType, EdgeDto, NodeDto, NodeType } from "@repo/shared-schemas";
import Loading from "@/components/Loading";
import FlowNodeSelection from "./FlowNodeSelection";

type Props = {
  onConnect: (conn: Connection) => void;
  onAddNode: (nodeType: NodeType) => void;
  onSave?: (elements: DiagramElementsDto) => void;
  isSaving?: boolean;
  type: DiagramType;
};

export default function Flow({ onConnect, onAddNode, onSave, isSaving, type }: Props) {
  const [isActorsDialogOpen, setIsActorsDialogOpen] = useState(false);

  const nodes = useSelector(selectNodes);
  const edges = useSelector(selectEdges);
  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);
  const isDirty = useSelector(selectIsDirty);
  const isSynced = useSelector(selectIsSynced);

  const nodeTypes = useMemo(() => getNodeTypesForReactFlow(), []);
  const edgeTypes = useMemo(() => getEdgeTypesForReactFlow(), []);

  const dispatch = useDispatch();

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
      onSave?.({
        nodes: nodes as NodeDto[],
        edges: edges as EdgeDto[],
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
    <div style={{ width: "100%", height: "600px" }}>
      <FlowNodeSelection
        isOpen={isActorsDialogOpen}
        onClose={() => setIsActorsDialogOpen(false)}
        type={type}
        onClick={onAddNode}
      />

      {isSaving && onSave && <Loading isOpen={isSaving} message="Saving..." />}

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

        {onSave && (
          <button
            onClick={isDirty ? handleSave : undefined}
            className={`p-3 rounded-lg ${isDirty ? "text-foreground" : "text-muted-foreground opacity-50"}`}
          >
            <Save />
          </button>
        )}
        <button
          onClick={() => setIsActorsDialogOpen(true)}
          className="p-3 rounded-lg text-foreground"
        >
          <Plus />
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
