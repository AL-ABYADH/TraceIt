"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  ConnectionLineType,
  NodeChange,
  EdgeChange,
  Connection,
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
} from "@/modules/core/flow/store/flow-slice";
import { useDispatch, useSelector } from "react-redux";
import { Undo, Redo } from "lucide-react";

type Props = {
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (conn: Connection) => void;
};

export default function Flow({ onNodesChange, onEdgesChange, onConnect }: Props) {
  const nodes = useSelector(selectNodes);
  const edges = useSelector(selectEdges);
  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);

  const nodeTypes = useMemo(() => getNodeTypesForReactFlow(), []);
  const edgeTypes = useMemo(() => getEdgeTypesForReactFlow(), []);

  const dispatch = useDispatch();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      // Handle Ctrl+Z (Undo)
      if (isCtrlOrCmd && event.key === "z" && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) {
          dispatch(undo());
        }
        return;
      }

      // Handle Ctrl+Y (Redo) or Ctrl+Shift+Z (Redo alternative)
      if (isCtrlOrCmd && (event.key === "y" || (event.key === "z" && event.shiftKey))) {
        event.preventDefault();
        if (canRedo) {
          dispatch(redo());
        }
        return;
      }

      // Handle Delete key
      if (event.key === "Delete") {
        const selectedNode = nodes.find((node) => node.selected);
        const selectedEdge = edges.find((edge) => edge.selected);

        if (selectedNode) dispatch(deleteNodes([selectedNode.id]));
        if (selectedEdge) dispatch(deleteEdges([selectedEdge.id]));
      }
    },
    [nodes, edges, dispatch, canUndo, canRedo],
  );

  const handleUndo = useCallback(() => {
    dispatch(undo());
  }, [dispatch]);

  const handleRedo = useCallback(() => {
    dispatch(redo());
  }, [dispatch]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <div className="relative top-2 right-2">
        <button
          onClick={handleUndo}
          className={`p-3 rounded-lg ${canUndo ? "text-foreground" : "text-muted-foreground opacity-50"}`}
        >
          {<Undo />}
        </button>
        <button
          onClick={handleRedo}
          className={`p-3 rounded-lg ${canRedo ? "text-foreground" : "text-muted-foreground opacity-50"}`}
        >
          {<Redo />}
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineType={ConnectionLineType.Straight}
        proOptions={{ hideAttribution: true }}
        colorMode="dark"
        fitView
      >
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}
