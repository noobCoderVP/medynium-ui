import type { Metadata } from "next";
import { Suspense } from "react";
import { KnowledgeView } from "./components/knowledge-view";

export const metadata: Metadata = { title: "Knowledge" };

export default function KnowledgePage() {
  return (
    <Suspense>
      <KnowledgeView />
    </Suspense>
  );
}
