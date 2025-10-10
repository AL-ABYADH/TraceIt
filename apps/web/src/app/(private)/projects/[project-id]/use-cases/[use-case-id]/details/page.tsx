"use client";

import UseCaseDetails from "@/modules/features/use-case/components/UseCaseDetails";
import { UseCaseSubtype } from "@repo/shared-schemas";
import { useParams, useSearchParams } from "next/navigation";

export default function UseCaseDetailsPage() {
  const params = useParams<"/projects/[project-id]/use-cases/[use-case-id]/details">();
  const searchParams = useSearchParams();

  const projectId = params["project-id"];
  const useCaseId = params["use-case-id"];
  const type = searchParams.get("type");

  return (
    <UseCaseDetails
      projectId={projectId}
      useCaseId={useCaseId}
      useCaseSubType={(type as UseCaseSubtype) ?? "PRIMARY"}
    />
  );
}
