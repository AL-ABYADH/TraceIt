"use client";

import Button from "@/components/Button";
import Dialog from "./Dialog";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmStyle?: string;
  confirmVariant?: "primary" | "secondary" | "ghost" | "danger";
}

export default function ConfirmationDialog({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmVariant = "primary",
  loading = false,

  confirmStyle = "bg-primary hover:bg-primary/90",
}: ConfirmationDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onCancel} title={title} className="max-w-md">
      <p className="text-sm text-muted-foreground my-6">{message}</p>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>

        <Button
          variant={confirmVariant}
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={confirmStyle}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </div>
    </Dialog>
  );
}
