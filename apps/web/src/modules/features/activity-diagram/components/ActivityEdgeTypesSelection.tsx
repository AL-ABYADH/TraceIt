"use client";

import Dialog from "@/components/Dialog";
import { EdgeType } from "@repo/shared-schemas";

export type ActivityEdgeType = EdgeType.ACTIVITY_FLOW;

interface ActivityEdgeTypesSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onActivityEdgeTypesClick: (type: ActivityEdgeType) => void;
}

export default function ActivityEdgeTypesSelection({
  isOpen,
  onClose,
  onActivityEdgeTypesClick,
}: ActivityEdgeTypesSelectionProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Activity Connection"
      className="max-w-md"
    >
      <div className="space-y-4 p-1">
        <div className="text-sm text-muted-foreground text-center">
          Connect activities with control flow to represent the sequence of actions.
        </div>

        <button
          onClick={() => {
            onActivityEdgeTypesClick(EdgeType.ACTIVITY_FLOW);
            onClose();
          }}
          className="w-full flex flex-col items-center justify-center p-6 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <div className="text-center">
            <div className="font-medium text-sm">{EdgeType.ACTIVITY_FLOW}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Represents the sequence and flow between activities
            </div>
          </div>
        </button>

        <div className="text-xs text-muted-foreground text-center border-t pt-3">
          Control flow shows the order in which activities are performed.
        </div>
      </div>
    </Dialog>
  );
}
