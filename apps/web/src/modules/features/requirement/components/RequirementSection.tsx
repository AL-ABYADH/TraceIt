interface RequirementSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function RequirementSection({ title, children }: RequirementSectionProps) {
  return (
    <div className="mt-6">
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <div className="pl-4 space-y-2">{children}</div>
    </div>
  );
}
