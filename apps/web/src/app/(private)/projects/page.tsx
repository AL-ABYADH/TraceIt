"use client";

import ProjectCard from "@/modules/features/project/components/ProjectCard";
import ProjectForm from "@/modules/features/project/components/ProjectForm";
import { useProjects } from "@/modules/features/project/hooks/useProjects";
import { useState } from "react";

export default function Projects() {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading, isError, error } = useProjects();

  const handleCreateProjectClick = () => setShowForm(true);

  const handleFormSubmit = () => setShowForm(false);

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>{error.message}</div>;

  return (
    <>
      {showForm && (
        // Replace with a dialog when implementing UI
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black z-50">
          <ProjectForm hideForm={handleFormSubmit} />
        </div>
      )}
      <ul>
        {data?.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
      <button onClick={handleCreateProjectClick}>Create Project</button>
    </>
  );
}
