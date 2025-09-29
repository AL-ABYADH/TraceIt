"use client";

import { useParams } from "next/navigation";

export default function UseCaseDetailsPage() {
  const params = useParams<"/projects/[project-id]/use-cases/[use-case-id]/details">();
  const projectId = params["project-id"];
  const useCaseId = params["use-case-id"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Use Case Details</h1>
      <p className="text-muted-foreground mt-2">Project ID: {projectId}</p>
      <p className="text-muted-foreground">Use Case ID: {useCaseId}</p>{" "}
    </div>
  );
}
