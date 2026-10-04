import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/find-tickets" && request.nextUrl.searchParams.get("category") === "basketball") {
    return NextResponse.redirect(new URL("/nba", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/find-tickets"],
};
