"use client";

import Dialog from "@/components/Dialog";
import { useActors } from "../../actor/hooks/useActors";
import ActorShape from "./ActorShape";
import { ActorDto } from "@repo/shared-schemas";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";
import { useParams } from "next/navigation";

interface ActorSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onActorClick: (actor: ActorDto) => void;
}

export default function ActorSelection({ isOpen, onClose, onActorClick }: ActorSelectionProps) {
  const params = useParams<"/projects/[project-id]/use-case-diagram">();
  const projectId = params["project-id"];

  const { data, isError, isLoading, error } = useActors(projectId);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Use Case Object" className="max-w-lg">
      {isLoading && <Loading isOpen={isLoading} message="Loading actors..." mode="dialog" />}
      {isError && <ErrorMessage message={`Error loading actors: ${error!.message}`} />}
      {data !== undefined && (
        <div className="flex flex-col item-center gap-3 p-1 max-h-96 overflow-y-auto">
          {data!.map((actor) => (
            <button
              key={actor.id}
              onClick={() => {
                onActorClick(actor);
                onClose();
              }}
              className="flex items-center justify-center p-2  hover:text-accent-foreground rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <ActorShape
                name={actor.name}
                style={{ cursor: "pointer", transition: "all 0.2s ease" }}
              />
            </button>
          ))}
        </div>
      )}
    </Dialog>
  );
}
