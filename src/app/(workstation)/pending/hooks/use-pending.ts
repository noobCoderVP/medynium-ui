"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { endpoints } from "@/lib/api/endpoints";
import { pendingKeys } from "@/lib/api/keys";

const PAGE = 25;

/** Pending items across the signed-in clinician's own patients, most urgent first. The API scopes them. */
export function usePending() {
  const [kind, setKind] = useState("");
  const [offset, setOffset] = useState(0);
  const params = { kind, limit: PAGE, offset };
  const query = useQuery({
    queryKey: pendingKeys.list(params),
    queryFn: () => endpoints.pending(params),
    placeholderData: keepPreviousData,
  });
  const summary = useQuery({
    queryKey: pendingKeys.summary,
    queryFn: () => endpoints.pendingSummary(),
  });
  return {
    query,
    summary,
    kind,
    offset,
    limit: PAGE,
    setKind: (next: string) => {
      setKind(next);
      setOffset(0);
    },
    setOffset,
  };
}
