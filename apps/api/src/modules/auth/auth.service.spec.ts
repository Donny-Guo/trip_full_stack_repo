import { jest } from "@jest/globals";
import { Test } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { UsersService } from "../users/users.service.js";
import { AuthService } from "./auth.service.js";
import { AUTH_DUMMY_HASH } from "./auth.tokens.js";
import { PasswordHasher } from "./password/password-hasher.service.js";
import { PasswordPolicy } from "./password/password-policy.js";
import { AccessTokenService } from "./session/access-token.service.js";

describe("AuthService", () => {
  const dummyHash = "$argon2id$v=19$m=19456,t=2,p=1$test-salt$test-hash";
  const findCredentialByEmail =
    jest.fn<UsersService["findCredentialByEmail"]>();
  const verify = jest.fn<PasswordHasher["verify"]>();
  const issue = jest.fn<AccessTokenService["issue"]>();
  let service: AuthService;

  beforeEach(async () => {
    findCredentialByEmail.mockReset().mockResolvedValue(null);
    verify.mockReset().mockResolvedValue(false);
    issue.mockReset();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DataSource, useValue: { transaction: jest.fn() } },
        { provide: UsersService, useValue: { findCredentialByEmail } },
        { provide: PasswordPolicy, useValue: { validate: jest.fn() } },
        { provide: PasswordHasher, useValue: { verify } },
        { provide: AccessTokenService, useValue: { issue } },
        { provide: AUTH_DUMMY_HASH, useValue: dummyHash },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
  });

  it("performs exactly one fixed dummy-hash verification for an unknown user", async () => {
    const candidate = "Unknown9@Pass";

    await expect(
      service.login({ email: "unknown@example.com", password: candidate }),
    ).rejects.toMatchObject({
      publicError: { code: "INVALID_CREDENTIALS" },
    });

    expect(findCredentialByEmail).toHaveBeenCalledTimes(1);
    expect(verify).toHaveBeenCalledTimes(1);
    expect(verify).toHaveBeenCalledWith(dummyHash, candidate);
    expect(issue).not.toHaveBeenCalled();
  });
});
