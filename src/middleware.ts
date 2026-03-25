import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;
  const isAuthPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAuthPage) {
    // If already logged in, redirect away from login page
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/products", req.nextUrl));
    }
    return null; // Allow login page access
  }

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  return null;
});

export const config = {
  // Exclude API routes, static files, and NextAuth callbacks from middleware
  matcher: ["/admin/:path*"],
};
