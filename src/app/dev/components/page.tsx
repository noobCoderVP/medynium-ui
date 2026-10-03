import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Gallery } from "./components/gallery";

export const metadata: Metadata = { title: "Component gallery" };

// Dev only (X-6): used for visual review and axe checks. A production build answers 404.
export default function ComponentGalleryPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Gallery />;
}
