"use client";

import { useParams } from "next/navigation";
import RequirementsList from "../../../../../modules/features/requirement/components/RequirementList";

export default function RequirementsPage() {
  const params = useParams<"/projects/[project-id]/requirements">();
  const projectId = params["project-id"];

  return (
    <div>
      <RequirementsList projectId={projectId!} />
    </div>
  );
}
