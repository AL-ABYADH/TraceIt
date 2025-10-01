"use client";

import UseCaseDetails from "@/modules/features/use-case/components/UseCaseDetails";
import { useParams } from "next/navigation";

export default function UseCaseDetailsPage() {
  const params = useParams<"/projects/[project-id]/use-cases/[use-case-id]/details">();
  const projectId = params["project-id"];
  const useCaseId = params["use-case-id"];

  return <UseCaseDetails projectId={projectId} useCaseId={useCaseId} />;
}
