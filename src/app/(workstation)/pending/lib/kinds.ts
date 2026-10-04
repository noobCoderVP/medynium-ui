import {
  CalendarClock,
  FileText,
  FlaskConical,
  ShieldAlert,
  Siren,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { PendingItem } from "@/lib/api/types";

export type Kind = PendingItem["kind"];

export interface KindInfo {
  label: string;
  icon: LucideIcon;
  /** The patient tab where this kind is handled. */
  tab: string;
  /** What the row's button says, so the action is clear before the click. */
  action: string;
  className: string;
}

const crit = "border-crit/30 bg-crit-soft text-crit";
const warn = "border-warn/30 bg-warn-soft text-warn";
const plain = "border-border bg-muted text-foreground";

/** Most urgent first; the filter shows the kinds in this order. */
export const KINDS: Record<Kind, KindInfo> = {
  ESCALATED_FINDING: {
    label: "Escalated finding",
    icon: ShieldAlert,
    tab: "safety",
    action: "Review finding",
    className: crit,
  },
  RECENT_EMERGENCY: {
    label: "Recent emergency visit",
    icon: Siren,
    tab: "timeline",
    action: "Open timeline",
    className: crit,
  },
  ABNORMAL_LAB: {
    label: "Abnormal lab",
    icon: FlaskConical,
    tab: "labs",
    action: "Open labs",
    className: warn,
  },
  OPEN_FINDING: {
    label: "Open finding",
    icon: TriangleAlert,
    tab: "safety",
    action: "Review finding",
    className: warn,
  },
  FOLLOW_UP: {
    label: "Follow-up due",
    icon: CalendarClock,
    tab: "notes",
    action: "Open notes",
    className: plain,
  },
  REPORT_TO_REVIEW: {
    label: "Report to review",
    icon: FileText,
    tab: "reports",
    action: "Open report",
    className: plain,
  },
};

export const KIND_ORDER = Object.keys(KINDS) as Kind[];
