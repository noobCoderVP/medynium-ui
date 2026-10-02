"use client";

import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/lib/api/client";

/** Proves the browser -> /api proxy -> FastAPI path works, locally and once deployed. */
export function ApiStatus() {
  const { data, error, isPending } = useQuery({ queryKey: ["health"], queryFn: getHealth });

  if (isPending) return <p className="text-sm text-muted-foreground">Checking the API...</p>;
  if (error) {
    return (
      <p role="alert" className="text-sm text-destructive">
        The API is not reachable. Check BACKEND_URL and that the backend is running.
      </p>
    );
  }
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
      <dt className="text-muted-foreground">API</dt>
      <dd>
        {data.status} (v{data.version}, {data.environment})
      </dd>
      <dt className="text-muted-foreground">Snowflake</dt>
      <dd>
        {data.snowflake.configured ? "configured" : "not configured yet"} ({data.snowflake.database}
        )
      </dd>
      <dt className="text-muted-foreground">Agent</dt>
      <dd>{data.agent_configured ? "configured" : "not configured yet"}</dd>
    </dl>
  );
}
