"use client";

import React, { useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wireTokenServiceToStore } from "@/modules/core/auth/store/auth-slice";
import { defaultReactQueryOptions } from "@/query/query-options";

// Mantine imports
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
// Mantine styles (important!)
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

wireTokenServiceToStore(store);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: defaultReactQueryOptions }),
  );

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          defaultColorScheme="dark"
          theme={{
            fontFamily: "Inter, sans-serif",
          }}
        >
          <Notifications position="top-right" zIndex={9999} />
          {children}
        </MantineProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
