import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EdgeType } from "@repo/shared-schemas";
import {
  Node,
  Edge,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
  NodeChange,
  EdgeChange,
  Connection,
  Viewport,
} from "@xyflow/react";

// ===================
// TYPES
// ===================

interface FlowSnapshot {
  nodes: Node[];
  edges: Edge[];
  timestamp: number;
}

interface FlowHistory {
  past: FlowSnapshot[];
  present: FlowSnapshot | null;
  future: FlowSnapshot[];
  maxHistorySize: number;
}

export interface FlowState {
  // Core flow data
  nodes: Node[];
  edges: Edge[];

  // Selection state
  selectedNodes: string[];
  selectedEdges: string[];

  // UI state
  viewport: Viewport;

  // History for undo/redo
  history: FlowHistory;

  // Change tracking
  isDirty: boolean;
  lastSavedState: FlowSnapshot | null;
}

interface LoadFlowDataPayload {
  nodes: Node[];
  edges: Edge[];
}

interface UpdateNodePayload {
  id: string;
  updates: Partial<Node>;
}

interface UpdateEdgePayload {
  id: string;
  updates: Partial<Edge>;
}

interface SetSelectedElementsPayload {
  nodes?: string[];
  edges?: string[];
}

// ===================
// HELPER FUNCTIONS
// ===================

const createSnapshot = (nodes: Node[], edges: Edge[]): FlowSnapshot => ({
  nodes: JSON.parse(JSON.stringify(nodes)),
  edges: JSON.parse(JSON.stringify(edges)),
  timestamp: Date.now(),
});

const statesAreEqual = (state1: FlowSnapshot | null, state2: FlowSnapshot | null): boolean => {
  if (!state1 || !state2) return false;
  return (
    JSON.stringify(state1.nodes) === JSON.stringify(state2.nodes) &&
    JSON.stringify(state1.edges) === JSON.stringify(state2.edges)
  );
};

// ===================
// INITIAL STATE
// ===================

const initialState: FlowState = {
  nodes: [],
  edges: [],
  selectedNodes: [],
  selectedEdges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  history: {
    past: [],
    present: null,
    future: [],
    maxHistorySize: 50,
  },
  isDirty: false,
  lastSavedState: null,
};

// ===================
// FLOW SLICE
// ===================

const flow = createSlice({
  name: "use-case-diagram",
  initialState,
  reducers: {
    // ===================
    // DATA LOADING
    // ===================

    loadFlowData: (state, action: PayloadAction<LoadFlowDataPayload>) => {
      const { nodes, edges } = action.payload;
      state.nodes = nodes;
      state.edges = edges;
      state.selectedNodes = [];
      state.selectedEdges = [];
      state.isDirty = false;

      // Set as last saved state
      state.lastSavedState = createSnapshot(nodes, edges);

      // Clear history
      state.history = {
        past: [],
        present: null,
        future: [],
        maxHistorySize: 50,
      };
    },

    markAsSaved: (state) => {
      state.isDirty = false;
      state.lastSavedState = createSnapshot(state.nodes, state.edges);
    },

    // ===================
    // CORE FLOW OPERATIONS
    // ===================

    onNodesChange: (state, action: PayloadAction<NodeChange[]>) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes);

      // Update selection state
      state.selectedNodes = state.nodes.filter((node) => node.selected).map((node) => node.id);

      // Check if dirty
      if (state.lastSavedState) {
        state.isDirty = !statesAreEqual(
          createSnapshot(state.nodes, state.edges),
          state.lastSavedState,
        );
      }
    },

    onEdgesChange: (state, action: PayloadAction<EdgeChange[]>) => {
      state.edges = applyEdgeChanges(action.payload, state.edges);

      // Update selection state
      state.selectedEdges = state.edges.filter((edge) => edge.selected).map((edge) => edge.id);

      // Check if dirty
      if (state.lastSavedState) {
        state.isDirty = !statesAreEqual(
          createSnapshot(state.nodes, state.edges),
          state.lastSavedState,
        );
      }
    },

    onConnect: (state, action: PayloadAction<Connection & { type: EdgeType; data?: any }>) => {
      if (action.payload.target === action.payload.source) return;
      const newEdge: Edge = {
        id: `e${action.payload.source}-${action.payload.target}-${Date.now()}`,
        source: action.payload.source!,
        target: action.payload.target!,
        sourceHandle: action.payload.sourceHandle,
        targetHandle: action.payload.targetHandle,
        type: action.payload.type,
        data: action.payload.data,
      };
      state.edges = addEdge(newEdge, state.edges);
      state.isDirty = true;
    },

    // ===================
    // NODE OPERATIONS
    // ===================

    addNode: (state, action: PayloadAction<Partial<Node>>) => {
      const newNode: Node = {
        id: action.payload.id || `node-${Date.now()}`,
        type: action.payload.type || "default",
        data: action.payload.data as any,
        position: action.payload.position ?? { x: 0, y: 0 },
      };
      state.nodes.push(newNode);
      state.isDirty = true;
    },

    updateNode: (state, action: PayloadAction<UpdateNodePayload>) => {
      const { id, updates } = action.payload;
      const node = state.nodes.find((node) => node.id === id);
      if (node) {
        state.nodes[state.nodes.indexOf(node)] = {
          ...node,
          ...updates,
        };
        state.isDirty = true;
      }
    },

    deleteNodes: (state, action: PayloadAction<string | string[]>) => {
      const nodeIds = Array.isArray(action.payload) ? action.payload : [action.payload];

      // Remove nodes
      state.nodes = state.nodes.filter((node) => !nodeIds.includes(node.id));

      // Remove connected edges
      state.edges = state.edges.filter(
        (edge) => !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target),
      );

      // Clear selection
      state.selectedNodes = state.selectedNodes.filter((id) => !nodeIds.includes(id));
      state.isDirty = true;
    },

    duplicateNodes: (state, action: PayloadAction<string | string[]>) => {
      const nodeIds = Array.isArray(action.payload) ? action.payload : [action.payload];
      const nodesToDuplicate = state.nodes.filter((node) => nodeIds.includes(node.id));

      const duplicatedNodes: Node[] = nodesToDuplicate.map((node) => ({
        ...node,
        id: `${node.id}-copy-${Date.now()}`,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
        selected: false,
        data: {
          ...node.data,
          label: `${node.data?.label || "Node"} (Copy)`,
        },
      }));

      state.nodes.push(...duplicatedNodes);
      state.isDirty = true;
    },

    // ===================
    // EDGE OPERATIONS
    // ===================

    addEdgeManually: (
      state,
      action: PayloadAction<Partial<Edge> & { source: string; target: string }>,
    ) => {
      const newEdge: Edge = {
        ...action.payload,
        id: action.payload.id || `edge-${Date.now()}`,
        source: action.payload.source,
        target: action.payload.target,
        sourceHandle: action.payload.sourceHandle,
        targetHandle: action.payload.targetHandle,
        data: { label: "" },
      };
      state.edges.push(newEdge);
      state.isDirty = true;
    },

    updateEdge: (state, action: PayloadAction<UpdateEdgePayload>) => {
      const { id, updates } = action.payload;
      const edge = state.edges.find((edge) => edge.id === id);
      if (edge) {
        state.edges[state.edges.indexOf(edge)] = {
          ...edge,
          ...updates,
        };
        state.isDirty = true;
      }
    },

    deleteEdges: (state, action: PayloadAction<string | string[]>) => {
      const edgeIds = Array.isArray(action.payload) ? action.payload : [action.payload];
      state.edges = state.edges.filter((edge) => !edgeIds.includes(edge.id));
      state.selectedEdges = state.selectedEdges.filter((id) => !edgeIds.includes(id));
      state.isDirty = true;
    },

    // ===================
    // SELECTION OPERATIONS
    // ===================

    setSelectedElements: (state, action: PayloadAction<SetSelectedElementsPayload>) => {
      state.selectedNodes = action.payload.nodes || [];
      state.selectedEdges = action.payload.edges || [];
    },

    selectAll: (state) => {
      state.selectedNodes = state.nodes.map((node) => node.id);
      state.selectedEdges = state.edges.map((edge) => edge.id);

      // Update selected state on elements
      state.nodes.forEach((node) => {
        node.selected = true;
      });
      state.edges.forEach((edge) => {
        edge.selected = true;
      });
    },

    clearSelection: (state) => {
      state.selectedNodes = [];
      state.selectedEdges = [];

      // Update selected state on elements
      state.nodes.forEach((node) => {
        node.selected = false;
      });
      state.edges.forEach((edge) => {
        edge.selected = false;
      });
    },

    // ===================
    // BULK OPERATIONS
    // ===================

    clearFlow: (state) => {
      state.nodes = [];
      state.edges = [];
      state.selectedNodes = [];
      state.selectedEdges = [];
      state.isDirty = true;
    },

    // ===================
    // VIEWPORT OPERATIONS
    // ===================

    updateViewport: (state, action: PayloadAction<Viewport>) => {
      state.viewport = action.payload;
    },

    // ===================
    // HISTORY OPERATIONS
    // ===================

    saveToHistory: (state) => {
      const currentState = createSnapshot(state.nodes, state.edges);

      // Don't save if nothing changed
      if (state.history.present && statesAreEqual(currentState, state.history.present)) {
        return;
      }

      if (state.history.present) {
        state.history.past.push(state.history.present);
      }
      state.history.present = currentState;
      state.history.future = [];

      // Limit history size
      if (state.history.past.length > state.history.maxHistorySize) {
        state.history.past = state.history.past.slice(-state.history.maxHistorySize);
      }
    },

    undo: (state) => {
      if (state.history.past.length > 0) {
        const previous = state.history.past.pop()!;
        if (state.history.present) {
          state.history.future.unshift(state.history.present);
        }
        state.history.present = previous;
        state.nodes = previous.nodes;
        state.edges = previous.edges;
        state.selectedNodes = [];
        state.selectedEdges = [];

        // Update dirty state
        if (state.lastSavedState) {
          state.isDirty = !statesAreEqual(previous, state.lastSavedState);
        }
      }
    },

    redo: (state) => {
      if (state.history.future.length > 0) {
        const next = state.history.future.shift()!;
        if (state.history.present) {
          state.history.past.push(state.history.present);
        }
        state.history.present = next;
        state.nodes = next.nodes;
        state.edges = next.edges;
        state.selectedNodes = [];
        state.selectedEdges = [];

        // Update dirty state
        if (state.lastSavedState) {
          state.isDirty = !statesAreEqual(next, state.lastSavedState);
        }
      }
    },

    clearHistory: (state) => {
      state.history = {
        past: [],
        present: null,
        future: [],
        maxHistorySize: 50,
      };
    },
  },
});

// ===================
// EXPORT ACTIONS
// ===================

export const {
  // Data loading
  loadFlowData,
  markAsSaved,

  // Core operations
  onNodesChange,
  onEdgesChange,
  onConnect,

  // Node operations
  addNode,
  updateNode,
  deleteNodes,
  duplicateNodes,

  // Edge operations
  addEdgeManually,
  updateEdge,
  deleteEdges,

  // Selection operations
  setSelectedElements,
  selectAll,
  clearSelection,

  // Bulk operations
  clearFlow,

  // Viewport operations
  updateViewport,

  // History operations
  saveToHistory,
  undo,
  redo,
  clearHistory,
} = flow.actions;

// ===================
// SELECTORS
// ===================

// Basic selectors
export const selectNodes = (state: RootState): Node[] => state.flow.nodes;
export const selectEdges = (state: RootState): Edge[] => state.flow.edges;
export const selectSelectedNodes = (state: RootState): string[] => state.flow.selectedNodes;
export const selectSelectedEdges = (state: RootState): string[] => state.flow.selectedEdges;
export const selectViewport = (state: RootState): Viewport => state.flow.viewport;
export const selectIsDirty = (state: RootState): boolean => state.flow.isDirty;

// History selectors
export const selectCanUndo = (state: RootState): boolean => state.flow.history.past.length > 0;
export const selectCanRedo = (state: RootState): boolean => state.flow.history.future.length > 0;

// Flow data for React Query
export const selectFlowDataForSaving = (state: RootState) => ({
  nodes: state.flow.nodes,
  edges: state.flow.edges,
});

export default flow.reducer;
