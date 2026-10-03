import { NextResponse, type NextRequest } from "next/server";

// First layer of the auth gate (Next 16 renamed "middleware" to "proxy"). It only checks that a session
// cookie exists, which is enough to keep signed-out visitors off workstation pages. The real checks are
// the API's, and the client's 401 handling is the second layer (src/lib/api/client.ts).
//
// The refresh cookie is scoped to /api/auth, so this file cannot see it. When the 15-minute access cookie
// has expired, the visitor lands on sign-in, which quietly resumes the session with the refresh cookie.
// The component gallery is public in development only; in production it is a 404 anyway.
const PUBLIC_PREFIXES = [
  "/sign-in",
  "/invite",
  ...(process.env.NODE_ENV === "production" ? [] : ["/dev"]),
];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.next();
  }
  if (request.cookies.has("med_access")) return NextResponse.next();

  const signIn = request.nextUrl.clone();
  signIn.pathname = "/sign-in";
  signIn.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(signIn);
}

export const config = {
  // Everything except the API proxy, Next internals and files with an extension.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
