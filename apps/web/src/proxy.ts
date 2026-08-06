import { webServerEnvironment } from "@/config/server-environment";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: "/api/v1/:path*",
};

export function proxy(request: NextRequest): NextResponse {
  const destination = new URL(
    request.nextUrl.pathname + request.nextUrl.search,
    `${webServerEnvironment.internalApiOrigin}/`,
  );

  return NextResponse.rewrite(destination);
}
