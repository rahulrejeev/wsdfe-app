import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, getAdminToken } from "@/lib/auth";

const SCAN_UUID_PATTERN = /^\/scan\/([0-9a-f-]{36})$/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const scanMatch = pathname.match(SCAN_UUID_PATTERN);
  if (scanMatch) {
    const url = request.nextUrl.clone();
    url.pathname = "/scan";
    url.search = "";
    url.searchParams.set("item", scanMatch[1]);
    return NextResponse.redirect(url);
  }

  const isAdminRoute =
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login");

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
  matcher: ["/admin/:path*", "/scan/:path*"],
};
