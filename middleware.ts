import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "promed_auth";

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  "/api/auth",
  "/api/trpc",
  "/_next",
  "/favicon.ico",
  "/logo-alteridad.png",
  "/logo-promed.webp",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow static assets
  if (pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|css|js)$/)) {
    return NextResponse.next();
  }

  // Check auth cookie
  const authCookie = request.cookies.get(AUTH_COOKIE);
  const isAuthenticated = authCookie?.value === "authenticated";

  if (!isAuthenticated) {
    // Return a response that the client can detect
    // The ProtectedRoute component will show the login form
    const response = NextResponse.next();
    response.headers.set("x-auth-required", "true");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
