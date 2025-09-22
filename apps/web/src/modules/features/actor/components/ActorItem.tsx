import { ActorDto } from "@repo/shared-schemas";

interface ActorItemProps {
  actor: ActorDto;
  showActions?: boolean;
  onEdit?: (actor: ActorDto) => void;
  onDelete?: (actor: ActorDto) => void;
}

export default function ActorItem({
  actor,
  showActions = false,
  onEdit,
  onDelete,
}: ActorItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-surface border border-border rounded-lg hover:bg-card-hover transition-colors">
      <div className="flex flex-col">
        <span className="text-foreground font-medium">{actor.name}</span>
        <span className="text-muted-foreground text-sm">
          {actor.type} - {actor.subtype}
        </span>
      </div>

      {showActions && (
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(actor)}
              className="text-primary hover:text-primary-hover text-sm transition-colors"
            >
              Edit
            </button>
          )}
          {onEdit && onDelete && <span className="text-muted-foreground">|</span>}
          {onDelete && (
            <button
              onClick={() => onDelete(actor)}
              className="text-destructive hover:text-destructive/80 text-sm transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
