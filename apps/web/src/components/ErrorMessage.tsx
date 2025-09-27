"use client";

import { useEffect, useRef } from "react";
import { notifications } from "@mantine/notifications";

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({ message = "Something went wrong." }: ErrorMessageProps) {
  const lastMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (!message || message === lastMessageRef.current) return;

    lastMessageRef.current = message;

    notifications.show({
      title: "Error",
      message,
      color: "red",
      autoClose: 4000,
      onClose: () => {
        lastMessageRef.current = null;
      },
      styles: () => ({
        root: {
          backgroundColor: "var(--card)",
          color: "var(--foreground)",
          border: `1px solid var(--border)`,
          minWidth: "300px",
        },
        title: { color: "var(--destructive-foreground)" },
        description: { color: "var(--foreground)" },
      }),
    });
  }, [message]);

  return null;
}
