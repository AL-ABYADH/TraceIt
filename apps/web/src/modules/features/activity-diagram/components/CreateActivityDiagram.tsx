import Button from "@/components/Button";
import { useCallback } from "react";
import { useCreateActivityDiagram } from "../hooks/useCreateActivityDiagram";

export default function CreateActivityDiagram({
  projectId,
  useCaseId,
}: {
  projectId: string;
  useCaseId: string;
}) {
  const createActivityDiagramMutation = useCreateActivityDiagram();

  const handleCreate = useCallback(() => {
    createActivityDiagramMutation.mutate({ useCaseId, projectId });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Activity Diagram Not Found</h2>
      <p className="text-gray-500 text-center max-w-md">
        This use case doesn't have an activity diagram yet. Create one to get started.
      </p>
      <Button onClick={createActivityDiagramMutation.isPending ? undefined : handleCreate}>
        {createActivityDiagramMutation.isPending ? "Creating..." : "Create Activity Diagram"}
      </Button>
    </div>
  );
}
