export type SafeReturnPath = "/dashboard";

const DEFAULT_RETURN_PATH: SafeReturnPath = "/dashboard";

export function sanitizeReturnPath(
  value: string | string[] | undefined,
): SafeReturnPath {
  return value === DEFAULT_RETURN_PATH ? value : DEFAULT_RETURN_PATH;
}
