"use client";

import Navbar from "@/components/Navbar";
import ClientAuthGate from "@/modules/core/auth/components/ClientAuthGate";
import { MaximizationProvider, useMaximization } from "@/contexts/MaximizationContext";

function Layout({ children }: { children: React.ReactNode }) {
  const { isMaximized } = useMaximization();

  return (
    <div
      id="private-root"
      lang="en"
      className="h-full w-full bg-background text-foreground font-sans flex flex-col"
    >
      <ClientAuthGate />

      {/* Navbar stays fixed at the top */}
      {!isMaximized && <Navbar />}

      {/* Main scrolls only */}
      <main className={`flex-1 ${isMaximized ? "" : "overflow-auto p-4"}`}>{children}</main>
    </div>
  );
}

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <MaximizationProvider>
      <Layout>{children}</Layout>
    </MaximizationProvider>
  );
}
