import { ActorDto } from "@repo/shared-schemas";

export default function ActorItem({ actor }: { actor: ActorDto }) {
  return (
    <div>
      {actor.name} {actor.subtype}
    </div>
  );
}
