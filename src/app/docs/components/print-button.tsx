"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Opens the browser's print dialog, where "Save as PDF" gives a shareable copy. Hidden on print itself. */
export function PrintButton() {
  return (
    <Button variant="outline" onClick={() => window.print()} className="max-sm:hidden">
      <Printer aria-hidden="true" data-icon="inline-start" />
      Save as PDF
    </Button>
  );
}
