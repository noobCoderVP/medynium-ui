import { StatusChip } from "@/components/shared/chips";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import type { HealthDetails } from "@/lib/api/types";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border py-1.5 first:border-t-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}

/** Whether Snowflake, the warehouse, Cortex and audit writes are healthy. No secrets, ever. */
export function HealthCard({ health }: { health: HealthDetails }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform health</CardTitle>
        <StatusChip tone={health.status === "ok" ? "ok" : "warn"}>{health.status}</StatusChip>
      </CardHeader>
      <CardBody>
        <dl>
          <Row label="Snowflake">
            {health.snowflake.reachable ? "reachable" : "not reachable"} (
            {health.snowflake.database})
          </Row>
          <Row label="Warehouse">
            {health.snowflake.warehouse} · {health.snowflake.warehouse_state ?? "state unknown"}
          </Row>
          <Row label="Router model">
            <span className="font-mono text-xs">{health.cortex.router_model}</span>
          </Row>
          <Row label="Strong model">
            <span className="font-mono text-xs">{health.cortex.strong_model}</span>
          </Row>
          <Row label="Safety path">{health.cortex.safety_path}</Row>
          <Row label="Audit writes">
            <StatusChip tone={health.audit_writes === "ok" ? "ok" : "warn"}>
              {health.audit_writes}
            </StatusChip>
          </Row>
          <Row label="Version">
            {health.version} · {health.environment}
          </Row>
        </dl>
      </CardBody>
    </Card>
  );
}
