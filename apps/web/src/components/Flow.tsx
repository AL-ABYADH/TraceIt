"use client";

import React, { useMemo } from "react";
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
