import type { IncomingHttpHeaders } from "node:http";
import { hasTrustedProvenance, singleHeader } from "./request-policy.js";

describe("request policy", () => {
  const trusted = new Set(["http://localhost:3000"]);
  const rejectedCases: ReadonlyArray<{
    readonly name: string;
    readonly headers: IncomingHttpHeaders;
  }> = [
    { name: "missing provenance", headers: {} },
    { name: "null Origin", headers: { origin: "null" } },
    { name: "cross origin", headers: { origin: "https://evil.example" } },
    {
      name: "cross-site Fetch Metadata",
      headers: {
        origin: "http://localhost:3000",
        "sec-fetch-site": "cross-site",
      },
    },
  ];

  it("accepts an exact trusted Origin", () => {
    expect(
      hasTrustedProvenance(
        { origin: "http://localhost:3000", "sec-fetch-site": "same-origin" },
        trusted,
      ),
    ).toBe(true);
  });

  it("accepts same-site Fetch Metadata only with an exact trusted Origin", () => {
    expect(
      hasTrustedProvenance(
        { origin: "http://localhost:3000", "sec-fetch-site": "same-site" },
        trusted,
      ),
    ).toBe(true);
    expect(
      hasTrustedProvenance(
        { origin: "http://localhost:3001", "sec-fetch-site": "same-site" },
        trusted,
      ),
    ).toBe(false);
  });

  it("accepts a trusted Referer only when Origin is absent", () => {
    expect(
      hasTrustedProvenance({ referer: "http://localhost:3000/form" }, trusted),
    ).toBe(true);
  });

  it.each(rejectedCases)("rejects $name", ({ headers }) => {
    expect(hasTrustedProvenance(headers, trusted)).toBe(false);
  });

  it("rejects multiple or comma-combined header values", () => {
    expect(singleHeader(["a", "b"])).toBeNull();
    expect(singleHeader("a,b")).toBeNull();
  });
});
