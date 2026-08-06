import type { IncomingHttpHeaders } from "node:http";

type HeaderValue = string | null | undefined;

export function singleHeader(
  value: string | string[] | undefined,
): HeaderValue {
  if (value === undefined) return undefined;
  if (Array.isArray(value) || value.includes(",")) return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export function hasTrustedProvenance(
  headers: IncomingHttpHeaders,
  trustedOrigins: ReadonlySet<string>,
): boolean {
  const fetchSite = singleHeader(headers["sec-fetch-site"]);
  if (
    fetchSite === null ||
    (fetchSite !== undefined &&
      fetchSite !== "same-origin" &&
      fetchSite !== "same-site")
  ) {
    return false;
  }

  const origin = singleHeader(headers.origin);
  if (origin === null) return false;
  if (origin !== undefined)
    return origin !== "null" && trustedOrigins.has(origin);

  const referer = singleHeader(headers.referer);
  if (referer === undefined || referer === null) return false;
  try {
    return trustedOrigins.has(new URL(referer).origin);
  } catch {
    return false;
  }
}

export const UNSAFE_METHODS: ReadonlySet<string> = new Set([
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);
