"use client";

import ActorsTable from "@/modules/features/actor/components/ActorsTable";
import { useParams } from "next/navigation";

export default function ActorsPage() {
  const params = useParams<"/projects/[project-id]/actors">();
  const projectId = params["project-id"];

  return (
    <div>
      <ActorsTable projectId={projectId!}></ActorsTable>
    </div>
  );
}
