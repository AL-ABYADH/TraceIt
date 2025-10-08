"use client";

import Button from "@/components/Button";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";
import Table, { Column } from "@/components/Table";
import { notifications } from "@mantine/notifications";
import { UseCaseListDto } from "@repo/shared-schemas";
import { useRouter } from "next/navigation";
import { route } from "nextjs-routes";
import { useEffect, useState } from "react";
import { useDeletePrimaryUseCase } from "../hooks/useDeletePrimaryUseCase";
import { useUseCases } from "../hooks/useUseCases";
import UseCaseForm from "./UseCaseForm";

interface UseCasesTableProps {
  projectId: string;
}

export default function UseCasesTable({ projectId }: UseCasesTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editUseCase, setEditUseCase] = useState<UseCaseListDto | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseListDto | null>(null);

  const router = useRouter();
  const { data, isError, isLoading, error } = useUseCases(projectId);

  useEffect(() => {
    if (isError && !serverError) {
      setServerError(error?.message ?? "Failed to load use cases. Please refresh and try again.");
    }
  }, [isError, error, serverError]);

  const deleteMutation = useDeletePrimaryUseCase(selectedUseCase?.id ?? "", {
    onSuccess: () => {
      notifications.show({
        title: "Deleted",
        message: `Use Case deleted successfully`,
        color: "green",
      });
      resetDeleteState();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Failed to delete use case. Please try again.";
      setServerError(msg);
      resetDeleteState();
    },
  });

  const resetDeleteState = () => {
    setConfirmOpen(false);
    setSelectedUseCase(null);
  };

  const handleEdit = (useCase: UseCaseListDto) => {
    setEditUseCase(useCase);
    setIsFormOpen(true);
  };

  const requestDelete = (useCase: UseCaseListDto) => {
    setSelectedUseCase(useCase);
    setConfirmOpen(true);
  };

  const columns: Column<UseCaseListDto>[] = [
    {
      key: "name",
      title: "Use Case Name",
      width: "60%",
      render: (_, useCase) => <span>{useCase.name}</span>,
    },
    {
      key: "subtype",
      title: "Type",
      width: "20%",
      render: (_, useCase) => <h2>{useCase.subtype}</h2>,
    },
    {
      key: "id",
      title: "Actions",
      width: "10%",
      render: (_, useCase) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(useCase);
            }}
            className="text-primary hover:text-primary-hover text-sm transition-colors"
          >
            Edit
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              requestDelete(useCase);
            }}
            className="text-destructive hover:text-destructive/80 text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loading isOpen={isLoading} message="Loading use cases..." mode="dialog" />;
  }

  return (
    <div className="space-y-4">
      {serverError && <ErrorMessage message={serverError} />}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Use Cases</h2>
        <Button onClick={() => setIsFormOpen(true)}>Add Use Case</Button>
      </div>

      {data?.length ? (
        <Table
          columns={columns}
          data={data.toReversed()}
          onRowClick={(useCase) =>
            router.push(
              route({
                pathname: "/projects/[project-id]/use-cases/[use-case-id]/details",
                query: {
                  "project-id": projectId,
                  "use-case-id": useCase.id,
                },
              }),
            )
          }
        />
      ) : (
        <p className="text-muted-foreground text-sm">
          No use cases found. Click <strong>Add Use Case</strong> to create one.
        </p>
      )}

      <UseCaseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditUseCase(null);
        }}
        projectId={projectId}
        mode={editUseCase ? "edit" : "create"}
        useCaseId={editUseCase?.id ?? undefined}
      />

      <ConfirmationDialog
        isOpen={confirmOpen}
        title="Delete Use Case"
        message={`Are you sure you want to delete "${selectedUseCase?.name ?? ""}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => deleteMutation.mutate()}
        onCancel={resetDeleteState}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
