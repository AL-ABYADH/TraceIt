"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";

export default function ClientAuthGate() {
  const token = useSelector((s: RootState) => s.auth.token);
  const router = useRouter();

  useEffect(() => {
    const root = document.getElementById("private-root");
    if (!token) {
      // if not authorized, redirect
      router.replace("/login");
      return;
    }
    // authorized -> reveal the content
    if (root) root.style.display = "";
  }, [token, router]);

  return null;
}
