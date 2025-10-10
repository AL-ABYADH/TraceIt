"use client";

import UseCasesTable from "@/modules/features/use-case/components/UseCasesTable";
import { useParams, useSearchParams } from "next/navigation";

export default function UseCasesPage() {
  const params = useParams<"/projects/[project-id]/use-cases">();
  const projectId = params["project-id"];

  const searchParams = useSearchParams();
  const highlightedUseCaseId = searchParams.get("useCaseId");

  return (
    <div>
      {/* Pass it down to the table so it can highlight the right one */}
      <UseCasesTable projectId={projectId!} highlightedUseCaseId={highlightedUseCaseId} />
    </div>
  );
}
