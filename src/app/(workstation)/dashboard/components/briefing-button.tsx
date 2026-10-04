import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/** On request only: the briefing is never generated unless this is pressed. */
export function BriefingButton({ pending, onClick }: { pending: boolean; onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} loading={pending}>
      {pending ? null : <Sparkles aria-hidden="true" />}
      {pending ? "Preparing…" : "Brief me"}
    </Button>
  );
}
