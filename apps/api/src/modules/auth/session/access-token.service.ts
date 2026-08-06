import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { isUUID } from "class-validator";
import { AUTH_CLOCK } from "../auth.tokens.js";
import type { AuthPrincipal } from "./auth-principal.js";

export interface Clock {
  nowSeconds(): number;
}

export const SYSTEM_CLOCK: Clock = Object.freeze({
  nowSeconds: () => Math.floor(Date.now() / 1_000),
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseRequiredAccessClaims(
  payload: unknown,
  now: number,
): AuthPrincipal {
  if (
    !isRecord(payload) ||
    payload.iss !== "trip-api" ||
    payload.aud !== "trip-web" ||
    typeof payload.sub !== "string" ||
    !isUUID(payload.sub, "4") ||
    typeof payload.iat !== "number" ||
    !Number.isSafeInteger(payload.iat) ||
    typeof payload.exp !== "number" ||
    !Number.isSafeInteger(payload.exp) ||
    payload.exp - payload.iat !== 900 ||
    payload.iat > now + 30 ||
    payload.exp <= now - 30
  ) {
    throw new Error("Invalid access-token claims.");
  }
  return Object.freeze({ userId: payload.sub });
}

@Injectable()
export class AccessTokenService {
  public constructor(
    private readonly jwt: JwtService,
    @Inject(AUTH_CLOCK) private readonly clock: Clock,
  ) {}

  public issue(userId: string): Promise<string> {
    const issuedAt = this.clock.nowSeconds();
    return this.jwt.signAsync(
      { iat: issuedAt, exp: issuedAt + 900 },
      {
        algorithm: "HS256",
        subject: userId,
        issuer: "trip-api",
        audience: "trip-web",
      },
    );
  }

  public async verify(token: string): Promise<AuthPrincipal> {
    const now = this.clock.nowSeconds();
    const payload: unknown = await this.jwt.verifyAsync(token, {
      algorithms: ["HS256"],
      issuer: "trip-api",
      audience: "trip-web",
      clockTolerance: 30,
      clockTimestamp: now,
    });
    return parseRequiredAccessClaims(payload, now);
  }
}
