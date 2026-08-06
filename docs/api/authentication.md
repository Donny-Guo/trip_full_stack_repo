# Authentication API and Local Runbook

Status: ISSUE-009 local MVP implementation. GitHub Issue #9 remains open until owner review and normal merge/closure workflow. This document describes local development only; it is not public-release approval.

Simplified Chinese follower: [authentication_ZH.md](./authentication_ZH.md). This English file is authoritative.

## Boundary

NestJS owns authentication and persistence under `/api/v1`. PostgreSQL runs through Docker Compose, while the API and migration CLI run on the host. The provisioner creates roles and extensions, the migrator owns approved application DDL, and the long-running API connects only as `trip_runtime`.

TypeORM uses ESM data sources with `synchronize`, `migrationsRun`, and `installExtensions` all disabled. Migrations are always an explicit command or deployment job.

## Local configuration

The three configuration classes are intentionally separate:

| File                            | Process                        | Contains                                                               |
| ------------------------------- | ------------------------------ | ---------------------------------------------------------------------- |
| Root `.env`                     | Docker Compose bootstrap       | Database name, port, and provisioner/migrator/runtime role credentials |
| `apps/api/.env.migration.local` | Explicit TypeORM migration CLI | Only `NODE_ENV` and the `trip_migrator` database URL                   |
| `apps/api/.env.runtime.local`   | Long-running NestJS API        | Only runtime database/auth/HTTP settings and the `trip_runtime` URL    |

Create each ignored local file from its matching tracked `.example`. Never copy the provisioner credential into an API file. The current local bootstrap requires 64-character lowercase hexadecimal role passwords, so those password bytes need no URL encoding. If a future password contains reserved URL user-info characters, percent-encode only the password when placing it in a PostgreSQL URL.

Generate three different local database passwords:

```sh
openssl rand -hex 32
openssl rand -hex 32
openssl rand -hex 32
```

Generate the runtime JWT secret and a fixed non-user dummy Argon2id hash:

```sh
openssl rand -base64 32

pnpm --filter api exec node --input-type=module -e '
  import { randomBytes } from "node:crypto";
  import { argon2id, hash } from "argon2";
  console.log(await hash(randomBytes(32).toString("base64"), {
    type: argon2id, memoryCost: 19456, timeCost: 2,
    parallelism: 1, hashLength: 32
  }));
'
```

Paste only the outputs into the ignored local files, then restrict them:

```sh
chmod 600 \
  .env \
  apps/api/.env.runtime.local \
  apps/api/.env.migration.local
```

`AUTH_DUMMY_PASSWORD_HASH` is not a database password and is never associated with a user. It makes the unknown-account login path perform one bounded Argon2id verification. `AUTH_JWT_SECRET_BASE64` must decode to at least 32 random bytes.

## Start and migrate

From the repository root:

```sh
docker compose --env-file .env -f infra/docker/compose.yaml \
  up --detach --wait postgres

pnpm --filter api migration:show
pnpm --filter api migration:run
pnpm --filter api migration:show
pnpm --filter api dev
```

The first `migration:show` displays a pending migration on a clean database; the final command displays it as applied. Application startup never runs it.

Health endpoints:

- `GET /api/v1/health/live` checks only the API process.
- `GET /api/v1/health/ready` checks PostgreSQL with the runtime connection.

## Authentication contract

All auth and user responses use `Cache-Control: no-store`. Public responses never include a JWT or `password_hash`.

| Method and path             | Request                                   | Success                                                           |
| --------------------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| `POST /api/v1/auth/sign-up` | `{ "email": string, "password": string }` | `201`, safe User plus `AUTH_SIGN_UP_SUCCEEDED`, and access cookie |
| `POST /api/v1/auth/login`   | `{ "email": string, "password": string }` | `200`, safe User and access cookie                                |
| `GET /api/v1/auth/me`       | Access cookie                             | `200`, safe User                                                  |
| `POST /api/v1/auth/logout`  | `{}`                                      | Idempotent `204` and matching cookie deletion                     |

Safe User fields are `id`, `email`, `createdAt`, and `updatedAt`.

Creation emails are trimmed, lowercased, ASCII-only, at most 254 characters, and protected by a PostgreSQL canonical-form check and unique constraint. Creation passwords are exactly 8-20 ASCII characters from `A-Z`, `a-z`, `0-9`, and `$#@%`, with at least one character from each category. Passwords are never trimmed. The local MVP intentionally has no compromised/common-password blocklist and performs no remote password lookup.

Login verifies the submitted password unchanged and does not reapply current creation composition rules. Unknown email and wrong password both return `401 INVALID_CREDENTIALS`; the unknown-account path performs one verification against the fixed dummy hash.

Access JWTs are allowlisted to HS256 with `iss=trip-api`, `aud=trip-web`, a User UUID `sub`, required `iat`/`exp`, a 15-minute TTL, and at most 30 seconds of clock tolerance. Local HTTP uses `trip_access_dev`; production uses `__Host-trip_access`. Both are `HttpOnly`, `SameSite=Lax`, `Path=/`, and `Max-Age=900`; only the production cookie is `Secure`.

Unsafe methods require `Content-Type: application/json` and an exact configured `Origin`, or a configured-origin `Referer` only when `Origin` is absent. Missing, `null`, multiple, or untrusted provenance is rejected. Fetch Metadata may be `same-origin` or `same-site` only after the exact Origin/Referer check succeeds; `cross-site` is rejected. The JSON body limit is configured by `API_JSON_BODY_LIMIT_BYTES` and defaults to 16 KiB in the examples.

## Stable errors

Errors have this public shape:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "One or more fields are invalid.",
  "fieldErrors": { "email": ["EMAIL_INVALID"] },
  "requestId": "<uuid>"
}
```

Current codes are `VALIDATION_ERROR` (`400`), `UNAUTHENTICATED` and `INVALID_CREDENTIALS` (`401`), `UNTRUSTED_REQUEST` (`403`), `EMAIL_ALREADY_EXISTS` (`409`), `PAYLOAD_TOO_LARGE` (`413`), `UNSUPPORTED_MEDIA_TYPE` (`415`), `SERVICE_UNAVAILABLE` (`503`), `NOT_FOUND` (`404`), and `INTERNAL_ERROR` (`500`). Error logs contain request metadata and category only; they omit request bodies, cookies, authorization headers, exception messages, and database URLs.

## Automated verification

Create the three ignored files under `apps/api/test/config/` from their tracked `.example` files, fill distinct test-only credentials/auth values, and set them to mode `0600`. Then run:

```sh
pnpm --filter api lint
pnpm --filter api typecheck
pnpm --filter api test:unit
pnpm --filter api test:integration:local
pnpm --filter api build
```

`test:integration:local` uses only the fixed `trip-auth-api-test` Compose project on `127.0.0.1:55432`. It removes any previous volume for that exact test project, starts a clean database, executes migration `show/run/show`, runs the real-PostgreSQL suite, and removes the test container and volume on exit. It never targets the default development project.

Last verified locally on 2026-08-06: formatting, root lint/typecheck/build, API lint/typecheck/build, and the Web test passed; 10 API unit suites passed 48 tests; and 3 API integration suites passed 12 tests after the clean migration changed from pending to applied. The migration run did not attempt to install an extension. This is local MVP evidence, not approval for public exposure or production deployment. The Postman smoke below remains a user-run manual check and was not fabricated as automated evidence.

## Manual Postman smoke

Create a Postman environment with only `apiBaseUrl=http://localhost:3001`. Keep the API and trusted Web origin on the same `localhost` site; changing one to `127.0.0.1` changes the cookie host and Fetch Metadata relationship. Do not create a token variable: Postman should retain the HttpOnly cookie in its cookie jar.

Run these requests in order:

1. `GET {{apiBaseUrl}}/api/v1/health/live` -> `200`.
2. `GET {{apiBaseUrl}}/api/v1/health/ready` -> `200`.
3. `POST {{apiBaseUrl}}/api/v1/auth/sign-up` with headers `Content-Type: application/json`, `Origin: http://localhost:3000`, and `Sec-Fetch-Site: same-site`; body `{"email":"postman@example.com","password":"TripDemo9@Qz"}` -> `201`.
4. Confirm Postman's cookie manager contains `trip_access_dev`, without copying its value. `GET {{apiBaseUrl}}/api/v1/auth/me` -> `200` and the safe User.
5. `POST {{apiBaseUrl}}/api/v1/auth/logout` with the same three headers and body `{}` -> `204`. A following `/auth/me` request -> `401 UNAUTHENTICATED`.
6. `POST {{apiBaseUrl}}/api/v1/auth/login` with the same headers and original credentials -> `200`; `/auth/me` returns `200` again.

Focused failure checks:

- Repeat sign-up -> `409 EMAIL_ALREADY_EXISTS`.
- Wrong password and an unknown email -> identical `401 INVALID_CREDENTIALS` public shapes.
- Add an unexpected `role` field -> `400 VALIDATION_ERROR`.
- Remove `Origin` and `Referer` -> `403 UNTRUSTED_REQUEST`.
- Change `Content-Type` to `text/plain` -> `415 UNSUPPORTED_MEDIA_TYPE`.
- Send JSON larger than the configured body limit -> `413 PAYLOAD_TOO_LARGE`.

Delete the Postman cookie when finished. Never paste cookie/JWT values into screenshots, tickets, logs, or documentation.

## Migration repair and rollback

The first forward migration creates `app.users`, its canonical-email constraints, and only `SELECT`/`INSERT` runtime grants. Its `down` drops the table and is destructive; use it only against disposable local/test data. Shared or production repair must use a reviewed forward migration and a separately approved deployment plan. Application startup and the runtime role never create roles, schemas, or extensions.
