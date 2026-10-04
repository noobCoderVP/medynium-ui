"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/** Returns to the previous page. */
export function BackButton() {
  const router = useRouter();
  return (
    <Button variant="outline" onClick={() => router.back()}>
      <ArrowLeft aria-hidden="true" />
      Go back
    </Button>
  );
}
