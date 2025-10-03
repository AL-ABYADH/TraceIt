import Button from "@/components/Button";
import { useCreateUseCaseDiagram } from "../hooks/useCreateUseCaseDiagram";
import { useCallback } from "react";

export default function CreateUseCaseDiagram({ projectId }: { projectId: string }) {
  const createUseCaseDiagramMutation = useCreateUseCaseDiagram();

  const handleCreate = useCallback(() => {
    createUseCaseDiagramMutation.mutate({ projectId });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Use Case Diagram Not Found</h2>
      <p className="text-gray-500 text-center max-w-md">
        This project doesn't have a use case diagram yet. Create one to get started.
      </p>
      <Button onClick={createUseCaseDiagramMutation.isPending ? undefined : handleCreate}>
        {createUseCaseDiagramMutation.isPending ? "Creating..." : "Create Use Case Diagram"}
      </Button>
    </div>
  );
}
