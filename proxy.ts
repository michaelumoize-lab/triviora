import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";

  // Ignore static files, Next internals, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/og-image.png"
  ) {
    return NextResponse.next();
  }

  // Handle access to /maintenance
  if (pathname === "/maintenance") {
    if (!maintenanceMode) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // If maintenance is ON → redirect everything
  if (maintenanceMode) {
    const response = NextResponse.redirect(
      new URL("/maintenance", request.url),
    );
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  // Define public routes (no authentication required)
  const publicRoutes = [
    "/",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/privacy-policy",
    "/terms-of-service",
    "/data-security",
    "/sitemap.xml",
    "/robots.txt",
  ];

  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathname === route || (route !== "/" && pathname.startsWith(`${route}/`)),
  );
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Optimistic cookie check — does NOT validate against DB
  // Do real auth checks inside protected pages/layouts using getServerSession
  const session = getSessionCookie(request);

  if (!session) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
