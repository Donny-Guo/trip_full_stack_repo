import { Inject, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ApiException } from "../../common/http/api-exception.js";
import { normalizeEmail } from "../users/email-address.js";
import type { SafeUser, UserCredential } from "../users/safe-user.js";
import { EmailAlreadyExistsError } from "../users/users.repository.js";
import { UsersService } from "../users/users.service.js";
import { AUTH_DUMMY_HASH } from "./auth.tokens.js";
import type { LoginDto } from "./dto/login.dto.js";
import type { SignUpDto } from "./dto/sign-up.dto.js";
import {
  PasswordHashCapacityError,
  PasswordHasher,
} from "./password/password-hasher.service.js";
import { PasswordPolicy } from "./password/password-policy.js";
import { AccessTokenService } from "./session/access-token.service.js";

interface IssuedSession {
  readonly user: SafeUser;
  readonly accessToken: string;
}

function safeCredentialUser(credential: UserCredential): SafeUser {
  return Object.freeze({
    id: credential.id,
    email: credential.email,
    createdAt: credential.createdAt,
    updatedAt: credential.updatedAt,
  });
}

@Injectable()
export class AuthService {
  public constructor(
    private readonly dataSource: DataSource,
    private readonly users: UsersService,
    private readonly passwordPolicy: PasswordPolicy,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokens: AccessTokenService,
    @Inject(AUTH_DUMMY_HASH) private readonly dummyHash: string,
  ) {}

  public async signUp(dto: SignUpDto): Promise<IssuedSession> {
    const emailResult = normalizeEmail(dto.email);
    if (!emailResult.ok) {
      throw ApiException.validation({ email: emailResult.codes });
    }
    const policyErrors = this.passwordPolicy.validate(dto.password);
    if (policyErrors.length > 0) {
      throw ApiException.validation({ password: policyErrors });
    }

    try {
      const passwordHash = await this.passwordHasher.hash(dto.password);
      return await this.dataSource.transaction(async (manager) => {
        const user = await this.users.createWithManager(
          manager,
          emailResult.value,
          passwordHash,
        );
        const accessToken = await this.tokens.issue(user.id);
        return Object.freeze({ user, accessToken });
      });
    } catch (error: unknown) {
      if (error instanceof EmailAlreadyExistsError) {
        throw ApiException.emailAlreadyExists();
      }
      if (error instanceof PasswordHashCapacityError) {
        throw ApiException.serviceUnavailable();
      }
      throw error;
    }
  }

  public async login(dto: LoginDto): Promise<IssuedSession> {
    if (Buffer.byteLength(dto.password, "utf8") > 1_024) {
      throw ApiException.validation({
        password: ["PASSWORD_TRANSPORT_TOO_LARGE"],
      });
    }

    const emailResult = normalizeEmail(dto.email);
    if (!emailResult.ok) {
      throw ApiException.validation({ email: emailResult.codes });
    }
    const credential = await this.users.findCredentialByEmail(
      emailResult.value,
    );
    try {
      if (credential === null) {
        await this.passwordHasher.verify(this.dummyHash, dto.password);
        throw ApiException.invalidCredentials();
      }

      const valid = await this.passwordHasher.verify(
        credential.passwordHash,
        dto.password,
      );
      if (!valid) throw ApiException.invalidCredentials();

      return Object.freeze({
        user: safeCredentialUser(credential),
        accessToken: await this.tokens.issue(credential.id),
      });
    } catch (error: unknown) {
      if (error instanceof PasswordHashCapacityError) {
        throw ApiException.serviceUnavailable();
      }
      throw error;
    }
  }

  public async currentUser(userId: string): Promise<SafeUser> {
    const user = await this.users.findSafeById(userId);
    if (user === null) throw ApiException.unauthenticated();
    return user;
  }
}
