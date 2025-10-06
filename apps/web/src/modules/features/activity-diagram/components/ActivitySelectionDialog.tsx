"use client";

import Dialog from "@/components/Dialog";
import { Plus, Search, X } from "lucide-react";

interface ActivitySelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNew: () => void;
  onPickExisting: () => void;
}

export default function ActivitySelectionDialog({
  isOpen,
  onClose,
  onCreateNew,
  onPickExisting,
}: ActivitySelectionDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="" className="max-w-md p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Add Activity</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose how you want to add an activity
          </p>
        </div>
        <button
          onClick={onClose}
          className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Options Grid */}
      <div className="space-y-4 px-6 pb-6">
        <button
          onClick={onCreateNew}
          className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group text-left w-full"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
            <Plus className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground group-hover:text-blue-600 transition-colors">
              Create New Activity
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Design a custom activity with your own parameters and requirements
            </p>
          </div>
        </button>

        <button
          onClick={onPickExisting}
          className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group text-left w-full"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
            <Search className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground group-hover:text-green-600 transition-colors">
              Pick Existing Activity
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Select from your library of previously created activities
            </p>
          </div>
        </button>
      </div>
    </Dialog>
  );
}
