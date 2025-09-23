"use client";

import { useActors } from "../hooks/useActors";
import ActorItem from "./ActorItem";

export default function ActorsTable({ projectId }: { projectId: string }) {
  const { data, isError, isLoading, error } = useActors(projectId);

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>{error.message}</div>;

  return (
    <div>
      {data?.map((actor) => (
        <li key={actor.id}>
          <ActorItem actor={actor} />
        </li>
      ))}
    </div>
  );
}
