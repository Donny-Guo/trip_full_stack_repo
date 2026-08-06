export function parseInternalApiOrigin(value: string | undefined): string {
  if (value === undefined || value.length === 0) {
    throw new Error(
      "Invalid Web configuration: WEB_INTERNAL_API_ORIGIN is required.",
    );
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "Invalid Web configuration: WEB_INTERNAL_API_ORIGIN must be a URL.",
    );
  }

  if (
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    value !== url.origin
  ) {
    throw new Error(
      "Invalid Web configuration: WEB_INTERNAL_API_ORIGIN must be an exact HTTP(S) origin without credentials, path, query, or fragment.",
    );
  }

  return url.origin;
}
