import type { Metadata } from "next";
import { SignInForm } from "./components/sign-in-form";
import { safeNext } from "./lib/safe-next";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const { next } = await searchParams;
  return <SignInForm next={safeNext(typeof next === "string" ? next : undefined)} />;
}
