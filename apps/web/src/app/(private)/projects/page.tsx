"use client";

import { useState } from "react";
import { notifications } from "@mantine/notifications";

import ProjectCard from "@/modules/features/project/components/ProjectCard";
import ProjectForm from "@/modules/features/project/components/ProjectForm";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { useProjects } from "@/modules/features/project/hooks/useProjects";
import { useCreateProject } from "@/modules/features/project/hooks/useCreateProject";
import { CreateProjectDto } from "@repo/shared-schemas";

export default function Projects() {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading, isError, error } = useProjects();

  const createProject = useCreateProject({
    onSuccess: (_data, variables) => {
      notifications.show({
        title: "Created",
        message: `Project "${variables.name}" created successfully!`,
        color: "green",
        autoClose: 3000,
      });
      setShowForm(false);
    },
    onError: (err) => {
      const msg =
        (err as any)?.response?.data?.message ??
        (err as any)?.message ??
        "Failed to create project";
      notifications.show({
        title: "Error",
        message: msg,
        color: "red",
        autoClose: 5000,
      });
    },
  });

  const handleCreate = (project: CreateProjectDto) => {
    createProject.mutate(project);
  };

  if (isLoading) {
    return <Loading isOpen={isLoading} message="Loading projects..." mode="fullscreen" />;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error?.message || "Failed to load projects."} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">Welcome back</h1>
            <h2 className="text-xl font-semibold text-foreground">Recent Projects</h2>
          </div>

          <Button onClick={() => setShowForm(true)}>New Project</Button>
        </div>

        {data && data.length > 0 ? (
          <div className="space-y-3">
            {data.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No projects found</div>
            <Button onClick={() => setShowForm(true)}>Create your first project</Button>
          </div>
        )}
      </div>

      <ProjectForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        mode="create"
        onSubmitCreate={handleCreate}
        isPending={createProject.isPending}
      />
    </div>
  );
}
