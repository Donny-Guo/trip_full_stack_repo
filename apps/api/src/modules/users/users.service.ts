import { Injectable } from "@nestjs/common";
import type { EntityManager } from "typeorm";
import type { NormalizedEmail } from "./email-address.js";
import type { SafeUser, UserCredential } from "./safe-user.js";
import { UsersRepository } from "./users.repository.js";

@Injectable()
export class UsersService {
  public constructor(private readonly repository: UsersRepository) {}

  public createWithManager(
    manager: EntityManager,
    email: NormalizedEmail,
    passwordHash: string,
  ): Promise<SafeUser> {
    return this.repository.createWithManager(manager, email, passwordHash);
  }

  public findSafeById(id: string): Promise<SafeUser | null> {
    return this.repository.findSafeById(id);
  }

  public findCredentialByEmail(
    email: NormalizedEmail,
  ): Promise<UserCredential | null> {
    return this.repository.findCredentialByEmail(email);
  }
}
