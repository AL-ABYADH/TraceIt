"use client";

import Button from "@/components/Button";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Table, { Column } from "@/components/Table";
import { notifications } from "@mantine/notifications";
import { ActorDto } from "@repo/shared-schemas";
import { useState } from "react";
import { useActors } from "../hooks/useActors";
import { useDeleteActor } from "../hooks/useDeleteActor";
import ActorForm from "./ActorForm";
import UpdateActorForm from "./UpdateActorForm"; // ✅ Import the update form

interface ActorsTableProps {
  projectId: string;
}

export default function ActorsTable({ projectId }: ActorsTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false); // add
  const { data, isError, isLoading, error } = useActors(projectId);

  const [editingActor, setEditingActor] = useState<ActorDto | null>(null); // ✅ for editing

  const [deleteTarget, setDeleteTarget] = useState<ActorDto | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const deleteMutation = useDeleteActor(deleteTarget?.id ?? "", {
    onSuccess: () => {
      notifications.show({
        title: "Deleted",
        message: `Actor "${deleteTarget?.name}" deleted successfully`,
        color: "green",
      });
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to delete actor",
        color: "red",
      });
    },
  });

  const handleEdit = (actor: ActorDto) => {
    setEditingActor(actor);
  };

  const handleDelete = (actor: ActorDto) => {
    setDeleteTarget(actor);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate();
  };

  const columns: Column<ActorDto>[] = [
    { key: "name", title: "Actor Name", width: "30%" },
    { key: "type", title: "Actor Type", width: "25%" },
    { key: "subtype", title: "Subtype", width: "25%" },
    {
      key: "id",
      title: "Actions",
      width: "20%",
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading actors...</div>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-destructive bg-destructive/10 border border-destructive/20 p-4 rounded-xl">
          Error loading actors: {error.message}
        </div>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Actors</h2>
        <Button onClick={() => setIsFormOpen(true)}>Add Actor</Button>
      </div>

      <Table columns={columns} data={data || []} />

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
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
