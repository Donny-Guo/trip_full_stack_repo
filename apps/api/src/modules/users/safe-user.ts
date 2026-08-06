import type { UserEntity } from "./user.entity.js";

export interface SafeUser {
  readonly id: string;
  readonly email: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface UserCredential extends SafeUser {
  readonly passwordHash: string;
}

export function toSafeUser(user: UserEntity): SafeUser {
  return Object.freeze({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  });
}
