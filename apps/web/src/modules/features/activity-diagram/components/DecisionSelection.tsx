"use client";

import Dialog from "@/components/Dialog";
import { useActivities } from "../hooks/useActivities";
import { ActivityListDto } from "@repo/shared-schemas";
import { DecisionShape } from "./DecisionShape";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

interface DecisionSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onDecisionClick: (activity: ActivityListDto) => void;
}

export default function DecisionSelection({
  isOpen,
  onClose,
  projectId,
  onDecisionClick,
}: DecisionSelectionProps) {
  const { data, isError, isLoading, error } = useActivities(projectId);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Decision(condition/Exception)"
      className="max-w-lg"
    >
      {isLoading && (
        <Loading isOpen={isLoading} message="Loading condition nodes..." mode="dialog" />
      )}
      {isError && <ErrorMessage message={`Error loading condition nodes: ${error!.message}`} />}
      {data !== undefined && (
        <div className="grid grid-cols-1 gap-3 p-1 max-h-96 overflow-y-auto">
          {data.toReversed()!.map((activity) => (
            <button
              key={activity.id}
              onClick={() => {
                onDecisionClick(activity);
                onClose();
              }}
              className="flex items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <DecisionShape
                key={activity.id}
                name={activity.name}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              />
            </button>
          ))}
        </div>
      )}
      {data !== undefined && data.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground text-center">
            <p>No conditions found for this project.</p>
            <p className="text-sm mt-1">Create conditions first to add them to the diagram.</p>
          </div>
        </div>
      )}
    </Dialog>
  );
}
