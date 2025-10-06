"use client";

import Dialog from "@/components/Dialog";
import Button from "@/components/Button";
import { useState, useEffect } from "react";

interface NameInputProps {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  onConfirm: (name: string) => void;
}

export default function NameInput({ isOpen, onClose, initialName, onConfirm }: NameInputProps) {
  const [Name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName, isOpen]);

  const handleConfirm = () => {
    if (Name.trim()) {
      onConfirm(Name.trim());
      onClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Set  Name" className="max-w-md">
      <div className="space-y-4 p-4">
        <div>
          <label htmlFor="Name" className="block text-sm font-medium mb-2">
            Name
          </label>
          <input
            id="Name"
            type="text"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter  name..."
            autoFocus
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!Name.trim()}>
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
