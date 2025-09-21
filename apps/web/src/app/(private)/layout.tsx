import ClientAuthGate from "@/modules/core/auth/components/ClientAuthGate";
import Navbar from "@/components/Navbar";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  // Hide the content by default via inline style so server HTML is hidden.
  // ClientAuthGate will reveal it if auth passes.
  return (
    <div
      id="private-root"
      lang="en"
      className="h-full w-full bg-background text-foreground font-sans"
    >
      <ClientAuthGate />

      <Navbar />

      <main className="p-4">{children}</main>
    </div>
  );
}
