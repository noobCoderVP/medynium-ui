import type { Metadata } from "next";
import { Suspense } from "react";
import { ActivityView } from "./components/activity-view";

export const metadata: Metadata = { title: "Activity log" };

export default function ActivityPage() {
  return (
    <Suspense>
      <ActivityView />
    </Suspense>
  );
}
