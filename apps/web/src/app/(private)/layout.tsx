import ClientAuthGate from "@/modules/core/auth/components/ClientAuthGate";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  // Hide the content by default via inline style so server HTML is hidden.
  // ClientAuthGate will reveal it if auth passes.
  return (
    <div id="private-root" style={{ display: "none" }}>
      <ClientAuthGate />
      {children}
    </div>
  );
}
