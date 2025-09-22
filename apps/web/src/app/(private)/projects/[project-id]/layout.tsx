import ProjectLayoutShell from "@/modules/features/project/components/ProjectLayoutShell";
import ProjectSidebar from "@/modules/features/project/components/ProjectSidebar";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ "project-id": string }>;
}) {
  const { "project-id": projectId } = await params;

  return (
    <ProjectLayoutShell projectId={projectId}>
      <div className="flex flex-row min-h-screen bg-background text-foreground">
        <ProjectSidebar projectId={projectId} className="w-72" />
        <main className="flex-1 min-w-0 overflow-auto p-8">{children}</main>
      </div>
    </ProjectLayoutShell>
  );
}
