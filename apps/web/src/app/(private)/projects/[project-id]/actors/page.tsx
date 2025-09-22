"use client";

import ActorsTable from "@/modules/features/actor/components/ActorsTable";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ActorsPage() {
  const [showForm, setShowForm] = useState(false);
  const params = useParams<"/projects/[project-id]/actors">();
  const projectId = params["project-id"];

  return (
    <div>
      <ActorsTable projectId={projectId!}></ActorsTable>
    </div>
  );
}
