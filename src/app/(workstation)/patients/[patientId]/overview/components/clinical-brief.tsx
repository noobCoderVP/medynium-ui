"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TagChip } from "@/components/shared/chips";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { AskButton } from "@/features/agent-panel";
import type { Brief } from "@/lib/api/types";

/**
 * The first thing on a patient: one paragraph made from the rules, and when a model could rephrase it without adding
 * anything, a written summary beside it. The paragraph is shown at once; the summary arrives later and never blocks.
 */
export function ClinicalBrief({ brief }: { brief: Brief }) {
  const counts = brief.attention.counts;
  const base = `/patients/${encodeURIComponent(brief.patient_id)}`;
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Clinical brief</CardTitle>
        <div className="flex items-center gap-2">
          <AskButton label="Brief me" question="Brief me on this patient" />
          <Button size="sm" variant="outline" render={<Link href={`${base}?tab=similar`} />}>
            Similar patients
          </Button>
          <Button size="sm" variant="outline" render={<Link href={`${base}?tab=safety`} />}>
            Review safety
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        <p className="text-base leading-relaxed">{brief.headline}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <TagChip tag="rule_check" />
          <span>
            Made from the record by fixed rules
            {counts.high ? ` · ${counts.high} high priority` : ""}
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
