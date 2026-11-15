// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define protected route prefixes
  const isAdminRoute = pathname.startsWith("/admin");
  const isDoctorRoute = pathname.startsWith("/doctor");
  const isPatientRoute = pathname.startsWith("/patient");

  // If the route is public, allow access immediately
  if (!isAdminRoute && !isDoctorRoute && !isPatientRoute) {
    return NextResponse.next();
  }

  // 2. Retrieve token from cookies 
  // (Note: If your backend stores tokens in localStorage, you must migrate auth tokens 
  // to HttpOnly cookies so middleware can read them securely on the server side)
  const token = request.cookies.get("accessToken")?.value || request.cookies.get("token")?.value;
  const userRole = request.cookies.get("userRole")?.value; // "ADMIN", "DOCTOR", "PATIENT"

  // 3. If no token exists, redirect to the appropriate sign-in page
  if (!token) {
    let signInUrl = "/auth/patient/sign-in";
    if (isAdminRoute) signInUrl = "/auth/admin/sign-in";
    else if (isDoctorRoute) signInUrl = "/auth/doctor/sign-in";

    const loginUrl = new URL(signInUrl, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Enforce Strict Role-Based Access Control (RBAC)
  if (isAdminRoute && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/auth/admin/sign-in", request.url));
  }

  if (isDoctorRoute && userRole !== "DOCTOR") {
    return NextResponse.redirect(new URL("/auth/doctor/sign-in", request.url));
  }

  if (isPatientRoute && userRole !== "PATIENT" && userRole !== "USER") {
    return NextResponse.redirect(new URL("/auth/patient/sign-in", request.url));
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/admin/:path*", "/doctor/:path*", "/patient/:path*"],
};