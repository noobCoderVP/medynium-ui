/** Only same-origin paths are followed after sign-in; anything else (an absolute URL, "//host") goes to the dashboard. */
export function safeNext(next: string | undefined): string {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\")
    ? next
    : "/dashboard";
}
