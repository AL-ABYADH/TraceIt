"use client";

import UseCaseForm from "@/modules/features/use-case/components/UseCaseForm";
import UseCasesTable from "@/modules/features/use-case/components/UseCasesTable";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function UseCasesPage() {
  const [showForm, setShowForm] = useState(false);
  const params = useParams<"/projects/[project-id]/use-cases">();
  const projectId = params["project-id"];

  const handleCreateProjectClick = () => setShowForm(true);

  const handleFormSubmit = () => setShowForm(false);

  return (
    <div>
      {showForm && (
        // Replace with a dialog when implementing UI
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black z-50">
          <UseCaseForm projectId={projectId} hideForm={handleFormSubmit} />
        </div>
      )}
      <UseCasesTable projectId={projectId!}></UseCasesTable>
      <button onClick={handleCreateProjectClick}>Add UseCase</button>
    </div>
  );
}
