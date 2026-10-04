import { Pin } from "lucide-react";
import type { ReactNode } from "react";
import { TagChip } from "@/components/shared/chips";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate, formatDateTime } from "@/lib/format";
import { evidenceHref } from "@/lib/source-link";
import type { PatientEvidence, SourceEvidence, SqlEvidence } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { sourceHrefFor } from "../lib/evidence-label";

interface ItemProps {
  highlighted: boolean;
  pinned: boolean;
  onPin?: () => void;
}

function Item({
  id,
  highlighted,
  children,
  pin,
}: {
  id: string;
  highlighted: boolean;
  children: ReactNode;
  pin?: ReactNode;
}) {
  return (
    <li
      id={`evidence-${id}`}
      aria-current={highlighted ? "true" : undefined}
      className={cn(
        "space-y-1 rounded-lg border p-3 text-sm",
        highlighted ? "border-primary bg-accent" : "border-border bg-card",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-medium">
          {id}
          {highlighted ? (
            <span className="ml-2 font-sans text-primary">linked to this statement</span>
          ) : null}
        </span>
        {pin}
      </div>
      {children}
    </li>
  );
}

function PinButton({ id, pinned, onPin }: { id: string; pinned: boolean; onPin?: () => void }) {
  if (!onPin) return null;
  return (
    <Button variant="outline" size="xs" onClick={onPin} disabled={pinned} aria-label={`Pin ${id}`}>
      <Pin aria-hidden="true" />
      {pinned ? "Pinned" : "Pin"}
    </Button>
  );
}

export function PatientRecordItem({
  item,
  highlighted,
  pinned,
  onPin,
  patientId,
}: ItemProps & { item: PatientEvidence; patientId?: string | null }) {
  const link = evidenceHref(patientId, item.table, item.record_id, item.value);
  return (
    <Item
      id={item.evidence_id}
      highlighted={highlighted}
      pin={<PinButton id={item.evidence_id} pinned={pinned} onPin={onPin} />}
    >
      <TagChip tag="patient_fact" />
      <p className="font-medium">{item.value}</p>
      <p className="text-xs text-muted-foreground">
        {item.record_type.replaceAll("_", " ").toLowerCase()} · {formatDate(item.date)} ·{" "}
        <span className="font-mono">
          {item.table}
          {item.record_id ? ` ${item.record_id}` : ""}
        </span>
      </p>
      {link ? (
        <Link href={link.href} className="inline-block text-xs font-medium text-primary underline">
          {link.label}
        </Link>
      ) : null}
    </Item>
  );
}

export function SourceItem({
  item,
  highlighted,
  pinned,
  onPin,
}: ItemProps & { item: SourceEvidence }) {
  return (
    <Item
      id={item.evidence_id}
      highlighted={highlighted}
      pin={<PinButton id={item.evidence_id} pinned={pinned} onPin={onPin} />}
    >
      <TagChip tag="retrieved_source" />
      <p className="font-medium">{item.title}</p>
      <p className="text-xs text-muted-foreground">
        {item.section} · {item.version ?? "version not stated"} · effective{" "}
        {formatDate(item.effective_date)} · retrieved {formatDate(item.retrieved_date)} ·{" "}
        {item.source}
      </p>
      <blockquote className="border-l-2 border-source pl-3 text-sm leading-relaxed">
        {item.text}
      </blockquote>
      <Link
        href={sourceHrefFor(item)}
        className="inline-block text-xs font-medium text-primary underline"
      >
        Open the label
      </Link>
    </Item>
  );
}

export function SqlItem({ item, highlighted }: { item: SqlEvidence; highlighted: boolean }) {
  return (
    <Item id={item.sql_id} highlighted={highlighted}>
      <p className="text-xs text-muted-foreground">
        ran {formatDateTime(item.ran_at)} as <span className="font-mono">{item.role}</span> ·{" "}
        {item.row_count} rows
      </p>
      <pre className="max-h-48 overflow-auto rounded bg-muted p-2 font-mono text-xs whitespace-pre-wrap">
        {item.text}
      </pre>
    </Item>
  );
}
