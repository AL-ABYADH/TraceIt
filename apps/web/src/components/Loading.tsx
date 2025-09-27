"use client";

import Dialog from "./Dialog";

interface LoadingProps {
  isOpen: boolean;
  message?: string;
  mode?: "fullscreen" | "dialog"; // new prop to control the style
  onClose?: () => void; // optional close handler for dialog mode
}

export default function Loading({
  isOpen,
  message = "Loading...",
  mode = "dialog",
  onClose,
}: LoadingProps) {
  if (!isOpen) return null;

  if (mode === "dialog") {
    return (
      <Dialog isOpen={isOpen} onClose={onClose || (() => {})} title={message} className="max-w-xs">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted-foreground border-t-transparent mb-4" />
          <p className="text-sm text-center text-muted-foreground">{message}</p>
        </div>
      </Dialog>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center py-6">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted-foreground border-t-transparent mb-4" />
        <p className="text-sm text-center text-white">{message}</p>
      </div>
    </div>
  );
}
