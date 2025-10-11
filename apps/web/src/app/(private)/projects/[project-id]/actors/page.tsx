"use client";

import ActorsTable from "@/modules/features/actor/components/ActorsTable";
import { useParams, useSearchParams } from "next/navigation";

export default function ActorsPage() {
  const params = useParams<"/projects/[project-id]/actors">();
  const projectId = params["project-id"];

  const searchParams = useSearchParams();
  const highlightedActorId = searchParams.get("actorId");

  return (
    <div>
      {/* Pass it down to the table so it can highlight the right actor */}
      <ActorsTable projectId={projectId!} highlightedActorId={highlightedActorId} />
    </div>
  );
}
