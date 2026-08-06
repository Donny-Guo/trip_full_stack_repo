import {
  PasswordHashCapacity,
  PasswordHashCapacityError,
  PasswordHasher,
  validateDummyHash,
} from "./password-hasher.service.js";

describe("password hashing", () => {
  it("creates salted Argon2id hashes and verifies them", async () => {
    const hasher = new PasswordHasher(new PasswordHashCapacity(1, 2));
    const first = await hasher.hash("UnitOnly9@");
    const second = await hasher.hash("UnitOnly9@");

    expect(first).toMatch(/^\$argon2id\$v=19\$/);
    expect(validateDummyHash(first)).toBe(first);
    expect(second).not.toBe(first);
    await expect(hasher.verify(first, "UnitOnly9@")).resolves.toBe(true);
    await expect(hasher.verify(first, "wrong-value")).resolves.toBe(false);
  });

  it("rejects work beyond the concurrency and queue bounds", async () => {
    const capacity = new PasswordHashCapacity(1, 1);
    let releaseFirst: (() => void) | undefined;
    const first = capacity.run(
      () =>
        new Promise<void>((resolve) => {
          releaseFirst = resolve;
        }),
    );
    const second = capacity.run(() => Promise.resolve());

    await expect(capacity.run(() => Promise.resolve())).rejects.toBeInstanceOf(
      PasswordHashCapacityError,
    );
    releaseFirst?.();
    await first;
    await second;
  });
});
