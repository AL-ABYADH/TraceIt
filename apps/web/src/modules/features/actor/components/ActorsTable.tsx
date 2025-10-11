"use client";

import Button from "@/components/Button";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";
import Table, { Column } from "@/components/Table";
import { ActorDto } from "@repo/shared-schemas";
import { useState, useEffect } from "react";
import { useActors } from "../hooks/useActors";
import { useDeleteActor } from "../hooks/useDeleteActor";
import ActorForm from "./ActorForm";
import UpdateActorForm from "./UpdateActorForm";

interface ActorsTableProps {
  projectId: string;
  highlightedActorId?: string | null;
}

export default function ActorsTable({ projectId, highlightedActorId }: ActorsTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data, isError, isLoading, error } = useActors(projectId);

  const [editingActor, setEditingActor] = useState<ActorDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ActorDto | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(
    highlightedActorId ?? null,
  );

  const deleteMutation = useDeleteActor(deleteTarget?.id ?? "", {
    onSuccess: () => {
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    },
    onError: () => {},
  });

  const handleEdit = (actor: ActorDto) => setEditingActor(actor);
  const handleDelete = (actor: ActorDto) => {
    setDeleteTarget(actor);
    setIsDeleteOpen(true);
  };
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate();
  };

  // Clear the highlight after 5 seconds
  useEffect(() => {
    if (!activeHighlightId) return;

    const timer = setTimeout(() => setActiveHighlightId(null), 5000);
    return () => clearTimeout(timer);
  }, [activeHighlightId]);

  const columns: Column<ActorDto>[] = [
    { key: "name", title: "Actor Name", width: "30%" },
    { key: "type", title: "Actor Type", width: "25%" },
    { key: "subtype", title: "Subtype", width: "25%" },
    {
      key: "id",
      title: "Actions",
      width: "10%",
      render: (_, actor) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(actor)}
            className="text-primary hover:text-primary-hover text-sm transition-colors"
          >
            Edit
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            onClick={() => handleDelete(actor)}
            className="text-destructive hover:text-destructive/80 text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <Loading isOpen={true} message="Loading actors..." />;
  if (isError) return <ErrorMessage message={`Error loading actors: ${error.message}`} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Actors</h2>
        <Button onClick={() => setIsFormOpen(true)}>Add Actor</Button>
      </div>

      {data?.length ? (
        <Table columns={columns} data={data} highlightedId={activeHighlightId} />
      ) : (
        <p className="text-muted-foreground text-sm">
          No actors found. Click <strong>Add Actor</strong> to create one.
        </p>
      )}

      <ActorForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} projectId={projectId} />

      {editingActor && (
        <UpdateActorForm
          isOpen={!!editingActor}
          onClose={() => setEditingActor(null)}
          actor={editingActor}
        />
      )}

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        message={`Are you sure you want to delete actor "${deleteTarget?.name}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />

      {deleteMutation.isError && (
        <ErrorMessage
          message={`Failed to delete actor: ${deleteMutation.error?.message ?? "Unknown error"}`}
        />
      )}
    </div>
  );
}
