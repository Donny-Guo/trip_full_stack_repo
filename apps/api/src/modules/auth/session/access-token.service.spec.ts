import { createSecretKey } from "node:crypto";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenService, type Clock } from "./access-token.service.js";

describe("AccessTokenService", () => {
  const now = 1_800_000_000;
  const userId = "907b8a4c-d5ce-4d5a-9dd5-d84beac7b082";
  const secret = createSecretKey(Buffer.alloc(32, 7));
  const clock: Clock = { nowSeconds: () => now };
  const jwt = new JwtService({
    secret,
    signOptions: {
      algorithm: "HS256",
      issuer: "trip-api",
      audience: "trip-web",
    },
    verifyOptions: {
      algorithms: ["HS256"],
      issuer: "trip-api",
      audience: "trip-web",
      clockTolerance: 30,
    },
  });
  const service = new AccessTokenService(jwt, clock);

  it("issues and verifies the required principal", async () => {
    const token = await service.issue(userId);
    await expect(service.verify(token)).resolves.toEqual({ userId });
  });

  it("rejects a token with an invalid signature", async () => {
    const otherJwt = new JwtService({
      secret: createSecretKey(Buffer.alloc(32, 8)),
    });
    const token = await otherJwt.signAsync(
      { iat: now, exp: now + 900 },
      {
        algorithm: "HS256",
        subject: userId,
        issuer: "trip-api",
        audience: "trip-web",
      },
    );
    await expect(service.verify(token)).rejects.toThrow();
  });

  it("rejects an expired token", async () => {
    const token = await jwt.signAsync(
      { iat: now - 1_000, exp: now - 100 },
      {
        algorithm: "HS256",
        subject: userId,
        issuer: "trip-api",
        audience: "trip-web",
      },
    );
    await expect(service.verify(token)).rejects.toThrow();
  });

  it("rejects a token signed with a non-allowlisted algorithm", async () => {
    const signer = new JwtService({ secret });
    const token = await signer.signAsync(
      { iat: now, exp: now + 900 },
      {
        algorithm: "HS384",
        subject: userId,
        issuer: "trip-api",
        audience: "trip-web",
      },
    );
    await expect(service.verify(token)).rejects.toThrow();
  });

  it("rejects invalid required claims", async () => {
    const signer = new JwtService({ secret });
    const invalidTokens = await Promise.all([
      signer.signAsync(
        { iat: now, exp: now + 900 },
        {
          algorithm: "HS256",
          subject: "not-a-user-uuid",
          issuer: "trip-api",
          audience: "trip-web",
        },
      ),
      signer.signAsync(
        { iat: now, exp: now + 900 },
        {
          algorithm: "HS256",
          subject: userId,
          issuer: "another-api",
          audience: "trip-web",
        },
      ),
      signer.signAsync(
        { iat: now, exp: now + 900 },
        {
          algorithm: "HS256",
          subject: userId,
          issuer: "trip-api",
          audience: "another-web",
        },
      ),
      signer.signAsync(
        { iat: now, exp: now + 901 },
        {
          algorithm: "HS256",
          subject: userId,
          issuer: "trip-api",
          audience: "trip-web",
        },
      ),
      signer.signAsync(
        { iat: now + 31, exp: now + 931 },
        {
          algorithm: "HS256",
          subject: userId,
          issuer: "trip-api",
          audience: "trip-web",
        },
      ),
      signer.signAsync(
        { exp: now + 900 },
        {
          algorithm: "HS256",
          subject: userId,
          issuer: "trip-api",
          audience: "trip-web",
          noTimestamp: true,
        },
      ),
    ]);

    for (const token of invalidTokens) {
      await expect(service.verify(token)).rejects.toThrow();
    }
  });
});
