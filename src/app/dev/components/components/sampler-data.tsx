"use client";

import { FlagChip, RouteChip, StatusChip, TagChip } from "@/components/shared/chips";
import { CopyLink } from "@/components/shared/copy-link";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatTile } from "@/components/shared/stat-tile";
import { ValueWithSource } from "@/components/shared/value-with-source";
import { AnswerView } from "@/features/evidence";
import type { StreamAnswer } from "@/lib/api/events";

const answer: StreamAnswer = {
  answer_id: "ANS-DEMO",
  kind: "SAFETY",
  patient_id: "P-DEMO",
  short_answer: "One consideration may warrant clinician review.",
  considerations: [
    {
      id: "C1",
      text: "eGFR was 42 on 14 Sep 2026, down from 58.",
      tag: "patient_fact",
      patient_evidence: ["P1"],
      source_evidence: [],
    },
    {
      id: "C2",
      text: "The label advises assessing renal function before and during treatment.",
      tag: "retrieved_source",
      patient_evidence: [],
      source_evidence: ["S1"],
    },
    {
      id: "C3",
      text: "Current dose and recent eGFR together may warrant review.",
      tag: "ai_synthesis",
      patient_evidence: ["P1"],
      source_evidence: ["S1"],
    },
  ],
  limits: { checked: ["metformin label"], not_checked: [], notes: [], snapshot_date: "2026-10-02" },
  conflicts: [],
  route: { route: "safety", model: "claude-sonnet-4-6", cost_note: "strong model" },
  created_at: "2026-10-03T08:00:00Z",
};

const gap: StreamAnswer = {
  ...answer,
  answer_id: "ANS-GAP",
  considerations: [],
  limits: {
    checked: ["amlodipine label"],
    not_checked: ["perampanel (not indexed)"],
    notes: [],
    snapshot_date: "2026-10-02",
  },
};

interface Row {
  drug: string;
  dose: string;
}
const columns: Column<Row>[] = [
  { key: "drug", header: "Medicine", sortValue: (r) => r.drug, cell: (r) => r.drug },
  { key: "dose", header: "Dose", cell: (r) => r.dose },
];

/** Tags, chips, tiles, values with source, tables and answers: the evidence vocabulary. */
export function SamplerData() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <TagChip tag="patient_fact" />
        <TagChip tag="retrieved_source" />
        <TagChip tag="ai_synthesis" />
        <FlagChip flag={{ type: "NEW_LAB", label: "New lab" }} />
        <FlagChip flag={{ type: "RECENT_EMERGENCY", label: "ED visit 2 Oct" }} />
        <RouteChip route="lookup" costNote="no model call" />
        <RouteChip route="safety" model="claude-sonnet-4-6" costNote="strong model" />
        <StatusChip tone="ok">approved</StatusChip>
        <StatusChip tone="warn">pending</StatusChip>
        <StatusChip tone="crit">error</StatusChip>
        <StatusChip tone="muted">refused</StatusChip>
      </div>
      <dl className="grid grid-cols-3 gap-3">
        <StatTile label="Outpatient visits" value="3" note="last 12 months" />
        <StatTile label="Approved" value="₹1,23,456" />
        <StatTile label="Procedures" value="2" />
      </dl>
      <ValueWithSource
        value="Metformin, 1000 mg twice daily"
        date="2026-08-14"
        source="CLINICAL.MEDICATION"
      />
      <DataTable
        caption="Sample medicines"
        columns={columns}
        rows={[
          { drug: "Metformin", dose: "1000 mg" },
          { drug: "Amlodipine", dose: "5 mg" },
        ]}
        rowKey={(r) => r.drug}
      />
      <AnswerView answer={answer} />
      <AnswerView answer={gap} />
      <CopyLink label="One-time link" url="https://example.invalid/invite/abc123" />
    </div>
  );
}
