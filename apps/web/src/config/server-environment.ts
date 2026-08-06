import "server-only";

import { parseInternalApiOrigin } from "./internal-api-origin";

export const webServerEnvironment = Object.freeze({
  internalApiOrigin: parseInternalApiOrigin(
    process.env.WEB_INTERNAL_API_ORIGIN,
  ),
});
