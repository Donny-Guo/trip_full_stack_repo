import { parseSetCookie } from "cookie";
import { AccessCookieService } from "./access-cookie.service.js";

describe("AccessCookieService", () => {
  it.each([
    [false, "trip_access_dev"],
    [true, "__Host-trip_access"],
  ] as const)("uses the correct cookie profile", (secure, expectedName) => {
    const service = new AccessCookieService(secure);
    const setCookie = parseSetCookie(service.set("test-token"));
    const clearCookie = parseSetCookie(service.clear());

    expect(setCookie).toMatchObject({
      name: expectedName,
      value: "test-token",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 900,
    });
    expect(setCookie.secure).toBe(secure ? true : undefined);
    expect(clearCookie).toMatchObject({
      name: expectedName,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    expect(clearCookie.secure).toBe(secure ? true : undefined);
  });

  it("rejects duplicate target cookies", () => {
    const service = new AccessCookieService(false);
    expect(service.read("trip_access_dev=one; trip_access_dev=two")).toBeNull();
  });
});
