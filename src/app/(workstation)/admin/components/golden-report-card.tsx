import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import type { GoldenRunList } from "@/lib/api/types";

/**
 * The latest stored golden run (G3, Q-6): pass rate, and every question that failed with the reason. Runs are
 * started from the command line (`scripts/eval_golden.py --store`); this card only shows what was stored.
 */
export function GoldenReportCard({ runs }: { runs: GoldenRunList }) {
  const latest = runs.latest;
  if (!latest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Golden report</CardTitle>
        </CardHeader>
        <CardBody className="space-y-1 text-sm">
          <p>No golden run has been stored yet.</p>
          <p className="text-muted-foreground">
            Run <span className="font-mono">poetry run python scripts/eval_golden.py --store</span>{" "}
            in <span className="font-mono">medynium-apis</span>.
          </p>
        </CardBody>
      </Card>
    );
  }
  const failures = latest.cases.filter((c) => c.result === "FAIL");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Golden report</CardTitle>
      </CardHeader>
      <CardBody className="space-y-2 text-sm">
        <p role="status" className="font-medium">
          {latest.passed} of {latest.total} passed
          {latest.started_at ? ` · ${latest.started_at.slice(0, 16).replace("T", " ")}` : ""}
        </p>
        {failures.length === 0 ? (
          <p className="text-muted-foreground">Every question passed in this run.</p>
        ) : (
          <ul className="list-disc space-y-1 pl-5">
            {failures.map((f) => (
              <li key={f.seq}>
                <span className="font-medium">{f.question}</span>
                <span className="text-muted-foreground"> — {f.detail}</span>
              </li>
            ))}
          </ul>
        )}
        {runs.history.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            Earlier runs: {runs.history.map((r) => `${r.passed}/${r.total}`).join(", ")}
          </p>
        ) : null}
      </CardBody>
    </Card>
  );
}
