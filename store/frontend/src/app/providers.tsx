"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

/**
 * Application-wide providers. Theming and the query cache live here because
 * the site header (rendered by the root layout) already reads shop data.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  // Created in state so every browser session gets its own cache, never a shared module singleton.
  const [queryClient] = useState(
      () =>
          new QueryClient({
            defaultOptions: { queries: { refetchOnWindowFocus: false } },
          }),
  );

  return (
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="amin-khoddam.theme"
      >
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeProvider>
  );
}