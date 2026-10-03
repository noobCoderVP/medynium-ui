"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "@/lib/api/errors";
import type { StreamEvent } from "@/lib/api/events";
import { patientKeys } from "@/lib/api/keys";
import { streamPost } from "@/lib/api/sse";
import { applyEvent, hrefForAction, newTurn, screenFor, type Turn } from "../lib/conversation";

const STORAGE_KEY = "medynium-agent-open";

interface Agent {
  open: boolean;
  setOpen: (open: boolean) => void;
  turns: Turn[];
  running: boolean;
  ask: (question: string) => void;
  stop: () => void;
  clear: () => void;
}

const Context = createContext<Agent | null>(null);

export function useAgent(): Agent {
  const value = useContext(Context);
  if (!value) throw new Error("useAgent must be used inside AgentProvider");
  return value;
}

function readOpen(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === "1";
  } catch {
    // Blocked storage: fall through to the width default.
  }
  return window.matchMedia?.("(min-width: 1280px)").matches ?? false;
}

/**
 * Conversation state for the assistant, session-scoped. The panel only ever calls the same API the workspace
 * does; an action just changes the URL, so the workspace never depends on the panel (FR-16, NFR-13).
 */
export function AgentProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ patientId?: string }>();
  const client = useQueryClient();
  const [open, setOpenState] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [running, setRunning] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const counter = useRef(0);
  const scope = useRef({ screen: screenFor(pathname), patientId: params.patientId ?? null });

  useEffect(() => {
    scope.current = { screen: screenFor(pathname), patientId: params.patientId ?? null };
  }, [pathname, params.patientId]);

  useEffect(() => {
    // Storage and viewport width are only readable after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenState(readOpen());
  }, []);

  const setOpen = useCallback((next: boolean) => {
    setOpenState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // The choice just lasts for this visit.
    }
  }, []);

  const patch = useCallback((id: string, change: (turn: Turn) => Turn) => {
    setTurns((all) => all.map((t) => (t.id === id ? change(t) : t)));
  }, []);

  const ask = useCallback(
    (question: string) => {
      const text = question.trim();
      if (!text || controller.current) return;
      const id = `t${++counter.current}`;
      const history = turns.slice(-2).map((t) => t.question);
      const abort = new AbortController();
      controller.current = abort;
      setRunning(true);
      setTurns((all) => [...all, newTurn(id, text)]);

      const onEvent = (event: StreamEvent) => {
        patch(id, (turn) => applyEvent(turn, event));
        if (event.type !== "action" || event.data.status !== "done") return;
        const href = hrefForAction(event.data);
        if (href) router.push(href);
        if (event.data.action === "pin_evidence" && event.data.result.patient_id) {
          void client.invalidateQueries({
            queryKey: patientKeys.pins(String(event.data.result.patient_id)),
          });
        }
      };

      streamPost("/copilot/ask", {
        body: {
          question: text,
          screen: scope.current.screen,
          patient_id: scope.current.patientId,
          history,
        },
        signal: abort.signal,
        onEvent,
      })
        .catch((error: unknown) => {
          if (abort.signal.aborted) return;
          const api = error instanceof ApiError ? error : null;
          patch(id, (turn) => ({
            ...turn,
            status: "failed",
            error: {
              code: api?.code ?? "network",
              message: api?.message ?? "",
              retryAfter: api?.retryAfter ?? null,
            },
          }));
        })
        .finally(() => {
          controller.current = null;
          setRunning(false);
          patch(id, (turn) => (turn.status === "running" ? { ...turn, status: "done" } : turn));
        });
    },
    [client, patch, router, turns],
  );

  const stop = useCallback(() => controller.current?.abort(), []);
  const clear = useCallback(() => {
    controller.current?.abort();
    setTurns([]);
  }, []);

  const value = useMemo(
    () => ({ open, setOpen, turns, running, ask, stop, clear }),
    [open, setOpen, turns, running, ask, stop, clear],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
