import ProjectSidebar from "@/components/ProjectSidebar";
import ProjectLayoutShell from "@/modules/features/project/components/ProjectLayoutShell";

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
      <div className="min-h-screen flex bg-black">
        <ProjectSidebar projectId={projectId} />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </ProjectLayoutShell>
  );
}
