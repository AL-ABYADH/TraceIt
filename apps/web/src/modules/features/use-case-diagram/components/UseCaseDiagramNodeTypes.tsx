import { NodeType } from "@repo/shared-schemas";
import ActorShape from "./ActorShape";
import { UseCaseShape } from "./UseCaseShape";

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

export default function UseCaseDiagramNodeTypes({
  onClose,
  onClick,
}: {
  onClose: () => void;
  onClick: (nodeType: NodeType) => void;
}) {
  const ICON_SIZE = 48;

  const nodeOptions = [
    {
      type: NodeType.ACTOR,
      label: "Actor",
      description: "Represents a user or external system that interacts with the system.",
      icon: <ActorShape actorBodyWidth={ICON_SIZE} actorBodyHeight={ICON_SIZE} name="" />,
    },
    {
      type: NodeType.USE_CASE,
      label: "Use Case",
      description: "Describes a system function or interaction initiated by an actor.",
      icon: (
        <UseCaseShape
          maxWidth={160}
          minWidth={80}
          paddingX={20}
          paddingY={10}
          fontSize={12}
          name=""
        />
      ),
    },
  ];

  const handleNodeClick = (nodeType: NodeType) => {
    onClick(nodeType);
    onClose();
  };

  return (
    <div className="p-2">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Use Case Diagram Elements</h2>
        <p className="text-gray-600 text-sm">
          Select an element to add to your use case diagram. Each represents a key part of system
          interactions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
