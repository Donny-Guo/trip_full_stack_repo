import { Inject, Injectable } from "@nestjs/common";
import {
  argon2id,
  hash as argonHash,
  needsRehash,
  verify as argonVerify,
} from "argon2";

export const PASSWORD_HASH_CAPACITY = Symbol("PASSWORD_HASH_CAPACITY");

export const ARGON2_OPTIONS = Object.freeze({
  type: argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  hashLength: 32,
});

export class PasswordHashCapacityError extends Error {
  public constructor() {
    super("Password hashing capacity is exhausted.");
    this.name = "PasswordHashCapacityError";
  }
}

interface PendingHashOperation {
  readonly start: () => void;
}

function abortError(signal: AbortSignal): Error {
  const reason: unknown = signal.reason;
  return reason instanceof Error
    ? reason
    : new Error("Password hash operation was aborted.");
}

export class PasswordHashCapacity {
  private active = 0;
  private readonly pending: PendingHashOperation[] = [];

  public constructor(
    private readonly concurrency: number,
    private readonly queueLimit: number,
  ) {}

  public run<T>(operation: () => Promise<T>, signal?: AbortSignal): Promise<T> {
    if (signal?.aborted === true) {
      return Promise.reject(abortError(signal));
    }
    if (this.active < this.concurrency) {
      return this.execute(operation);
    }
    if (this.pending.length >= this.queueLimit) {
      return Promise.reject(new PasswordHashCapacityError());
    }

    return new Promise<T>((resolve, reject) => {
      const onAbort = () => {
        const index = this.pending.indexOf(item);
        if (index >= 0) this.pending.splice(index, 1);
        reject(
          signal === undefined
            ? new Error("Password hash operation was aborted.")
            : abortError(signal),
        );
      };
      const cleanup = () => signal?.removeEventListener("abort", onAbort);
      const item: PendingHashOperation = {
        start: () => {
          cleanup();
          void this.execute(operation).then(resolve, reject);
        },
      };
      signal?.addEventListener("abort", onAbort, { once: true });
      this.pending.push(item);
      if (signal?.aborted === true) onAbort();
    });
  }

  private async execute<T>(operation: () => Promise<T>): Promise<T> {
    this.active += 1;
    try {
      return await operation();
    } finally {
      this.active -= 1;
      this.pending.shift()?.start();
    }
  }
}

@Injectable()
export class PasswordHasher {
  public constructor(
    @Inject(PASSWORD_HASH_CAPACITY)
    private readonly capacity: PasswordHashCapacity,
  ) {}

  public hash(password: string): Promise<string> {
    return this.capacity.run(() => argonHash(password, ARGON2_OPTIONS));
  }

  public verify(passwordHash: string, candidate: string): Promise<boolean> {
    return this.capacity.run(() => argonVerify(passwordHash, candidate));
  }

  public needsRehash(passwordHash: string): boolean {
    return needsRehash(passwordHash, ARGON2_OPTIONS);
  }
}

export function validateDummyHash(value: string): string {
  const parts = value.split("$");
  const algorithm = parts[1];
  const version = parts[2];
  const encodedParameters = parts[3];
  const encodedSalt = parts[4];
  const encodedHash = parts[5];
  if (
    parts.length !== 6 ||
    parts[0] !== "" ||
    algorithm !== "argon2id" ||
    version !== "v=19" ||
    encodedParameters === undefined ||
    encodedSalt === undefined ||
    encodedHash === undefined ||
    !/^[A-Za-z0-9+/]+$/.test(encodedSalt) ||
    !/^[A-Za-z0-9+/]+$/.test(encodedHash)
  ) {
    throw new Error(
      "Invalid configuration: AUTH_DUMMY_PASSWORD_HASH is malformed.",
    );
  }

  const parameters = new Map<string, string>();
  for (const parameter of encodedParameters.split(",")) {
    const separator = parameter.indexOf("=");
    if (separator <= 0) {
      throw new Error(
        "Invalid configuration: AUTH_DUMMY_PASSWORD_HASH is malformed.",
      );
    }
    const name = parameter.slice(0, separator);
    if (parameters.has(name)) {
      throw new Error(
        "Invalid configuration: AUTH_DUMMY_PASSWORD_HASH is malformed.",
      );
    }
    parameters.set(name, parameter.slice(separator + 1));
  }
  if (
    parameters.size !== 3 ||
    parameters.get("m") !== "19456" ||
    parameters.get("t") !== "2" ||
    parameters.get("p") !== "1" ||
    needsRehash(value, ARGON2_OPTIONS)
  ) {
    throw new Error(
      "Invalid configuration: AUTH_DUMMY_PASSWORD_HASH is incompatible.",
    );
  }

  const decodePhc = (encoded: string): Buffer =>
    Buffer.from(
      encoded.padEnd(Math.ceil(encoded.length / 4) * 4, "="),
      "base64",
    );
  if (
    decodePhc(encodedSalt).byteLength < 16 ||
    decodePhc(encodedHash).byteLength !== 32
  ) {
    throw new Error(
      "Invalid configuration: AUTH_DUMMY_PASSWORD_HASH is malformed.",
    );
  }
  return value;
}
