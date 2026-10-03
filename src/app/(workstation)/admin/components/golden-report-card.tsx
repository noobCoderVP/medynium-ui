import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * The golden report (G3, Q-6) shows the latest run's pass rate and its failures. The run endpoints
 * (POST /admin/golden-runs, GET /admin/golden-runs/latest) are not built yet, so this card says so rather
 * than showing numbers it does not have. It becomes a data card once the contract exists.
 */
export function GoldenReportCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Golden report</CardTitle>
      </CardHeader>
      <CardBody className="space-y-1 text-sm">
        <p>No golden run is available yet.</p>
        <p className="text-muted-foreground">
          The golden, routing, retrieval and injection sets run from the command line in{" "}
          <span className="font-mono">medynium-apis/evals</span>; their reports are committed under{" "}
          <span className="font-mono">docs/quality</span>. This card will show the latest pass rate
          and every failure once the report endpoint exists.
        </p>
      </CardBody>
    </Card>
  );
}
