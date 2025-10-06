"use client";

import Dialog from "@/components/Dialog";
import { GitBranch, AlertTriangle, X } from "lucide-react";

interface DecisionTypeSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onConditionSelect: () => void;
  onExceptionSelect: () => void;
}

export default function DecisionTypeSelection({
  isOpen,
  onClose,
  onConditionSelect,
  onExceptionSelect,
}: DecisionTypeSelectionProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="" className="max-w-md p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Add Decision Node</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose what type of decision you want to add
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
          onClick={onConditionSelect}
          className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group text-left w-full"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
            <GitBranch className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground group-hover:text-blue-600 transition-colors">
              Add Condition
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Select from requirements that have conditional logic
            </p>
          </div>
        </button>

        <button
          onClick={onExceptionSelect}
          className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group text-left w-full"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground group-hover:text-orange-600 transition-colors">
              Add Exception
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Select from existing exception handlers
            </p>
          </div>
        </button>
      </div>
    </Dialog>
  );
}
