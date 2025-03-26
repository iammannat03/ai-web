import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/api/:path*"],
};

export function middleware(request: NextRequest) {
  const url = new URL(
    `${
      process.env.API_BASE
    }${request.nextUrl.pathname.replace(/^\/api/, "")}${
      request.nextUrl.search
    }`
  );

  return NextResponse.rewrite(url, { request });
}
