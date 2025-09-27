"use client";

import { ReactNode, useEffect } from "react";
import { XIcon } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

export default function Dialog({ isOpen, onClose, children, title, className = "" }: DialogProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        className={`
        relative bg-card rounded-2xl border border-border shadow-2xl 
        w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto
        animate-in fade-in-0 zoom-in-95 duration-200
        ${className}
      `}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <button onClick={onClose} className="p-1 hover:bg-accent rounded-lg transition-colors">
              <XIcon className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        )}

        <div className={title ? "px-6 pb-6" : "px-6 pb-6"}>{children}</div>
      </div>
    </div>
  );
}
