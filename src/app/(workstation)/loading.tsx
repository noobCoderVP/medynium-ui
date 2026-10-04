import { HeartbeatLoader } from "@/components/shared/heartbeat-loader";

export default function WorkstationLoading() {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="flex min-h-full flex-col">
      <span className="sr-only">Loading page</span>
      <HeartbeatLoader />
    </div>
  );
}
