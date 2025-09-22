"use client";

import Button from "@/components/Button";
import Table, { Column } from "@/components/Table";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { notifications } from "@mantine/notifications";
import { UseCaseListDto } from "@repo/shared-schemas";
import { useState } from "react";
import { useDeletePrimaryUseCase } from "../hooks/useDeletePrimaryUseCase";
import { useUseCases } from "../hooks/useUseCases";
import UseCaseForm from "./UseCaseForm";

interface UseCasesTableProps {
  projectId: string;
}

export default function UseCasesTable({ projectId }: UseCasesTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data, isError, isLoading, error } = useUseCases(projectId);

  // State for confirmation dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseListDto | null>(null);

  const deleteMutation = useDeletePrimaryUseCase(selectedUseCase?.id ?? "", {
    onSuccess: () => {
      notifications.show({
        title: "Use Case Deleted",
        message: "The use case has been successfully deleted.",
        color: "green",
      });
      setConfirmOpen(false);
      setSelectedUseCase(null);
    },
    onError: () => {
      notifications.show({
        title: "Delete Failed",
        message: "Failed to delete the use case. Please try again.",
        color: "red",
      });
      setConfirmOpen(false);
      setSelectedUseCase(null);
    },
  });

  const handleEdit = (useCase: UseCaseListDto) => {
    notifications.show({
      title: "Edit Use Case",
      message: "Edit functionality coming soon",
      color: "blue",
    });
  };

  const requestDelete = (useCase: UseCaseListDto) => {
    setSelectedUseCase(useCase);
    setConfirmOpen(true);
  };

  const columns: Column<UseCaseListDto>[] = [
    {
      key: "name",
      title: "Use Case Name",
      width: "90%",
      render: (_, useCase) => <span>{useCase.name}</span>,
    },
    {
      key: "id",
      title: "Actions",
      width: "10%",
      render: (_, useCase) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(useCase)}
            className="text-primary hover:text-primary-hover text-sm transition-colors"
          >
            Edit
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            onClick={() => requestDelete(useCase)}
            className="text-destructive hover:text-destructive/80 text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading use cases...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-destructive bg-destructive/10 border border-destructive/20 p-4 rounded-xl">
          Error loading use cases: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Use Cases</h2>
        <Button onClick={() => setIsFormOpen(true)}>Add Use Case</Button>
      </div>

      <Table columns={columns} data={data || []} />

      <UseCaseForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} projectId={projectId} />

      <ConfirmationDialog
        isOpen={confirmOpen}
        title="Delete Use Case"
        message={`Are you sure you want to delete "${
          selectedUseCase?.name ?? ""
        }"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedUseCase(null);
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
