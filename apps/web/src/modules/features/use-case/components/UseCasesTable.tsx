"use client";

import { useUseCases } from "../hooks/useUseCases";
import UseCaseItem from "./UseCaseItem";

export default function UseCasesTable({ projectId }: { projectId: string }) {
  const { data, isError, isLoading, error } = useUseCases(projectId);

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>{error.message}</div>;

  return (
    <div>
      {data?.map((useCase) => (
        <li key={useCase.id}>
          <UseCaseItem useCase={useCase} />
        </li>
      ))}
    </div>
  );
}
