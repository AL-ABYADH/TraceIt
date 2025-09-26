"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  ConnectionLineType,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from "@xyflow/react";
import { getEdgeTypesForReactFlow, getNodeTypesForReactFlow } from "@/modules/core/flow/registry";
import { useDispatch } from "react-redux";
import { deleteEdges, deleteNodes } from "@/modules/core/flow/store/flow-slice";

type Props = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (conn: Connection) => void;
};

export default function Flow({ nodes, edges, onNodesChange, onEdgesChange, onConnect }: Props) {
  const nodeTypes = useMemo(() => getNodeTypesForReactFlow(), []);
  const edgeTypes = useMemo(() => getEdgeTypesForReactFlow(), []);

  const dispatch = useDispatch();

  const handleDelete = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        const selectedNode = nodes.find((node) => node.selected);
        const selectedEdge = edges.find((edge) => edge.selected);

        if (selectedNode) dispatch(deleteNodes([selectedNode.id]));
        if (selectedEdge) dispatch(deleteEdges([selectedEdge.id]));
      }
    },
    [nodes, edges, dispatch],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleDelete);
    return () => {
      document.removeEventListener("keydown", handleDelete);
    };
  }, [handleDelete]);

  return (
    <div style={{ width: "100%", height: "600px" }}>
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
