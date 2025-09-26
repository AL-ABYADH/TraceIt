"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { route } from "nextjs-routes";
import { FolderIcon } from "lucide-react";
import { ProjectDto, UpdateProjectDto } from "@repo/shared-schemas";

import { notifications } from "@mantine/notifications";
import EllipsisMenu from "@/components/EllipsisMenu";
import ProjectForm from "./ProjectForm";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useDeleteProject } from "../hooks/useDeleteProject";
import { useUpdateProject } from "../hooks/useUpdateProject";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

interface ProjectCardProps {
  project: ProjectDto;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [timeAgo, setTimeAgo] = useState("");
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // NEW
  const [serverError, setServerError] = useState<string | null>(null);

  const deleteProject = useDeleteProject(project.id, {
    onSuccess: () => {
      notifications.show({
        title: "Deleted",
        message: "Project deleted successfully!",
        color: "green",
        autoClose: 3000,
      });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to delete project";
      setServerError(msg);
    },
  });

  const updateProject = useUpdateProject(project.id, {
    onSuccess: () => {
      notifications.show({
        title: "Updated",
        message: "Project updated successfully!",
        color: "green",
        autoClose: 3000,
      });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to update project";
      setServerError(msg);
    },
  });

  useEffect(() => {
    if (!project.createdAt) return;
    const now = new Date();
    const created = new Date(project.createdAt);
    const diffHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) setTimeAgo("Just now");
    else if (diffHours < 24) setTimeAgo(`${diffHours} hour${diffHours > 1 ? "s" : ""} ago`);
    else {
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) setTimeAgo(`${diffDays} day${diffDays > 1 ? "s" : ""} ago`);
      else {
        const weeks = Math.floor(diffDays / 7);
        setTimeAgo(`${weeks} week${weeks > 1 ? "s" : ""} ago`);
      }
    }
  }, [project.createdAt]);

  const handleDeleteConfirm = () => {
    setServerError(null);
    deleteProject.mutate();
    setIsDeleteOpen(false);
  };

  const handleUpdate = (values: UpdateProjectDto) => {
    setServerError(null);
    updateProject.mutate(values);
    setIsUpdateOpen(false);
  };

  return (
    <>
      {(deleteProject.isPending || updateProject.isPending) && (
        <Loading
          isOpen={deleteProject.isPending || updateProject.isPending}
          message={deleteProject.isPending ? "Deleting project..." : "Updating project..."}
        />
      )}
      {serverError && <ErrorMessage message={serverError} />}

      <div className="flex items-center justify-between px-4 bg-surface rounded-lg border border-border hover:bg-card-hover transition-colors group">
        <Link
          href={route({
            pathname: "/projects/[project-id]/actors",
            query: { "project-id": project.id },
          })}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          <FolderIcon className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          <span className="truncate p-4 text-foreground font-medium">{project.name}</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">{timeAgo || "Recently"}</span>
          <EllipsisMenu
            actions={[
              { label: "Edit", onClick: () => setIsUpdateOpen(true) },
              { label: "Delete", onClick: () => setIsDeleteOpen(true) }, // OPEN CONFIRMATION
            ]}
          />
        </div>
      </div>

      {isUpdateOpen && (
        <ProjectForm
          isOpen={isUpdateOpen}
          onClose={() => setIsUpdateOpen(false)}
          onSubmitUpdate={handleUpdate}
          initialData={{
            name: project.name,
            description: project.description ?? "",
          }}
          mode="update"
          isPending={updateProject.isPending}
        />
      )}

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
        loading={deleteProject.isPending}
      />
    </>
  );
}
