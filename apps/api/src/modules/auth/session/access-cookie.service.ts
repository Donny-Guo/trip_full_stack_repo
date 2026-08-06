import { Inject, Injectable } from "@nestjs/common";
import { parseCookie, stringifySetCookie } from "cookie";
import { AUTH_COOKIE_SECURE } from "../auth.tokens.js";

@Injectable()
export class AccessCookieService {
  public constructor(
    @Inject(AUTH_COOKIE_SECURE) private readonly secure: boolean,
  ) {}

  public get name(): "__Host-trip_access" | "trip_access_dev" {
    return this.secure ? "__Host-trip_access" : "trip_access_dev";
  }

  public set(token: string): string {
    return stringifySetCookie({
      name: this.name,
      value: token,
      httpOnly: true,
      secure: this.secure,
      sameSite: "lax",
      path: "/",
      maxAge: 900,
    });
  }

  public clear(): string {
    return stringifySetCookie({
      name: this.name,
      value: "",
      httpOnly: true,
      secure: this.secure,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
  }

  public read(cookieHeader: string | undefined): string | null {
    if (cookieHeader === undefined) return null;
    const targetPrefix = `${this.name}=`;
    const targetCount = cookieHeader
      .split(";")
      .map((part) => part.trimStart())
      .filter((part) => part.startsWith(targetPrefix)).length;
    if (targetCount !== 1) return null;
    try {
      const value = parseCookie(cookieHeader)[this.name];
      return typeof value === "string" && value.length > 0 ? value : null;
    } catch {
      return null;
    }
  }
}
