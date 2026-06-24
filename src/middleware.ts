import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, getAdminToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  let adminToken: string;
  try {
    adminToken = getAdminToken();
  } catch {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE);
  if (session?.value !== adminToken) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
