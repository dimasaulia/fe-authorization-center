/**
 * OpenSuite SDK - Proxy / Middleware
 * 
 * Route protection at the edge/server level.
 * Checks for auth cookie existence to protect routes.
 * 
 * Note: This only checks authentication (cookie exists).
 * Authorization (permission checks) happens client-side via the provider
 * because permissions are dynamic and fetched from the authorization server.
 */

import { NextResponse, type NextRequest } from "next/server";
import { COOKIES, DEFAULTS } from "@/modules/opensuite-sdk/constants";

/** Routes that require authentication */
const protectedPatterns = [
  "/dashboard",
  "/users",
  "/apps",
  "/teams",
  "/actions",
  "/roles",
  "/settings",
];

/** Routes that should redirect to dashboard if already authenticated */
const guestOnlyPatterns = [DEFAULTS.LOGIN_ROUTE];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get(COOKIES.AUTH_TOKEN)?.value;
  const isAuthenticated = !!authToken;

  // Check if current path matches protected patterns
  const isProtectedRoute = protectedPatterns.some(
    (pattern) => pathname === pattern || pathname.startsWith(`${pattern}/`),
  );

  // Check if current path is guest-only (login, register, etc.)
  const isGuestOnlyRoute = guestOnlyPatterns.some(
    (pattern) => pathname === pattern || pathname.startsWith(`${pattern}/`),
  );

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(DEFAULTS.LOGIN_ROUTE, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from guest-only routes
  if (isGuestOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(DEFAULTS.DEFAULT_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/apps/:path*",
    "/teams/:path*",
    "/actions/:path*",
    "/roles/:path*",
    "/settings/:path*",
    "/login",
  ],
};
