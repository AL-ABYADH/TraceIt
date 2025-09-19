"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const token = useSelector((s: RootState) => s.auth.token);
  const router = useRouter();

  useEffect(() => {
    // If token is missing, send user to login
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  // While token is null we prevent showing the private UI (or show a loader)
  if (!token) return null; // or a spinner

  return <>{children}</>;
}
