import { describe, expect, it } from "vitest";
import type { StreamEvent } from "@/lib/api/events";
import { applyEvent, hrefForAction, newTurn, screenFor } from "./conversation";

const step = (status: "running" | "done", id = "s1"): StreamEvent => ({
  type: "step",
  data: { step_id: id, label: "Reading medications", status },
});

describe("applyEvent", () => {
  it("updates a step in place by id", () => {
    let turn = newTurn("t1", "q");
    turn = applyEvent(turn, step("running"));
    turn = applyEvent(turn, step("done"));
    expect(turn.steps).toHaveLength(1);
    expect(turn.steps[0].status).toBe("done");
  });

  it("keeps step ids from a second route apart", () => {
    let turn = newTurn("t1", "q");
    turn = applyEvent(turn, { type: "route", data: { route: "action" } });
    turn = applyEvent(turn, step("done"));
    turn = applyEvent(turn, { type: "route", data: { route: "safety" } });
    turn = applyEvent(turn, step("done"));
    expect(turn.steps).toHaveLength(2);
  });

  it("ends done, closing any step still running, and records the audit id", () => {
    let turn = newTurn("t1", "q");
    turn = applyEvent(turn, step("running"));
    turn = applyEvent(turn, { type: "done", data: { audit_id: "AUD-1" } });
    expect(turn).toMatchObject({ status: "done", auditId: "AUD-1" });
    expect(turn.steps[0].status).toBe("done");
  });

  it("an error event fails the turn and stays failed after done", () => {
    let turn = newTurn("t1", "q");
    turn = applyEvent(turn, { type: "error", data: { error: "agent_unavailable", message: "x" } });
    turn = applyEvent(turn, { type: "done", data: {} });
    expect(turn.status).toBe("failed");
    expect(turn.error?.code).toBe("agent_unavailable");
  });
});

describe("screenFor", () => {
  it("maps paths to the screens the API knows", () => {
    expect(screenFor("/patients/P-1")).toBe("patient");
    expect(screenFor("/patients")).toBe("patients");
    expect(screenFor("/admin/users")).toBe("admin");
    expect(screenFor("/dashboard")).toBe("dashboard");
  });
});

describe("hrefForAction", () => {
  it("opens a patient and a timeline range through the URL", () => {
    const open = {
      action: "open_patient",
      params: {},
      status: "done",
      result: { patient_id: "P-1" },
    };
    expect(hrefForAction(open)).toBe("/patients/P-1");
    const timeline = {
      action: "show_timeline",
      params: {},
      status: "done",
      result: { view: "timeline", patient_id: "P-1", from: "2026-01-01", to: "2026-03-01" },
    };
    expect(hrefForAction(timeline)).toBe(
      "/patients/P-1?tab=timeline&from=2026-01-01&to=2026-03-01",
    );
  });

  it("opens a lab trend by code", () => {
    const lab = {
      action: "show_timeline",
      params: {},
      status: "done",
      result: { view: "lab_trend", patient_id: "P-1", lab_code: "33914-3" },
    };
    expect(hrefForAction(lab)).toBe("/patients/P-1?tab=labs&lab=33914-3");
  });

  it("does nothing for an action without a destination", () => {
    expect(
      hrefForAction({ action: "pin_evidence", params: {}, status: "done", result: {} }),
    ).toBeNull();
  });
});
