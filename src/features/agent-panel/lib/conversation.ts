import type {
  StreamAction,
  StreamAnswer,
  StreamEvent,
  StreamProposal,
  StreamRefusal,
  StreamRoute,
  StreamStep,
} from "@/lib/api/events";

export interface TurnError {
  code: string;
  message: string;
  retryAfter: number | null;
}

/** One question and everything the assistant did about it. */
export interface Turn {
  id: string;
  question: string;
  status: "running" | "done" | "failed";
  routes: StreamRoute[];
  steps: StreamStep[];
  actions: StreamAction[];
  answers: StreamAnswer[];
  proposals: StreamProposal[];
  refusal: StreamRefusal | null;
  error: TurnError | null;
  auditId: string | null;
}

export const newTurn = (id: string, question: string): Turn => ({
  id,
  question,
  status: "running",
  routes: [],
  steps: [],
  actions: [],
  answers: [],
  proposals: [],
  refusal: null,
  error: null,
  auditId: null,
});

/** Applies one validated stream event. Steps update in place by id; a second route gets its own step ids. */
export function applyEvent(turn: Turn, event: StreamEvent): Turn {
  switch (event.type) {
    case "route":
      return { ...turn, routes: [...turn.routes, event.data] };
    case "step": {
      const step = { ...event.data, step_id: `${turn.routes.length}:${event.data.step_id}` };
      const exists = turn.steps.some((s) => s.step_id === step.step_id);
      return {
        ...turn,
        steps: exists
          ? turn.steps.map((s) => (s.step_id === step.step_id ? step : s))
          : [...turn.steps, step],
      };
    }
    case "action":
      return { ...turn, actions: [...turn.actions, event.data] };
    case "answer":
      return { ...turn, answers: [...turn.answers, event.data] };
    case "proposal":
      return { ...turn, proposals: [...turn.proposals, event.data] };
    case "refusal":
      return { ...turn, refusal: event.data };
    case "error":
      return {
        ...turn,
        status: "failed",
        error: { code: event.data.error, message: event.data.message, retryAfter: null },
      };
    case "done":
      return {
        ...turn,
        status: turn.status === "failed" ? "failed" : "done",
        auditId: event.data.audit_id ?? null,
        steps: turn.steps.map((s) => (s.status === "running" ? { ...s, status: "done" } : s)),
      };
  }
}

/** Where the open screen is, in the words the API expects. */
export function screenFor(
  pathname: string,
): "dashboard" | "patients" | "patient" | "knowledge" | "activity" | "admin" {
  if (/^\/patients\/[^/]+/.test(pathname)) return "patient";
  if (pathname.startsWith("/patients")) return "patients";
  if (pathname.startsWith("/knowledge")) return "knowledge";
  if (pathname.startsWith("/activity")) return "activity";
  if (pathname.startsWith("/admin")) return "admin";
  return "dashboard";
}

/** The URL an allowlisted action maps to. The action only sets URL state; the workspace does the rest (06 section 3). */
export function hrefForAction(action: StreamAction): string | null {
  const result = action.result;
  const patientId = String(result.patient_id ?? action.params.patient_id ?? "");
  if (!patientId) return null;
  const base = `/patients/${encodeURIComponent(patientId)}`;
  if (action.action === "open_patient") return base;
  if (action.action === "run_safety_review") return `${base}?tab=safety`;
  if (action.action === "show_timeline") {
    if (result.view === "lab_trend" && result.lab_code)
      return `${base}?tab=labs&lab=${encodeURIComponent(String(result.lab_code))}`;
    const range = new URLSearchParams({ tab: "timeline" });
    if (result.from) range.set("from", String(result.from));
    if (result.to) range.set("to", String(result.to));
    return `${base}?${range.toString()}`;
  }
  return null;
}
