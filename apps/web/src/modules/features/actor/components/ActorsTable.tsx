"use client";

import { useActors } from "../hooks/useActors";
import Table, { Column } from "@/components/Table";
import Button from "@/components/Button";
import ActorForm from "./ActorForm";
import { ActorDto } from "@repo/shared-schemas";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

interface ActorsTableProps {
  projectId: string;
}

export default function ActorsTable({ projectId }: ActorsTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data, isError, isLoading, error } = useActors(projectId);

  const handleEdit = (actor: ActorDto) => {
    console.log("Edit actor:", actor);
    notifications.show({
      title: "Edit Actor",
      message: "Edit functionality coming soon",
      color: "blue",
    });
  };

  const handleDelete = (actor: ActorDto) => {
    console.log("Delete actor:", actor);
    notifications.show({
      title: "Delete Actor",
      message: "Delete functionality coming soon",
      color: "orange",
    });
  };

  const columns: Column<ActorDto>[] = [
    {
      key: "name",
      title: "Actor Name",
      width: "30%",
    },
    {
      key: "type",
      title: "Actor Type",
      width: "25%",
    },
    {
      key: "subtype",
      title: "Subtype",
      width: "25%",
    },
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading actors...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-destructive bg-destructive/10 border border-destructive/20 p-4 rounded-xl">
          Error loading actors: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Actors</h2>
        <Button onClick={() => setIsFormOpen(true)}>Add Actor</Button>
      </div>

      <Table columns={columns} data={data || []} />

      <ActorForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} projectId={projectId} />
    </div>
  );
}
