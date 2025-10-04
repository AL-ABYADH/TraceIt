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
