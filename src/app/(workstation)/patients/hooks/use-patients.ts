"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";
import { useUrlParams } from "@/lib/use-url-params";

export const PAGE_SIZE = 50;

/**
 * Search text, the "changed" filter and the page offset live in the URL (?q=&changed=1&offset=), so a list
 * view is linkable. The text box is debounced so typing does not fire a request per keystroke.
 */
export function usePatientList() {
  const { params, update } = useUrlParams();
  const q = params.get("q") ?? "";
  const changed = params.get("changed") === "1";
  const offset = Number(params.get("offset") ?? 0) || 0;

  const [text, setText] = useState(q);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (text !== q) update({ q: text.trim() || null, offset: null });
    }, 300);
    return () => clearTimeout(timer);
  }, [text, q, update]);

  const query = useQuery({
    queryKey: patientKeys.list(q, changed, offset),
    queryFn: () => endpoints.patients({ q, changed, limit: PAGE_SIZE, offset }),
    placeholderData: keepPreviousData,
  });

  return {
    query,
    text,
    setText,
    changed,
    offset,
    setChanged: (value: boolean) => update({ changed: value ? "1" : null, offset: null }),
    setOffset: (value: number) => update({ offset: value > 0 ? String(value) : null }),
  };
}
