import { UseCaseListDto } from "@repo/shared-schemas";

interface UseCaseItemProps {
  useCase: UseCaseListDto;
  showActions?: boolean;
  onEdit?: (useCase: UseCaseListDto) => void;
  onDelete?: (useCase: UseCaseListDto) => void;
}

export default function UseCaseItem({
  useCase,
  showActions = false,
  onEdit,
  onDelete,
}: UseCaseItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-surface border border-border rounded-lg hover:bg-card-hover transition-colors">
      <div className="flex flex-col">
        <span className="text-foreground font-medium">{useCase.name}</span>
        <span className="text-muted-foreground text-sm">
          Created: {new Date(useCase.createdAt).toLocaleDateString()}
        </span>
      </div>

      {showActions && (
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(useCase)}
              className="text-primary hover:text-primary-hover text-sm transition-colors"
            >
              Edit
            </button>
          )}
          {onEdit && onDelete && <span className="text-muted-foreground">|</span>}
          {onDelete && (
            <button
              onClick={() => onDelete(useCase)}
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
