"use client";

import Dialog from "@/components/Dialog";
import { useActors } from "../../actor/hooks/useActors";
import ActorShape from "./ActorShape";
import { ActorDto } from "@repo/shared-schemas";

interface ActorSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onActorClick: (actor: ActorDto) => void;
}

export default function ActorSelection({
  isOpen,
  onClose,
  projectId,
  onActorClick,
}: ActorSelectionProps) {
  const { data, isError, isLoading, error } = useActors(projectId);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Use Case Object" className="max-w-lg">
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading use cases...</div>
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-center py-8">
          <div className="text-destructive bg-destructive/10 border border-destructive/20 p-4 rounded-xl">
            Error loading use cases: {error!.message}
          </div>
        </div>
      )}

      {data !== undefined &&
        data!.map((actor) => (
          <button
            key={actor.id}
            onClick={() => {
              onActorClick(actor);
              onClose();
            }}
          >
            <ActorShape name={actor.name} />
          </button>
        ))}
    </Dialog>
  );
}
