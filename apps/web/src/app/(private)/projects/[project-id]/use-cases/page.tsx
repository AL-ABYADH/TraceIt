"use client";

import UseCasesTable from "@/modules/features/use-case/components/UseCasesTable";
import { useParams } from "next/navigation";

export default function UseCasesPage() {
  const params = useParams<"/projects/[project-id]/use-cases">();
  const projectId = params["project-id"];

  return (
    <div>
      <UseCasesTable projectId={projectId!}></UseCasesTable>
    </div>
  );
}
