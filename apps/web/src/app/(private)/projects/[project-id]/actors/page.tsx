"use client";

import ActorForm from "@/modules/features/actor/components/ActorForm";
import ActorsTable from "@/modules/features/actor/components/ActorsTable";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ActorsPage() {
  const [showForm, setShowForm] = useState(false);
  const params = useParams<"/projects/[project-id]/actors">();
  const projectId = params["project-id"];

  const handleCreateProjectClick = () => setShowForm(true);

  const handleFormSubmit = () => setShowForm(false);

  return (
    <div>
      {showForm && (
        // Replace with a dialog when implementing UI
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black z-50">
          <ActorForm projectId={projectId} hideForm={handleFormSubmit} />
        </div>
      )}
      <ActorsTable projectId={projectId!}></ActorsTable>
      <button onClick={handleCreateProjectClick}>Add Actor</button>
    </div>
  );
}
