import { Spinner } from "@/components/ui/spinner";

export default function AuthLoading() {
  return (
    <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner />
      Loading…
    </p>
  );
}
