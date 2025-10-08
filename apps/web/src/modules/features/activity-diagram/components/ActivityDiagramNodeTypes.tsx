import { NodeType } from "@repo/shared-schemas";
import { ActivityShape } from "./ActivityShape";
import { DecisionShape } from "./DecisionShape";
import { InitialShape } from "./InitialShape";
import { FinalShape } from "./FinalShape";
import { FlowFinalShape } from "./FlowFinalShape";
import { MergeShape } from "./MergeShape";
import { ForkShape } from "./ForkShape";
import { JoinShape } from "./JoinShape";

interface NodeOptionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}

function NodeOption({ icon, label, description, onClick }: NodeOptionProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 w-full group"
    >
      <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-white rounded-lg border border-gray-200 group-hover:border-blue-400 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
          {label}
        </h3>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{description}</p>
      </div>
    </button>
  );
}

export default function ActivityDiagramNodeTypes({
  onClose,
  onClick,
}: {
  onClose: () => void;
  onClick: (nodeType: NodeType) => void;
}) {
  const ICON_SIZE = 36; // consistent icon size

  const nodeOptions = [
    {
      type: NodeType.ACTIVITY,
      label: "Activity",
      description: "Represents an action or task in the workflow",
      icon: <ActivityShape width={54} height={34} name="" />,
    },
    {
      type: NodeType.DECISION_NODE,
      label: "Decision",
      description: "Branching point with multiple possible outcomes",
      icon: <DecisionShape name="" width={ICON_SIZE} height={ICON_SIZE} />,
    },
    {
      type: NodeType.INITIAL_NODE,
      label: "Initial Node",
      description: "Starting point of the activity flow",
      icon: <InitialShape size={ICON_SIZE} />,
    },
    {
      type: NodeType.FINAL_NODE,
      label: "Final Node",
      description: "End point of the activity flow",
      icon: <FinalShape size={ICON_SIZE} />,
    },
    {
      type: NodeType.FLOW_FINAL_NODE,
      label: "Flow Final",
      description: "Terminates a specific flow without ending entire activity",
      icon: <FlowFinalShape size={ICON_SIZE} />,
    },
    {
      type: NodeType.MERGE_NODE,
      label: "Merge Node",
      description: "Combines multiple flows into a single flow",
      icon: <MergeShape size={ICON_SIZE} />,
    },
    {
      type: NodeType.FORK_NODE,
      label: "Fork Node",
      description: "Splits a flow into multiple concurrent flows",
      icon: <ForkShape width={ICON_SIZE} height={ICON_SIZE} />,
    },
    {
      type: NodeType.JOIN_NODE,
      label: "Join Node",
      description: "Synchronizes multiple concurrent flows",
      icon: <JoinShape width={ICON_SIZE} height={ICON_SIZE} />,
    },
  ];

  const handleNodeClick = (nodeType: NodeType) => {
    onClick(nodeType);
    onClose();
  };

  return (
    <div className="p-2">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Activity Diagram Elements</h2>
        <p className="text-gray-600 text-sm">
          Select an element to add to your diagram. Each element represents a specific activity or
          control flow.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodeOptions.map((option) => (
          <NodeOption
            key={option.type}
            icon={option.icon}
            label={option.label}
            description={option.description}
            onClick={() => handleNodeClick(option.type)}
          />
        ))}
      </div>
    </div>
  );
}
