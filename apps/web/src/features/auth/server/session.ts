import "server-only";

import { webServerEnvironment } from "@/config/server-environment";
import { isValidMeResponse } from "@/features/auth/auth-contract";
import { cookies } from "next/headers";

export type SessionStatus =
  | Readonly<{ kind: "authenticated" }>
  | Readonly<{ kind: "unauthenticated" }>
  | Readonly<{ kind: "unavailable" }>;

export async function getSessionStatus(): Promise<SessionStatus> {
  const cookieHeader = (await cookies()).toString();

  try {
    const response = await fetch(
      `${webServerEnvironment.internalApiOrigin}/api/v1/auth/me`,
      {
        method: "GET",
        cache: "no-store",
        headers: cookieHeader.length === 0 ? {} : { Cookie: cookieHeader },
        signal: AbortSignal.timeout(5_000),
      },
    );

    if (response.status === 200) {
      return (await isValidMeResponse(response))
        ? { kind: "authenticated" }
        : { kind: "unavailable" };
    }
    if (response.status === 401) return { kind: "unauthenticated" };
    return { kind: "unavailable" };
  } catch {
    return { kind: "unavailable" };
  }
}
