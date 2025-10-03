import Navbar from "@/components/Navbar";
import ClientAuthGate from "@/modules/core/auth/components/ClientAuthGate";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="private-root"
      lang="en"
      className="h-full w-full bg-background text-foreground font-sans flex flex-col"
    >
      <ClientAuthGate />

      {/* Navbar stays fixed at the top */}
      <Navbar />

      {/* Main scrolls only */}
      <main className="flex-1 overflow-auto p-4">{children}</main>
    </div>
  );
}
