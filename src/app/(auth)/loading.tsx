import { HeartbeatLoader } from "@/components/shared/heartbeat-loader";

export default function AuthLoading() {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <HeartbeatLoader compact />
    </div>
  );
}
