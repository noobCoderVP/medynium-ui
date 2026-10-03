"use client";

import { skipToken, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { ApiError } from "@/lib/api/errors";
import type { StreamAnswer, StreamEvent, StreamStep } from "@/lib/api/events";
import { patientKeys } from "@/lib/api/keys";
import { streamPost } from "@/lib/api/sse";

export interface RunState {
  status: "idle" | "running" | "done" | "failed";
  steps: StreamStep[];
  answer: StreamAnswer | null;
  error: { code: string; message: string; retryAfter: number | null } | null;
}

const IDLE: RunState = { status: "idle", steps: [], answer: null, error: null };

function reduce(state: RunState, event: StreamEvent): RunState {
  switch (event.type) {
    case "step": {
      const known = state.steps.some((s) => s.step_id === event.data.step_id);
      const steps = known
        ? state.steps.map((s) => (s.step_id === event.data.step_id ? event.data : s))
        : [...state.steps, event.data];
      return { ...state, steps };
    }
    case "answer":
      return { ...state, answer: event.data };
    case "error":
      return {
        ...state,
        status: "failed",
        error: { code: event.data.error, message: event.data.message, retryAfter: null },
      };
    case "done":
      return state.status === "failed"
        ? state
        : {
            ...state,
            status: "done",
            steps: state.steps.map((s) => (s.status === "running" ? { ...s, status: "done" } : s)),
          };
    default:
      return state;
  }
}

/**
 * The manual "Run safety review" button (FR-20): the same endpoint the assistant uses, with no router in front.
 * The last run is kept in the query cache so switching tabs and coming back does not lose it. The stored
 * evidence behind it can always be reopened from the Why? drawer.
 */
export function useSafetyReview(patientId: string) {
  const client = useQueryClient();
  const key = patientKeys.safety(patientId);
  const running = useRef(false);
  const { data } = useQuery<RunState>({ queryKey: key, queryFn: skipToken, staleTime: Infinity });

  const set = useCallback(
    (change: (state: RunState) => RunState) =>
      client.setQueryData<RunState>(key, (old) => change(old ?? IDLE)),
    [client, key],
  );

  const run = useCallback(() => {
    if (running.current) return;
    running.current = true;
    set(() => ({ ...IDLE, status: "running" }));
    streamPost(`/patients/${encodeURIComponent(patientId)}/safety-review`, {
      onEvent: (event) => set((state) => reduce(state, event)),
    })
      .catch((error: unknown) => {
        const api = error instanceof ApiError ? error : null;
        set((state) => ({
          ...state,
          status: "failed",
          error: {
            code: api?.code ?? "network",
            message: api?.message ?? "",
            retryAfter: api?.retryAfter ?? null,
          },
        }));
      })
      .finally(() => {
        running.current = false;
        set((state) => (state.status === "running" ? { ...state, status: "done" } : state));
      });
  }, [patientId, set]);

  return { state: data ?? IDLE, run };
}
