import { NodeType } from "@repo/shared-schemas";
import ActorShape from "./ActorShape";
import { UseCaseShape } from "./UseCaseShape";

import React from "react";

interface NodeOptionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}

function NodeOption({ icon, label, description, onClick }: NodeOptionProps) {
  const buttonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    borderRadius: "12px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#2a2a2a",
    width: "100%",
    transition: "all 0.25s ease",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  };

  const hoverStyle: React.CSSProperties = {
    borderColor: "#4f9cf9",
    boxShadow: "0 4px 10px rgba(59, 130, 246, 0.15)",
  };

  const iconContainer: React.CSSProperties = {
    flexShrink: 0,
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    transition: "all 0.25s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 600,
    color: "#ffffff",
    fontSize: "16px",
    marginBottom: "4px",
    transition: "color 0.25s ease",
  };

  const descriptionStyle: React.CSSProperties = {
    color: "#ffffff",
    fontSize: "14px",
    lineHeight: 1.5,
  };

  const [hover, setHover] = React.useState(false);

  return (
    <button
      onClick={onClick}
      style={hover ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          ...iconContainer,
          borderColor: hover ? "#4f9cf9" : "#2a2a2a",
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          style={{
            ...labelStyle,
            color: hover ? "#4f9cf9" : "#ffffff",
          }}
        >
          {label}
        </h3>
        <p style={descriptionStyle}>{description}</p>
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
  const ICON_SIZE = 68;

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

  const containerStyle: React.CSSProperties = {
    padding: "15px",
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: "24px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: 600,
    color: "#ffffff",
    marginBottom: "6px",
  };

  const subtitleStyle: React.CSSProperties = {
    color: "#ffffff",
    fontSize: "15px",
    lineHeight: 1.5,
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "16px",
  };

  const handleNodeClick = (nodeType: NodeType) => {
    onClick(nodeType);
    onClose();
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Use Case Diagram Elements</h2>
        <p style={subtitleStyle}>
          Select an element to add to your use case diagram. Each represents a key part of system
          interactions.
        </p>
      </div>

      <div style={gridStyle}>
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
