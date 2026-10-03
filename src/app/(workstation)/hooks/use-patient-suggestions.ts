"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";

export const SUGGESTION_LIMIT = 6;
const MIN_CHARS = 2;

/**
 * Live matches for the top-bar search. The text is debounced so typing does not fire a request per keystroke, and
 * the API only returns patients the signed-in user may see (a denied patient is simply absent).
 */
export function usePatientSuggestions(text: string) {
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(text.trim()), 250);
    return () => clearTimeout(timer);
  }, [text]);

  const enabled = debounced.length >= MIN_CHARS;
  const query = useQuery({
    queryKey: patientKeys.list({ suggest: debounced }),
    queryFn: () =>
      endpoints.patients({ q: debounced, limit: SUGGESTION_LIMIT, sort: "name", order: "asc" }),
    enabled,
    placeholderData: keepPreviousData,
  });
  return {
    enabled,
    /** True while the text on screen is ahead of the query that produced the rows. */
    settling: text.trim() !== debounced || query.isFetching,
    items: enabled ? (query.data?.items ?? []) : [],
    total: enabled ? (query.data?.total ?? 0) : 0,
    isError: enabled && query.isError,
  };
}
