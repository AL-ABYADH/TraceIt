"use client";
import React, { useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wireTokenServiceToStore } from "@/modules/core/auth/store/auth-slice";
import { defaultReactQueryOptions } from "@/query/query-options";

wireTokenServiceToStore(store);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: defaultReactQueryOptions }),
  );

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ReduxProvider>
  );
}
