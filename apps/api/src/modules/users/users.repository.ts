import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError } from "typeorm";
import type { EntityManager, Repository } from "typeorm";
import type { NormalizedEmail } from "./email-address.js";
import { toSafeUser } from "./safe-user.js";
import type { SafeUser, UserCredential } from "./safe-user.js";
import { UserEntity } from "./user.entity.js";

@Injectable()
export class UsersRepository {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  public async createWithManager(
    manager: EntityManager,
    email: NormalizedEmail,
    passwordHash: string,
  ): Promise<SafeUser> {
    const users = manager.getRepository(UserEntity);
    try {
      const saved = await users.save(users.create({ email, passwordHash }));
      return toSafeUser(saved);
    } catch (error: unknown) {
      if (isPostgresConstraint(error, "23505", "uq_users_email")) {
        throw new EmailAlreadyExistsError();
      }
      throw error;
    }
  }

  public async findSafeById(id: string): Promise<SafeUser | null> {
    const user = await this.users.findOneBy({ id });
    return user === null ? null : toSafeUser(user);
  }

  public async findCredentialByEmail(
    email: NormalizedEmail,
  ): Promise<UserCredential | null> {
    const user = await this.users
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("user.email = :email", { email })
      .getOne();

    return user === null
      ? null
      : Object.freeze({ ...toSafeUser(user), passwordHash: user.passwordHash });
  }
}

export class EmailAlreadyExistsError extends Error {
  public constructor() {
    super("User email unique constraint failed.");
    this.name = "EmailAlreadyExistsError";
  }
}

function isPostgresConstraint(
  error: unknown,
  code: string,
  constraint: string,
): boolean {
  if (!(error instanceof QueryFailedError) || !isRecord(error.driverError)) {
    return false;
  }
  return (
    error.driverError.code === code &&
    error.driverError.constraint === constraint
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
