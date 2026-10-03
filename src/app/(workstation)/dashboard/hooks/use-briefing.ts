"use client";

import { useMutation } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";

/** "Brief me" runs only when asked, never on load (05 section 3). A mutation, so it is not cached or refetched. */
export function useBriefing() {
  return useMutation({ mutationFn: endpoints.briefing });
}
