import type { Metadata } from "next";
import { PendingView } from "./components/pending-view";

export const metadata: Metadata = { title: "Pending work" };

export default function PendingPage() {
  return <PendingView />;
}
