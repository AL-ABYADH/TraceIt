"use client";

import Dialog from "@/components/Dialog";
import { useActivities } from "../hooks/useActivities";
import { ActivityListDto } from "@repo/shared-schemas";
import { ActivityShape } from "./ActivityShape";

interface ActivitySelectionProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onActivityClick: (activity: ActivityListDto) => void;
}

export default function ActivitySelection({
  isOpen,
  onClose,
  projectId,
  onActivityClick,
}: ActivitySelectionProps) {
  const { data, isError, isLoading, error } = useActivities(projectId);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Activity Object" className="max-w-lg">
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading activities...</div>
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-center py-8">
          <div className="text-destructive bg-destructive/10 border border-destructive/20 p-4 rounded-xl">
            Error loading activities: {error!.message}
          </div>
        </div>
      )}
      {data !== undefined && (
        <div className="grid grid-cols-1 gap-3 p-1 max-h-96 overflow-y-auto">
          {data.toReversed()!.map((activity) => (
            <button
              key={activity.id}
              onClick={() => {
                onActivityClick(activity);
                onClose();
              }}
              className="flex items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <ActivityShape
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
            <p>No activities found for this project.</p>
            <p className="text-sm mt-1">Create activities first to add them to the diagram.</p>
          </div>
        </div>
      )}
    </Dialog>
  );
}
