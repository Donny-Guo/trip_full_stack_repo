import { describe, expect, it } from "vitest";

import { parseInternalApiOrigin } from "./internal-api-origin";

describe("parseInternalApiOrigin", () => {
  it("accepts an exact local origin", () => {
    expect(parseInternalApiOrigin("http://localhost:3001")).toBe(
      "http://localhost:3001",
    );
  });

  it.each([
    undefined,
    "",
    "localhost:3001",
    "ftp://localhost:3001",
    "http://user:password@localhost:3001",
    "http://localhost:3001/",
    "http://localhost:3001/api",
    "http://localhost:3001?debug=true",
  ])("rejects an unsafe value: %s", (value) => {
    expect(() => parseInternalApiOrigin(value)).toThrow(
      "Invalid Web configuration",
    );
  });
});
