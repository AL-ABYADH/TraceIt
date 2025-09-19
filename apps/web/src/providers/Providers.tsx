"use client";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wireTokenServiceToStore } from "@/modules/core/auth/store/auth-slice";

const queryClient = new QueryClient();

wireTokenServiceToStore(store);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ReduxProvider>
  );
}
