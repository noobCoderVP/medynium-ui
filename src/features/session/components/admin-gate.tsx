"use client";

import type { ReactNode } from "react";
import { DataState } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/state-panels";
import { copy } from "@/lib/copy";
import { useMe } from "../hooks/use-session";

/** Admin screens are doctor-only (06 U-14). Others see a plain explanation, not a broken page. */
export function AdminGate({ children }: { children: ReactNode }) {
  const me = useMe();
  return (
    <DataState query={me}>
      {(user) =>
        user.is_admin && user.role === "DOCTOR" ? (
          <>{children}</>
        ) : (
          <EmptyState title={copy.errors.forbidden}>
            Ask an administrator if you need access.
          </EmptyState>
        )
      }
    </DataState>
  );
}
