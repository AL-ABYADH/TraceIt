import ProjectLayoutShell from "@/modules/features/project/components/ProjectLayoutShell";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ "project-id": string }>;
}) {
  const { "project-id": projectId } = await params;

  return <ProjectLayoutShell projectId={projectId}>{children}</ProjectLayoutShell>;
}
