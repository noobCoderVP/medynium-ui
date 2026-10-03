"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { dashboardKeys } from "@/lib/api/keys";

/** One call for the worklist, recent changes and utilisation, all scoped to the caller's patients. */
export function useDashboard() {
  return useQuery({ queryKey: dashboardKeys.all, queryFn: endpoints.dashboard });
}
