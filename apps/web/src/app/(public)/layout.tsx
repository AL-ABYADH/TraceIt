import ClientAuthGate from "@/modules/core/auth/components/ClientAuthGate";
import React from "react";

export const metadata = { title: "Public" };

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="public-root" style={{ display: "none" }}>
      <ClientAuthGate />
      {children}
    </div>
  );
}
