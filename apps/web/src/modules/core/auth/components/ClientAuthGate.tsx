"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { usePathname } from "next/navigation";

export default function ClientAuthGate() {
  const token = useSelector((s: RootState) => s.auth.token);
  const router = useRouter();
  const pathname = usePathname() || "/";

  useEffect(() => {
    const privateRoot = document.getElementById("private-root");
    const publicRoot = document.getElementById("public-root");

    if (!token) {
      // if not authorized, show auth layout, redirect to login, and return
      if (publicRoot) publicRoot.style.display = "";
      router.replace("/login");
      return;
    } else if (pathname === "/login" || pathname === "/signup") {
      // if the path is login or signup, redirect to root
      router.replace("/");
    }

    // if authorized -> reveal the content
    if (privateRoot) privateRoot.style.display = "";
  }, [token, router]);

  return null;
}
