"use client";

import ProjectCard from "@/modules/features/project/components/ProjectCard";
import ProjectForm from "@/modules/features/project/components/ProjectForm";
import Button from "@/components/Button";
import { useProjects } from "@/modules/features/project/hooks/useProjects";
import { useState } from "react";

export default function Projects() {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading, isError, error } = useProjects();

  const handleCreateProjectClick = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-destructive bg-destructive/10 border border-destructive/20 p-4 rounded-xl">
          {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">Welcome back</h1>
            <h2 className="text-xl font-semibold text-foreground">Recent Projects</h2>
          </div>

          <Button onClick={handleCreateProjectClick}>New Project</Button>
        </div>

        {/* Projects List */}
        {data && data.length > 0 ? (
          <div className="space-y-3">
            {data.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No projects found</div>
            <Button onClick={handleCreateProjectClick}>Create your first project</Button>
          </div>
        )}
      </div>

      {/* Dialog Form */}
      <ProjectForm isOpen={showForm} onClose={handleCloseForm} />
    </div>
  );
}
