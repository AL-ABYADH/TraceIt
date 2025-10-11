"use client";

import Navbar from "@/components/Navbar";
import ClientAuthGate from "@/modules/core/auth/components/ClientAuthGate";
import { useCurrentUser } from "@/modules/features/user/hooks/useCurrentUser";
import { UserProvider } from "@/contexts/UserContext";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError, error } = useCurrentUser();

  if (isLoading) {
    return <Loading isOpen={isLoading} message="Initializing..." />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message} />;
  }

  return (
    <UserProvider value={{ user: user!, isLoading, isError, error }}>
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
    </UserProvider>
  );
}
