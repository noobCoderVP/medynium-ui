"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerItem } from "@/lib/motion";

/** A labelled number, for utilisation and counts. Reveals with its siblings inside a StatGrid. */
export function StatTile({
  label,
  value,
  note,
}: {
  label: string;
  value: ReactNode;
  note?: string;
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="rounded-xl border border-border bg-card px-4 py-3.5 shadow-xs"
    >
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1.5 font-heading text-2xl font-bold tracking-tight tabular-nums">
        {value}
      </dd>
      {note ? <dd className="mt-0.5 text-xs text-muted-foreground">{note}</dd> : null}
    </motion.div>
  );
}
