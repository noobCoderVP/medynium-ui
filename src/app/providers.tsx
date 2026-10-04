"use client";

import { MotionConfig } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { RouteProgress } from "@/components/shared/route-progress";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { shouldRetry } from "@/lib/api/errors";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        // 30 s for patient reads; never retry a 4xx, retry a 5xx once (06 section 2).
        defaultOptions: { queries: { staleTime: 30_000, retry: shouldRetry } },
      }),
  );
  return (
    <ThemeProvider>
      <QueryClientProvider client={client}>
        <MotionConfig reducedMotion="user">
          <RouteProgress />
          {children}
        </MotionConfig>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
