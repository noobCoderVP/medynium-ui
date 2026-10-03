"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Read and update search params in place. Tab, date range, lab code and the open evidence drawer all live
 * in the URL (06 section 3), so every view is linkable and the back button works.
 * A null value removes the param. `push` adds a history entry (opening a drawer); `replace` does not.
 */
export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const update = useCallback(
    (changes: Record<string, string | null>, mode: "push" | "replace" = "replace") => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      const query = next.toString();
      router[mode](query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  return { params, update };
}
