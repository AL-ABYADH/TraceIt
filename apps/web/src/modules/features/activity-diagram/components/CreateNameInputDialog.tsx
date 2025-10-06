"use client";

import Dialog from "@/components/Dialog";
import Button from "@/components/Button";
import { useState, useEffect } from "react";

interface NameInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  onConfirm: (name: string) => void;
  title: string;
  description?: string;
}

export default function NameInputDialog({
  isOpen,
  onClose,
  initialName,
  onConfirm,
  title,
  description = "Enter a name for this item:",
}: NameInputDialogProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
    }
  }, [isOpen, initialName]);

  const handleSubmit = () => {
    if (name.trim()) {
      onConfirm(name.trim());
      onClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className="space-y-4 p-4">
        <p className="text-sm text-muted-foreground">{description}</p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter name..."
          autoFocus
        />

        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
