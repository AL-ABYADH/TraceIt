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
}

export default function ConfirmationDialog({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onCancel} title={title} className="max-w-md">
      <p className="text-sm text-muted-foreground mb-6">{message}</p>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>

        <Button type="button" onClick={onConfirm} disabled={loading}>
          {loading ? "Processing..." : confirmText}
        </Button>
      </div>
    </Dialog>
  );
}
