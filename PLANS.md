# Development Plan: Monorepo Foundation and Authentication Vertical Slice

Status: **decisions D-01 through D-25 confirmed; first-slice implementation authorized on 2026-08-02; P-03, F-01 through F-05, and W-01 are complete locally; ISSUE-009 and ISSUE-010 remain in the dependency-eligible wave**\
Plan date: 2026-07-30  
Implementation authorization date: 2026-08-02\
Scope source: project directories, Sign Up/Login, Navigation, User table, and Auth API requested by the user  
Authorization history: the original planning round created documentation only. A 2026-07-30 request separately authorized remote creation of `ISSUE-001` through `ISSUE-027` plus their labels, milestone, assignment, and native dependencies. On 2026-08-02, the owner explicitly authorized the planned first local authentication slice, including code and scaffolding, dependencies and the root lockfile, hooks, MIT license governance, first-slice GitHub CI/governance configuration, migrations, local PostgreSQL/pgvector infrastructure, and synchronized documentation/status updates. On 2026-08-03, the owner explicitly authorized D-25 and the isolated Next.js/MUI/TypeORM baseline change. On 2026-08-05, the owner clarified that F-05 proves a clean migration-shaped transactional DDL probe and direct TCP/SCRAM runtime-role behavior with `psql`; B-01 owns the actual NestJS/TypeORM connection and readiness, and B-02 owns the first real application migration.

Authorization exclusions: post-MVP work, production deployment, CD activation, cloud resources, public exposure, repository visibility changes, remote creation of `ISSUE-028` onward, and remote update/closure of any GitHub issue still require separate explicit authorization.

Current repository state: `Donny-Guo/trip_full_stack_repo` is public. The root pnpm/Turborepo workspace, one pnpm lockfile, editor/ignore conventions, local-only task graph, and minimal independently buildable `apps/web` and `apps/api` scaffolds now exist. One root Prettier 3.9.6 policy and standardized root checks are active; narrow shared strict TypeScript and typed ESLint packages are consumed by both applications. The Web scaffold runs Next.js 16.2.12 with React 19.2.8, an exact MUI v9 App Router SSR/CSS-variable theme foundation, and one Vitest/React Testing Library render regression. The API scaffold runs NestJS 11.1.28 with strict ES2023 TypeScript, Jest/Supertest entry points, a process-only `GET /api/v1/health/live` endpoint, and graceful shutdown hooks. Digest-pinned local PostgreSQL 18.4/pgvector 0.8.5 infrastructure now provides a loopback-only healthy service, a named volume, atomic privileged bootstrap, and separated provisioner/migrator/runtime roles. App-specific Next.js, Node, Jest, and Vitest concerns remain local. TypeORM, CI automation, hooks, application migrations, authentication, and business code do not exist yet. A tracked root MIT `LICENSE` predates this authorization; its current notice awaits F-08 alignment with D-23.

Simplified Chinese translation: [`PLANS_ZH.md`](./PLANS_ZH.md). This English plan is authoritative.

## 1. Objective for the first implementation slice

Deliver a testable vertical slice in which developers run Web/API on the host through the pnpm monorepo, start PostgreSQL + pgvector as local containerized infrastructure, and complete this user journey: register, receive real API success feedback, remain authenticated, log in again with the same credentials, and navigate the extensible application shell.

“Production-oriented” means the first slice has correct boundaries, authoritative validation, secure password storage, reviewable migrations, stable error contracts, and automated tests. It does not mean every later platform capability is implemented at once.

This slice is a milestone spanning multiple independently reviewable change sets. “First slice” is sequencing language, not a one-calendar-day delivery commitment.

## 2. Expected user journey

1. An unauthenticated user opens Sign Up.
2. The form immediately reports missing values, invalid email format, password length, missing password categories, and unsupported characters through an accessible requirements checklist and field feedback.
3. A valid form is submitted to NestJS, which repeats all validation as the authority.
4. The API creates a User under database uniqueness protection and stores only a password hash.
5. The `201` response sets a short-lived access-JWT HttpOnly cookie, presents real success feedback, and automatically enters Dashboard.
6. The page restores the session through `/auth/me`; unauthenticated users cannot access protected application routes.
7. Logout clears the cookie and returns the user to Login.
8. Login returns one stable invalid-credentials response for an unknown email or wrong password; a successful login resets the cookie and opens Dashboard.
9. Navigation reaches Dashboard, Flight Info, and User.

## 3. Scope

### Required in the first slice

- Root pnpm workspace with `apps/web` and `apps/api` project directories.
- Next.js 16 App Router + TypeScript + MUI v9 foundation.
- NestJS modular API foundation, configuration validation, and PostgreSQL connection.
- First `users` migration.
- `UsersModule` and `AuthModule`.
- `POST /api/v1/auth/sign-up` and `POST /api/v1/auth/login`.
- Minimal access JWT in a same-origin HttpOnly cookie, `GET /auth/me`, `POST /auth/logout`, and protected routes.
- Complete Sign Up and Login request states.
- Extensible, responsive, accessible navigation.
- Minimal Dashboard, Flight Info, and User route targets.
- English first-release UI with centralized message keys, an English catalog, and locale-aware formatters.
- Unit, integration, component, and critical end-to-end tests proportional to the slice.
- Environment-variable examples, local run instructions, root pre-commit/commit-message hooks, and GitHub Actions CI quality gates.
- GitHub repository governance: protected `main`, pull-request ownership/templates, an MIT license, Dependabot, and supported security scanning.

### Explicitly out of scope for the first slice

- Travel-provider integration, search results, or booking.
- LangGraph graphs, agent tools, or LLM calls.
- Embedding models, vector generation, vector columns, or pgvector indexes. Privileged local bootstrap enables and verifies the packaged extension for environment parity, but no speculative vector schema is created.
- Refresh tokens, token rotation/server revocation, Redis, cache, queues, or distributed locks.
- Email verification, forgot/reset password, social login, MFA, account-status workflows, or RBAC.
- Simplified Chinese product copy, a language switcher, or locale URLs. Only the localization boundary is created now.
- A complete User Profile; User is only a navigation target.
- Full Swagger documentation or a generated API client.
- Production deployment, cloud resources, application images, registry publication, and activation of continuous delivery. The future GitHub CD contract is planned now but implemented only under R-09.

### Sequenced production follow-ups

These are not forgotten: a public-exposure authentication gate, refresh-token rotation/revocation, Redis-backed token/session management, email verification and recovery, account lifecycle, RBAC, Simplified Chinese, Swagger/OpenAPI client generation, application images and environment-gated GitHub delivery, operational readiness, privacy/threat modeling, vector retrieval, agent persistence/evaluation/observability, provider degradation, and cost controls. Section 8 records them as explicit backlog tasks.

## 4. Decision record

All decisions D-01 through D-25 are confirmed and authoritative. D-14 through D-19 were accepted from the independent audit; D-20 through D-24 record the user's GitHub identity, governance, CI/CD, local-hook, license, and AI-review requirements; D-25 records the owner-authorized framework/ORM major-line revision. First-slice implementation is authorized within the stated exclusions.

| ID   | Status      | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Affects                         |
| ---- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| D-01 | `CONFIRMED` | Use TypeORM with migrations only; disable `synchronize` in production                                                                                                                                                                                                                                                                                                                                                                                                                                                         | B-01 onward                     |
| D-02 | `CONFIRMED` | pnpm workspace manages dependencies; Turborepo manages task graphs and local cache; remote cache waits for a later review                                                                                                                                                                                                                                                                                                                                                                                                     | F-01 onward                     |
| D-03 | `CONFIRMED` | The first slice uses a short-lived access JWT in a same-origin HttpOnly cookie; refresh rotation, revocation, and Redis come later                                                                                                                                                                                                                                                                                                                                                                                            | B-05, W-05, I-02, R-03          |
| D-04 | `CONFIRMED` | Unknown email and wrong password share one external `INVALID_CREDENTIALS` response                                                                                                                                                                                                                                                                                                                                                                                                                                            | B-07, W-07                      |
| D-05 | `CONFIRMED` | Successful sign-up issues the same access JWT and automatically enters Dashboard                                                                                                                                                                                                                                                                                                                                                                                                                                              | B-06, W-06, E2E-01              |
| D-06 | `CONFIRMED` | Use TypeScript LangGraph inside NestJS `AgentModule` when the first agent use case begins; Web only consumes authenticated streams; extract `apps/agent` only when independent scaling is justified; do not create an empty module in this slice                                                                                                                                                                                                                                                                              | R-12                            |
| D-07 | `CONFIRMED` | UUID primary key, physical table `users`, and trim + lowercase normalized unique email                                                                                                                                                                                                                                                                                                                                                                                                                                        | B-02 onward                     |
| D-08 | `CONFIRMED` | Initial password policy: 8–20 ASCII characters, allowed set `A-Z`, `a-z`, `0-9`, and `$#@%`, with at least one uppercase, lowercase, digit, and `$#@%` character; never trim; retain common/compromised-password rejection and benchmarked Argon2id                                                                                                                                                                                                                                                                           | B-04, B-06, W-04, R-13          |
| D-09 | `CONFIRMED` | Next.js and NestJS deploy independently; the browser uses one public origin and `/api/v1` through a gateway to NestJS                                                                                                                                                                                                                                                                                                                                                                                                         | F-05, B-05, W-05                |
| D-10 | `CONFIRMED` | First product UI is English with centralized messages from day one; add at least `zh-CN` later; no first-slice switcher or locale URL                                                                                                                                                                                                                                                                                                                                                                                         | W-02 onward, R-08               |
| D-11 | `CONFIRMED` | The first migration excludes email verification, account status, and roles; introduce them through sequenced forward migrations                                                                                                                                                                                                                                                                                                                                                                                               | B-02 onward, R-04/R-06/R-07     |
| D-12 | `CONFIRMED` | Local inner loop runs Next.js/NestJS on the host; PostgreSQL + pgvector and later stateful dependencies are containerized; application images follow after the slice is stable                                                                                                                                                                                                                                                                                                                                                | F-02, F-03, F-05, R-09          |
| D-13 | `CONFIRMED` | Unsuffixed project documents are authoritative English; matching `_ZH.md` files are synchronized Simplified Chinese followers; English wins on conflict                                                                                                                                                                                                                                                                                                                                                                       | All documentation tasks         |
| D-14 | `CONFIRMED` | First-slice JWT/cookie profile: `HS256`, at least 256-bit managed secret, 15-minute TTL, User UUID `sub`, `iss=trip-api`, `aud=trip-web`, required `iat`/`exp`, at most 30-second clock tolerance; production cookie `__Host-trip_access`, `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, no `Domain`, `Max-Age=900`; local HTTP uses `trip_access_dev` for 900 seconds; logout uses `Max-Age=0` with the matching tuple                                                                                                     | B-05, B-08, W-05, I-02          |
| D-15 | `CONFIRMED` | Browser-only unsafe auth requests are JSON-only and require exact trusted Origin with same-origin Referer fallback; missing/`null` provenance is rejected. This is the narrow first-slice CSRF baseline; add a token before the first protected business mutation or any broader topology                                                                                                                                                                                                                                     | B-05 through B-10, I-01/I-02    |
| D-16 | `CONFIRMED` | Authenticated/user-specific responses and Next server auth fetches are `no-store`; gateways never cache `Set-Cookie` or private responses                                                                                                                                                                                                                                                                                                                                                                                     | B-05, B-08, W-05, I-01/I-02     |
| D-17 | `CONFIRMED` | First-slice email storage is canonical trimmed, lowercased ASCII, maximum 254 characters, protected by a database canonical-form check plus uniqueness; internationalized email requires a later policy                                                                                                                                                                                                                                                                                                                       | B-02, B-03, B-06/B-07           |
| D-18 | `CONFIRMED` | Database provisioner, migrator, and runtime roles are separate; privileged bootstrap owns extension enablement; migrations are an explicit job, never automatic application startup work                                                                                                                                                                                                                                                                                                                                      | F-05, B-01, B-02, R-09          |
| D-19 | `CONFIRMED` | Completing the local slice does not authorize public exposure; the release gate requires R-02, R-09, and R-10 plus renewed security/operations approval                                                                                                                                                                                                                                                                                                                                                                       | Q-01, H-01, R-02/R-09/R-10/R-14 |
| D-20 | `CONFIRMED` | GitHub is the source-control and automation platform. The public repository is owned by `@Donny-Guo`. `main` is pull-request-only with stable required CI, resolved conversations, linear history, squash merge by default, and no force push/deletion. During bootstrap, approval requirements remain satisfiable without a general check bypass; require at least one non-author owned-path approval whenever eligible reviewers are available                                                                              | F-06, F-08, Q-01                |
| D-21 | `CONFIRMED` | Root Husky hooks use lint-staged formatting/linting for staged files and commitlint Conventional Commits at `commit-msg`; CI is authoritative, validates the squash pull-request title, and keeps network/database/build/full-suite work out of pre-commit                                                                                                                                                                                                                                                                    | F-04, F-07, F-08                |
| D-22 | `CONFIRMED` | GitHub CD is gated by R-09 and an approved target: build once from trusted code, attest and publish immutable Web/API image digests, promote the same digests through protected `staging`/`production` Environments using OIDC, require production approval without self-review, serialize deployments, and support rollback; pull-request code receives no deployment secrets                                                                                                                                                | R-09, R-14                      |
| D-23 | `CONFIRMED` | The repository owner and initial `CODEOWNERS` identity is `@Donny-Guo`. MIT is the confirmed open-source license choice; the standard root license uses `Copyright (c) 2026 Donny-Guo`, requires explicit owner authorization, and does not require per-file license headers. F-08 verifies and maintains the artifact                                                                                                                                                                                                        | F-08, documentation             |
| D-24 | `CONFIRMED` | At most one advisory AI reviewer may be enabled initially. Manually request review only after Ready for Review, green deterministic CI, and self-review. Evaluate it on three representative risk-bearing pull requests, with no automatic draft/every-push review, no overlapping reviewer, and no merge-gating authority; record useful findings, false positives, misses, and latency before revising the policy. Provider and account details are not recorded in the public repository                                   | F-08, Q-01                      |
| D-25 | `CONFIRMED` | Supersede the original Web/ORM version constraint with the current stable Next.js 16, MUI v9, and TypeORM lines while retaining React 19, PostgreSQL 18, and the approved test families. The 2026-08-03 exact baseline is Next.js 16.2.12, MUI Material/Icons 9.2.0 with `@mui/material-nextjs` 9.1.1, and TypeORM 1.1.0. Installed dependencies move now; not-yet-owned dependencies use these pins when their task begins. Keep exact stable pins, isolate upgrades, and require explicit approval for another major change | P-03, F-02, W-01, B-01          |

### Password-policy change contract

The selected 8–20 composition policy is intentionally isolated so it can evolve without a data-model migration:

- One server-side `PasswordPolicy` is the authority for creating or replacing a password. Web mirrors its intent for immediate feedback but does not define security.
- Login verifies the submitted password against the stored hash and does not apply current sign-up length, character, or composition rules.
- Relaxing the policy later changes the policy boundary, client messages, API contract documentation, and boundary tests. Existing hashes and the `users` table remain valid.
- Tightening a later policy affects new/reset passwords only by default. Existing users are not silently locked out or forced to rotate without a separately reviewed re-enrollment plan.
- Because hashes cannot reveal whether an existing password satisfies a new rule, there is no reliable “migrate every old password” shortcut.

## 5. Target architecture and dependency direction

```text
Browser: https://trip.example.com
  |
  v
apps/web (Next.js + MUI)
  |  same-origin /api/v1; Gateway/Ingress routes to API; generated client later
  v
apps/api (NestJS)
  |-- AuthModule --> UsersModule --> Repository --> PostgreSQL
  `-- AgentModule --> LangGraph --> travel tool adapters (created later with first use case)
                                         |
                                         `--> external travel providers (later)

Redis (later) supports cache, rate limiting, and short-lived coordination; it is not User storage.
The local image is pgvector-capable; privileged bootstrap enables and verifies the extension. Production enablement is infrastructure-owned and happens only before an approved vector migration. No vector columns are created before model and retrieval requirements exist.
```

Web never connects directly to data stores or the internal agent runtime. Controllers do not manipulate ORM entities directly. Auth reaches credentials through a narrow Users boundary. Agent tools call application services. Next.js and NestJS share a public origin but keep independent build, scale, deployment, and rollback lifecycles.

### 5.1 Local runtime topology

```text
Host (pnpm + Turborepo)
  |-- Next.js dev server -- /api/v1 proxy --> NestJS dev server
  `-- test / lint / typecheck / build

Docker Compose (local infrastructure only)
  `-- PostgreSQL + pgvector
      |-- health check
      |-- provisioner, migrator, and runtime development roles
      |-- privileged extension enablement/verification
      `-- named development volume

Add later as needed: Redis and a mail-capture service.
Add Web/API images only after the local vertical slice is stable.
```

This preserves fast application feedback while making stateful dependencies repeatable. CI uses an ephemeral database service rather than a developer volume. Production application containers are stateless and preferably use managed PostgreSQL/Redis.

## 6. API contract draft

### 6.1 Common error shape

| Field         | Type                                 | Purpose                                                         |
| ------------- | ------------------------------------ | --------------------------------------------------------------- |
| `code`        | string                               | Stable machine-readable error code                              |
| `message`     | string                               | Safe English fallback for diagnostics and non-localized clients |
| `fieldErrors` | `Record<string, string[]>`, optional | Field name to one or more stable machine-readable error codes   |
| `requestId`   | string                               | Troubleshooting correlation                                     |

The Web localizes `code` and `fieldErrors` through its catalog; API prose is not the localization contract. Never expose ORM errors, stack traces, SQL, password values/hashes, or internal account state. Validation errors must not echo rejected password input.

### 6.2 Sign-up

| Item       | Draft contract                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Endpoint   | `POST /api/v1/auth/sign-up`                                                                                                                             |
| Request    | `email`, `password`                                                                                                                                     |
| Success    | `201 Created`; set access-JWT HttpOnly cookie; return `messageCode: AUTH_SIGN_UP_SUCCEEDED` and safe User summary `{ id, email, createdAt, updatedAt }` |
| Validation | `400 VALIDATION_ERROR` with field errors                                                                                                                |
| Duplicate  | `409 EMAIL_ALREADY_EXISTS`; database uniqueness is the final guard                                                                                      |

### 6.3 Login

| Item                | Draft contract                                                                                           |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| Endpoint            | `POST /api/v1/auth/login`                                                                                |
| Request             | `email`, `password`                                                                                      |
| Success             | `200 OK`; set access-JWT HttpOnly cookie; return safe User summary `{ id, email, createdAt, updatedAt }` |
| Validation          | `400 VALIDATION_ERROR` for missing/malformed transport input only                                        |
| Invalid credentials | `401 INVALID_CREDENTIALS`; unknown email and wrong password are identical externally                     |

Login must not reject an existing user's password because it no longer matches the current sign-up policy.

### 6.4 Current session and logout

| Endpoint                   | Success                                                   | Failure/notes                                                  |
| -------------------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| `GET /api/v1/auth/me`      | `200` with safe current User summary                      | Missing, invalid, or expired JWT returns `401 UNAUTHENTICATED` |
| `POST /api/v1/auth/logout` | Idempotent `204`; clear cookie whether or not it is valid | No business body; still apply Origin/CSRF checks               |

JWTs use allowlisted `HS256`, at least 256 bits of deployment-managed secret material, a 15-minute TTL, User UUID `sub`, `iss=trip-api`, `aud=trip-web`, required `iat`/`exp`, and no more than 30 seconds of clock tolerance. Production uses `__Host-trip_access` with `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, no `Domain`, and `Max-Age=900`; local HTTP uses `trip_access_dev` with the same lifetime. Logout sends `Max-Age=0` with the same cookie tuple.

All auth endpoints accept only `application/json` when a body is present and apply an explicit small body limit. Unsafe browser methods require an exact trusted `Origin`, with same-origin `Referer` fallback; missing or `null` provenance is rejected. No state change uses `GET`. Auth and User responses carry `Cache-Control: no-store`, as do Next.js server-side session fetches. A CSRF token becomes mandatory before the first protected business mutation or any deployment that no longer meets the narrow same-origin assumptions.

### 6.5 Input rules

| Field                            | Client feedback                                               | Server authority                                                                                                                     | Notes                                                                                                  |
| -------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| email                            | Required, trim, ASCII email structure, maximum 254 characters | Trim + lowercase canonicalization before lookup/write; database check + uniqueness enforce stored form                               | Internationalized email is a later explicit policy; do not invent a regex that attempts all RFC syntax |
| password on sign-up/reset/change | Required; 8–20; show category/allowed-character checklist     | Enforce `A-Z`, `a-z`, `0-9`, `$#@%` only; at least one of each category; whole-password blocklist; never trim                        | Paste and password managers remain enabled                                                             |
| password on login                | Required and no more than 1,024 transport bytes               | Verify exact submitted value against stored hash; do not apply current creation policy; unknown users take the fixed dummy-hash path | Preserves compatibility while bounding resource use and reducing timing enumeration                    |
| unknown fields                   | Do not send                                                   | Reject                                                                                                                               | Prevent mass assignment                                                                                |

Web and API can share rule intent and error codes, but the server cannot trust the client. Do not import Nest runtime DTOs into Web merely to “share types.”

## 7. User table draft

Use physical table name `users` to avoid ambiguity with PostgreSQL `USER` semantics.

| Column          | Draft type   | Constraint/index                                               | API visibility |
| --------------- | ------------ | -------------------------------------------------------------- | -------------- |
| `id`            | uuid         | Primary key, database generated                                | Visible        |
| `email`         | varchar(254) | NOT NULL; CHECK canonical trimmed lowercase ASCII form; UNIQUE | Visible        |
| `password_hash` | text         | NOT NULL                                                       | Never returned |
| `created_at`    | timestamptz  | NOT NULL, database default                                     | Visible        |
| `updated_at`    | timestamptz  | NOT NULL, one consistent update strategy                       | Visible        |

Migration acceptance: forward migration works on an empty database under the migration role; direct noncanonical writes and concurrent duplicate normalized emails are database-rejected; the runtime role cannot perform DDL; repair/down guidance exists; tests prove `password_hash` never serializes to the API. Password-policy changes do not require a column or data migration.

## 8. Executable task breakdown

Implementation-ready issue packaging, ordering, review criteria, and required evidence are maintained in [`ISSUES.md`](./ISSUES.md). This plan remains authoritative if the documents ever disagree.

Status legend: decision `CONFIRMED` is authoritative. Task `TODO` is not started; `BLOCKED` waits on an external decision or authorization; `DONE` is evidenced complete; `TODO (later)` is registered backlog outside the first-slice authority; `BLOCKED (later)` is a later gate waiting on both prerequisites and explicit authorization.

### Phase 0 — Review and implementation gate

#### P-01 Close product/architecture and audit review — `DONE`

- Owner: Product + Tech Lead
- Prerequisite: none
- Action: record the accepted independent security/operations audit defaults D-14 through D-19 and the confirmed GitHub identity, governance, CI/CD, hook, MIT-license, and advisory AI-review decisions D-20 through D-24 while retaining the explicit first-slice non-goals.
- Output: authoritative English `PLANS.md` and synchronized `PLANS_ZH.md` follower.
- Acceptance: satisfied on 2026-07-30—the user explicitly accepted D-14 through D-19, required GitHub governance, CI/CD planning, and pre-commit standards, then confirmed `@Donny-Guo`, MIT licensing, and the manual non-blocking advisory AI-review policy; all decisions have one answer; no planning statement is presented as implemented behavior.

#### P-02 Authorize implementation — `DONE`

- Prerequisite: P-01
- Action: obtain an explicit user instruction to start implementation. Review feedback and planning edits do not count as authorization.
- Output: the owner's unambiguous 2026-08-02 implementation-start instruction.
- Acceptance: satisfied on 2026-08-02—the owner explicitly authorized the planned first local authentication slice, covering code, scaffolding, dependencies and the root lockfile, hooks, MIT license governance, first-slice GitHub CI/governance configuration, migrations, local PostgreSQL/pgvector infrastructure, and synchronized documentation/status updates. Post-MVP work, production deployment/CD, cloud resources, public exposure, repository visibility changes, remote creation of `ISSUE-028` onward, and remote update/closure of any GitHub issue remain excluded.

#### P-03 Freeze a compatible version matrix — `DONE`

- Prerequisite: P-02
- Confirmed owner constraints: the 2026-08-02 baseline retained Next.js 15, MUI v6, and TypeORM 0.3.31. D-25 explicitly superseded those three selections on 2026-08-03 with the current stable Next.js 16, MUI v9, and TypeORM lines. PostgreSQL 18 and the Jest/Supertest, Vitest/React Testing Library, and Playwright families remain unchanged. Do not silently replace these majors or test families; another major change requires explicit approval.
- Action: maintain an exact compatible baseline from primary sources for Node.js LTS, pnpm, TypeScript, Turborepo, Next.js 16, React/React DOM, MUI v9 and its official Next/Emotion integration, NestJS and its CLI/adapter packages, TypeORM 1.1, the PostgreSQL driver, PostgreSQL 18, pgvector, Argon2, ESLint, Prettier, Jest/Supertest, Vitest/React Testing Library, Playwright, Husky, lint-staged, and commitlint. Select a versioned standard GitHub-hosted Ubuntu runner (evaluate `ubuntu-24.04`, not a floating `-latest` or preview label), record Debian-slim/Alpine application-image candidates for later benchmark, define exact pin/range and upgrade/rollback policy, and create an initial full-SHA Action reference register with readable version comments.
- Output: `.node-version` plus authoritative `docs/toolchain.md` and its `docs/toolchain_ZH.md` follower. The toolchain document contains one matrix with exact selections, compatibility/support state, primary-source links and check dates, pin/enforcement locations, update owner/cadence, rollback target, downstream verification task, and the initial immutable Action reference register.
- Acceptance: the exact Node and pnpm selections are recorded and `.node-version` matches the matrix; no floating `latest`, canary, preview, prerelease, or mutable Action reference is selected; the D-25 Next.js 16/MUI v9/TypeORM 1.1 choices are explicit; compatibility evidence covers MUI/Next SSR, NestJS/TypeORM/PostgreSQL, pgvector, native Argon2, and the supported runtime intersection; every pin names an owner, rollback, and downstream enforcement task. F-01 implements root `packageManager`/engine constraints, F-02 proves the installed Next line, F-05 pins and verifies the database image, B-04 proves Argon2 runtime behavior, W-01 proves MUI SSR, and F-06/F-08 prove CI parity and the complete Action register; P-03 does not claim downstream checks that do not exist.
- Completion evidence: on 2026-08-02, `.node-version`, [`docs/toolchain.md`](./docs/toolchain.md), and its synchronized follower established the original exact matrix, policy, rollback classes, candidate images, full-SHA Action register, and downstream enforcement map. D-25 amended the Next.js/MUI/TypeORM rows on 2026-08-03 from current primary sources and publisher metadata. F-01 supplies root installation, lockfile, and task-graph evidence; F-02 supplies Next.js 16 installation/build/runtime evidence; W-01 supplied MUI v9 installation, SSR, hydration, navigation, and render-test evidence on 2026-08-05. F-05 supplied the exact database-image digest plus PostgreSQL/pgvector bootstrap, version, persistence, and role-boundary evidence on 2026-08-05; TypeORM integration remains assigned to B-01.

### Phase 1 — Monorepo and local environment

#### F-01 Create the pnpm monorepo root — `DONE`

- Prerequisite: P-02, P-03
- Action: add workspace definitions, root scripts, package-manager constraints, shared ignore/editor conventions, a root `prepare` boundary for later Husky setup, and a Turbo task graph with local cache only.
- Output: a root workspace that discovers `apps/*` and `packages/*`.
- Acceptance: one root lockfile; internal packages use workspace protocol; root tasks discover applications; Turbo dependencies/outputs are correct; remote cache is disabled.
- Completion evidence (2026-08-02): `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.editorconfig`, `.gitignore`, and the single `pnpm-lock.yaml` implement the exact Node 24.18.0, pnpm 11.18.0, Turborepo 2.10.8, and TypeScript 5.9.3 selections; root tasks and the reserved no-op `prepare` boundary; `apps/*`/`packages/*` discovery; strict engines, exact dependency saving, and workspace-protocol saving; declared build outputs; uncached formatting; and explicitly disabled remote cache. A frozen install succeeded in a disposable fresh candidate tree assembled from committed HEAD plus this change. The dry graph and all five root commands succeeded with zero package tasks, as expected before application scaffolding. A disposable two-package fixture additionally proved both workspace globs, `workspace:*` resolution, dependency ordering, declared-output restoration from local cache, and format cache bypass. No npm/yarn lockfile or secret-bearing/remote cache configuration was found.

#### F-02 Create the Next.js project directory — `DONE`

- Prerequisite: F-01
- Action: create `apps/web` with TypeScript, App Router, `src/`, strict checking, and host-run pnpm/Turbo development. Do not add unapproved Tailwind.
- Output: minimal buildable Web application.
- Acceptance: dev start, typecheck, lint, and production build succeed; template leftovers and unused dependencies are removed.
- Completion evidence (2026-08-03): `apps/web` is a minimal App Router/`src` TypeScript package with strict checking, no Tailwind, no fake business behavior, and no client-exposed API configuration. D-25 upgraded the installed framework from 15.5.22 to exact `next@16.2.12`/`eslint-config-next@16.2.12`, removed the direct legacy `FlatCompat` dependency, adopted Next's native flat configs, and accepted Next-generated `react-jsx` plus development route types. `pnpm install`, Web lint, route type generation, strict TypeScript, the Turbopack production build, and a production `GET /` smoke check returning `200` with `Trip Agent` all passed. F-02 generated no Web test; W-01 later added app-local Vitest tooling and one render regression, while later component/E2E tasks own further coverage.

#### F-03 Create the NestJS project directory — `DONE`

- Prerequisite: F-01
- Action: create `apps/api`, `/api/v1`, domain-module layout, test entry point, strict TypeScript, host-run pnpm/Turbo development, a process-only liveness endpoint, and graceful shutdown hooks. Do not create an empty `AgentModule`.
- Output: minimal startable API.
- Acceptance: start, typecheck, lint, tests, and production build succeed; default example controller is replaced by an intentional health entry or removed.
- Completion evidence (2026-08-03): `apps/api` is an independently buildable NestJS 11.1.28 package with strict ES2023 TypeScript, native type-aware ESLint, the `/api/v1` prefix, an intentional `HealthModule`, process-only `GET /api/v1/health/live`, and shutdown hooks. API lint, typecheck, one unit test, two Supertest HTTP assertions, the combined test entry, and production build passed. Root format, lint, typecheck, test, build, and frozen install passed. Development and compiled production starts returned `200` with `{"status":"ok"}`, the removed starter root returned `404`, and each process stopped after one interrupt without hanging. The package contains no ORM, readiness, authentication, UsersModule, AgentModule, Redis, Swagger, provider integration, nested lockfile, or starter README.

#### F-04 Create shared engineering configuration — `DONE`

- Prerequisite: F-01, F-02, F-03
- Action: extract genuinely shared TypeScript/ESLint configuration, establish one Prettier formatting policy, and standardize `format`, `format:check`, `lint`, `typecheck`, `test`, and `build` task names.
- Output: `packages/config-typescript` and `packages/config-eslint` only when reuse is real.
- Acceptance: Web/API do not carry conflicting duplicate rules; cache outputs are correct; generated and environment files are ignored.
- Completion evidence (2026-08-05): both applications consume narrow `@trip/config-typescript` and `@trip/config-eslint` packages through `workspace:*`; one exact root Prettier 3.9.6 policy and standardized `format`, `format:check`, `lint`, `typecheck`, `test`, and `build` tasks are active, while Next.js, Node, Jest, and Vitest concerns remain application-local. The exact Node/pnpm check, frozen install, formatting check, forced lint/typecheck/test/build tasks, Web render test, API unit and HTTP tests, production builds, shared-config loading, five intentional negative rule probes, ignore allow/deny matrix, lockfile/package-boundary audit, and a two-hit local-cache output-restoration run passed. Remote cache remained disabled, and no competing lockfile, deep/circular config import, speculative `test-utils`, probe residue, or hidden source/contract file was found.

#### F-05 Create local PostgreSQL/pgvector infrastructure — `DONE`

- Prerequisite: D-09, D-12, D-18, F-03
- Action: use Docker Compose for a pinned PostgreSQL + pgvector image, health check, named development volume, and distinct non-production provisioner/migrator/runtime credentials; privileged bootstrap enables `vector` and records `extversion`; add `.env.example` and ignore `.env`. Do not put Web/API in Compose yet.
- Output: repeatable local PostgreSQL + pgvector.
- Acceptance: database starts/stops independently and becomes healthy; extension availability and enablement are separately verified; on a clean database, a migration-shaped transactional DDL probe succeeds as migrator and leaves no object, while a direct TCP/SCRAM runtime connection succeeds and runtime DDL/extension work is denied; no real secret exists; Redis is absent. B-01 owns the actual NestJS/TypeORM connection and readiness, and B-02 owns the first real application migration.
- Completion evidence (2026-08-05): `infra/docker/compose.yaml` pins `pgvector/pgvector:0.8.5-pg18-trixie` to OCI index digest `sha256:9d2e61c7352b9e9f4798df5fd9a498f043f4cda1cdacc707de3d198650f4321e`, publishes PostgreSQL only on loopback, checks health, and preserves a named volume; Web/API and Redis remain host-run/absent. A clean disposable project reached healthy PostgreSQL `18.4` (`server_version_num=180004`), separately verified vector `0.8.5` availability and installation, and emitted a sanitized bootstrap record. The atomic privileged bootstrap created distinct SCRAM-backed provisioner/migrator/runtime roles, a provisioner-owned `public` vector extension, and a migrator-owned `app` schema. Fixed-output probes proved all three TCP identities, migrator-only approved application DDL with rollback, runtime and subordinate role/extension/public-schema/database/temp denials with SQLSTATE `42501`, zero persistent probe objects, password-statement failure redaction, absence of real passwords from logs/image metadata, and persistence of the same cluster across container recreation. Static shell/Compose/scope/secret checks, frozen install, formatting, local Markdown links, and forced uncached lint/typecheck/test/build all passed.

#### F-06 Add GitHub Actions pull-request CI — `TODO`

- Prerequisite: D-20, F-04, F-05
- Action: create a least-privilege workflow for `pull_request`, trusted pushes to `main`, and `merge_group` when merge queue is enabled. On the selected versioned standard GitHub-hosted Ubuntu runner, install the pinned Node/pnpm toolchain with a frozen lockfile; run format check, lint, typecheck, unit/integration tests, and builds directly through Turbo rather than inside an Alpine application image; start an ephemeral pinned PostgreSQL + pgvector service; validate Markdown links, English-primary-language rules, and decision/task/issue ID plus status parity in existing `_ZH` followers. Pin third-party Actions to full SHAs, set timeouts/concurrency cancellation, isolate untrusted caches, and emit one stable aggregate `ci-required` result even when path filters skip jobs. A lightweight runner may be evaluated only for short non-Docker documentation/metadata jobs.
- Output: `.github/workflows/ci.yml` and documented required-check names.
- Acceptance: every required result reports and failures block merge; forked pull requests run without secrets; no `pull_request_target` job executes untrusted code; untrusted artifacts/caches cannot enter trusted jobs; cache cannot hide lockfile or generated-artifact drift; no production credential or real third-party API is used.

#### F-07 Add local Git hooks and commit conventions — `TODO`

- Prerequisite: D-21, F-01, F-04
- Action: configure root Husky hooks; run lint-staged Prettier/ESLint checks only against staged files in `pre-commit`; enforce Conventional Commits with commitlint in `commit-msg`; validate the squash pull-request title in CI. Keep hooks deterministic, preserve partial staging, and exclude network calls, database work, builds, and the full test suite.
- Output: `.husky/` hooks, lint-staged and commitlint configuration, root scripts, and contributor guidance.
- Acceptance: valid staged changes and commit messages pass; formatting/lint/message failures are actionable; partially staged files are not corrupted; a documented `--no-verify` bypass is caught by CI/PR-title checks; hook installation works after a normal root pnpm install.

#### F-08 Establish GitHub repository governance and security automation — `TODO`

- Prerequisite: D-20, D-21, D-23, D-24, F-06, F-07
- Action: add `CODEOWNERS` assigning the initial sensitive paths to `@Donny-Guo`, contribution/security guidance, pull-request and issue templates, and Dependabot configuration for pnpm/npm plus GitHub Actions; verify and maintain the standard MIT `LICENSE` with `Copyright (c) 2026 Donny-Guo`. Configure the public repository's `main` ruleset for pull-request-only changes, squash/linear history, resolved conversations, stable required checks, and no force push/deletion. During bootstrap, keep approval requirements satisfiable and configure no general owner bypass for required checks; document the trigger to require one non-author owned-path approval whenever eligible reviewers are available. Enable public-repository dependency review, CodeQL/code scanning, secret scanning, and push protection after verifying current settings. If an advisory AI reviewer is enabled, request it manually only on Ready-for-Review pull requests after green deterministic CI and self-review; exclude drafts, automatic every-PR/every-push review, and docs-only/generated-only/routine dependency-update changes. Evaluate it on three representative authentication, migration, or workflow pull requests; re-review only after material risk-bearing changes. Record useful findings, false positives, misses, latency, availability, and relevant data-handling settings. Do not enable overlapping AI reviewers; a replacement requires a separate permissions/data/retention/reliability review. Do not record provider or account details in the public repository.
- Output: checked-in `.github/`, `CONTRIBUTING.md`, `SECURITY.md`, MIT `LICENSE`, repository-settings checklist, ownership matrix, bootstrap-review policy record, and advisory AI-review evaluation record.
- Acceptance: direct changes to `main` and required-check bypasses are blocked; merging requires a pull request, deterministic checks, and self-review; `CODEOWNERS` names `@Donny-Guo` for sensitive paths without causing an impossible self-approval gate; the future human-review transition has an owner and trigger; the repository is recognized as MIT-licensed with the approved notice; AI review neither counts as human approval nor blocks merge, stays within the documented evaluation scope, and has no overlapping reviewer; Dependabot covers both dependency ecosystems without automatic major-version merging; Action references remain full-SHA pinned; public-repository CodeQL/dependency/secret controls are enabled or any current limitation is recorded.

### Phase 2 — Database, Users, and Auth API

#### B-01 Add validated configuration and ORM — `TODO`

- Prerequisite: D-01, F-03, F-05
- Action: validate port, runtime and migration database URLs, proxy trust, CORS/trusted origins, request limits, and authentication settings at startup; define connection lifecycle, dependency-aware readiness, graceful shutdown, and explicit migration-job boundaries.
- Output: DatabaseModule/ConfigModule foundation.
- Acceptance: missing critical configuration fails fast with actionable output; liveness does not depend on PostgreSQL while readiness does; production `synchronize` and automatic startup migrations are off; tests inject isolated configuration.

#### B-02 Create the `users` migration — `TODO`

- Prerequisite: D-07, D-11, B-01
- Action: create the table, canonical-form email check, unique email, and timestamps from Section 7 under the migration role.
- Output: first reviewable migration.
- Acceptance: migration succeeds from an empty database; schema matches the plan; direct noncanonical email writes and concurrent duplicates are database-rejected; runtime DDL fails; forward repair/down guidance exists.

#### B-03 Implement the UsersModule persistence boundary — `TODO`

- Prerequisite: B-02
- Action: implement narrow User entity/repository/service operations and distinguish a safe User view from internal credential lookup.
- Output: create-user and lookup-by-normalized-email capabilities.
- Acceptance: ordinary queries do not select/return `password_hash`; unique conflicts map stably; repositories have real PostgreSQL integration tests.

#### B-04 Implement PasswordPolicy and PasswordHasher — `TODO`

- Prerequisite: D-08
- Action: centralize the confirmed 8–20 ASCII allowed-set and category rules; define stable error codes per failed requirement; pin a licensed, versioned, checksummed local whole-password blocklist with documented provenance/update/failure policy; wrap Argon2id hash/verify; benchmark parameters and bound concurrent cost. Never call a remote password-check service with the candidate or a derived hash.
- Output: independently testable `PasswordPolicy` and `PasswordHasher` boundaries.
- Acceptance: 7/8/20/21 boundaries are tested; each missing category is tested; exhaustive printable-ASCII complement plus whitespace and Unicode cases prove unsupported input is rejected; paste input is unchanged; common passwords fail; the same password produces different salted hashes; correct/incorrect verification works; plaintext/hash never enter logs; algorithm, benchmark, rehash, and future policy-change behavior are documented.

#### B-05 Create the minimal access-JWT session boundary — `TODO`

- Prerequisite: D-03, D-09, D-14, D-15, D-16, B-01
- Action: create TokenIssuer, JWT guard, cookie adapter, and unsafe-request provenance guard; implement the exact Section 6 JWT/cookie profile, JSON-only/body-limit policy, trusted Origin/Referer rules, Fetch Metadata defense in depth, no-store headers, and secret/rotation configuration boundary.
- Output: one issuance/verification capability reused by sign-up and login.
- Acceptance: only expected algorithm/claims pass; set/delete cookie attributes match in production and local profiles; missing or weak secret fails startup; unsafe requests with untrusted/missing provenance, unsupported content type, or oversized body fail safely; auth responses are no-store; token never enters a response body, Web Storage, cache, or logs.

#### B-06 Implement sign-up and automatic login API — `TODO`

- Prerequisite: D-05, B-03, B-04, B-05, B-09
- Action: create DTO, global validation, canonical email normalization, password-policy checks, hashing, and User creation; map validation/blocklist/duplicate errors; reuse TokenIssuer on success and return the frozen safe User plus `messageCode` contract.
- Output: `POST /api/v1/auth/sign-up`.
- Acceptance: success returns `201` and a real session; empty/format/length/category/unsupported-character/common-password/unknown-field cases return safe, actionable `400`; duplicate returns `409`; responses/logs contain no password, hash, or token; one concurrent duplicate registration succeeds.

#### B-07 Implement login API — `TODO`

- Prerequisite: D-04, B-03, B-04, B-05, B-09
- Action: validate transport shape and 1,024-byte password transport cap, normalize email, verify exact password input against the stored hash without applying sign-up policy, perform one verification against a fixed dummy Argon2id hash for an unknown account, keep both paths externally equivalent, and set the access cookie on success.
- Output: `POST /api/v1/auth/login`.
- Acceptance: valid existing credentials work even if a later creation policy changes; unknown email and wrong password execute comparable verification paths and return structurally identical `401 INVALID_CREDENTIALS`; tests do not assert brittle wall-clock equality; missing fields/oversized transport input return `400`; no sensitive field is exposed.

#### B-08 Implement current user, logout, and authorization protection — `TODO`

- Prerequisite: B-03, B-05, B-09
- Action: implement `/auth/me`, idempotent logout, exact cookie deletion, reusable JWT guard, and no-store private responses.
- Output: `GET /api/v1/auth/me`, `POST /api/v1/auth/logout`, and a common protection boundary.
- Acceptance: valid token returns a safe User; missing/invalid/expired token returns `401`; logout clears cookie; NestJS is final authorization authority; tests document the first slice's lack of active revocation.

#### B-09 Standardize exceptions and request correlation — `TODO`

- Prerequisite: F-03; complete before B-06 and B-07
- Action: freeze stable success/error codes; define `fieldErrors` as arrays of codes, safe English fallback messages, safe User serialization, a global exception filter, request ID, log redaction, JSON content-type/body-size handling, and no-store response policy; separate safe public errors from internal diagnostics.
- Output: implementation of the Section 6 error shape.
- Acceptance: expected errors are stable and can carry multiple field failures; Web need not parse prose; password input is never echoed; unknown errors leak no internals; logs correlate through request ID; auth/private cache headers are testable.

#### B-10 Add API automation — `TODO`

- Prerequisite: B-06, B-07, B-08, B-09
- Action: cover DTO/email normalization/password-policy/Argon2id/JWT units, repository + PostgreSQL integration, and registration/login/session API E2E.
- Output: isolated repeatable API suite.
- Acceptance: covers success, empty values, invalid/noncanonical email, 7/8/20/21 password bounds, each missing category, allowed characters, printable-ASCII complement, whitespace/Unicode rejection, pinned blocklist behavior, unknown fields/content types/oversized bodies, duplicate/concurrent registration, cookie set/delete attributes, trusted/untrusted/missing Origin and Referer behavior, no-store headers, JWT claims/expiry, auto-login, restore, logout, invalid token, dummy-hash unknown-user path, wrong password, old-policy login compatibility, database role boundaries, and sensitive-field/log leakage; order independent.

### Phase 3 — Web foundation and navigation

#### W-01 Integrate MUI v9 with App Router SSR — `DONE`

- Prerequisite: F-02
- Action: add exact `@mui/material@9.2.0`, `@mui/icons-material@9.2.0`, `@mui/material-nextjs@9.1.1`, and approved Emotion pins; configure `AppRouterCacheProvider` from `v16-appRouter`, ThemeProvider, fonts, and CSS-variable strategy. Use a local client wrapper when a MUI `component` prop receives `next/link` under the Next.js 16 boundary.
- Output: stable root layout and theme.
- Acceptance: development and production render without hydration/style warnings; tokens apply; no second component system is introduced.
- Completion evidence: on 2026-08-05, exact MUI/Emotion and required Web render-test pins were installed in the root lockfile. The root layout uses `AppRouterCacheProvider` from `v16-appRouter`, one client `ThemeProvider`/`CssBaseline` boundary, MUI CSS variables, and self-hosted Roboto through `next/font`. The minimal Server Component page consumes theme spacing and palette tokens. Frozen install, the Web render test, root lint/typecheck/test/build, production SSR style placement (three Emotion style elements in `head`, none in `body`), and two repeated client-navigation cycles passed with stable style counts and no relevant browser console errors. No custom palette, second UI system, auth forms, or product navigation was added.

#### W-02 Create route groups and application shell — `TODO`

- Prerequisite: W-01
- Action: create `(auth)` and `(app)` route groups; exclude Navigation from auth pages; share App Shell across protected pages; add stable message keys, English catalog, and locale formatters.
- Output: Login, Sign Up, Dashboard, Flight Info, and User route targets.
- Acceptance: route-group names are absent from URLs; direct/refresh navigation works; loading/error/404 boundaries are clear; `html lang` matches English; another catalog would not require component restructuring.

#### W-03 Implement extensible Navigation — `TODO`

- Prerequisite: D-10, W-02
- Action: use MUI AppBar/Toolbar with semantic links and Drawer/Menu on narrow screens; use typed configuration and message keys.
- Output: Dashboard, Flight Info, and User navigation.
- Acceptance: current route is visible; mouse/keyboard/touch work; mobile does not overflow; refresh routes correctly; future permissions and feature flags can filter configuration.

#### W-04 Create form-validation and API-access boundaries — `TODO`

- Prerequisite: D-08, D-16, W-01, B-09, and the approved Section 6 contract
- Action: select a form/schema approach; centralize browser-relative `/api/v1`, server-only internal API origin, timeout, credentials, and code-based error mapping; mirror PasswordPolicy intent through structured constraints rather than scattered regexes; preserve paste/autofill.
- Output: Auth form foundation and typed API adapter.
- Acceptance: components do not concatenate URLs or parse API prose; internal origins cannot enter client bundles; client feedback matches server intent while server remains authoritative; a concise password checklist covers length/uppercase/lowercase/digit/`$#@%`; network, timeout, parsing, and multiple server field codes remain distinct; all copy comes from the catalog.

#### W-05 Restore sessions, log out, and protect routes — `TODO`

- Prerequisite: D-03, D-09, D-16, B-08, W-02
- Action: protect the `(app)` group in a server-side layout; call same-origin `/auth/me` through the server-only internal API origin with the incoming cookie forwarded and explicit no-store behavior; implement logout and sanitize relative return paths; keep the NestJS guard as final authority.
- Output: real authenticated App Shell access control available to the auth forms.
- Acceptance: unauthenticated users cannot access protected pages; `401` redirects to Login while an API outage renders a recoverable error; invalid/expired credentials do not loop; private content does not flash or enter shared caches; open redirects are rejected; browser code cannot read the token; logout clears the exact cookie tuple and client User state.

#### W-06 Implement Sign Up with automatic login — `TODO`

- Prerequisite: D-05, W-04, W-05, B-06
- Action: build email/password fields, labels, password visibility, requirements checklist, loading, duplicate-submit prevention, field errors, form alert, and real success feedback.
- Output: usable `/sign-up`.
- Acceptance: empty/invalid email and every password rule receive immediate accessible feedback; common-password and `409` server errors are clear; success enters Dashboard after the cookie is set; keyboard submit, paste, autofill, focus, and error announcement work; no password/token logging.

#### W-07 Implement Login — `TODO`

- Prerequisite: D-04, W-04, W-05, B-07
- Action: build email/password form and complete request states; map `INVALID_CREDENTIALS` to one message; do not apply sign-up composition checks to login.
- Output: usable `/login`.
- Acceptance: empty/invalid email feedback is local; unknown email and wrong password look identical; legacy passwords remain submit-able after policy evolution; requests cannot duplicate; success enters Dashboard; password/token never enters URL, logs, or persistent client state.

#### W-08 Add Web component and accessibility tests — `TODO`

- Prerequisite: W-03, W-06, W-07
- Action: test form states, password checklist, API error mapping, navigation states, message-key completeness, automated accessibility, and keyboard flows.
- Output: Web test suite and manual-check record.
- Acceptance: tests assert behavior rather than incidental implementation; no serious accessibility violations; narrow and desktop layouts are covered.

### Phase 4 — End-to-end integration and handoff

#### I-01 Integrate registration — `TODO`

- Prerequisite: B-06, W-06
- Action: exercise real Web -> Gateway `/api/v1/*` -> API -> PostgreSQL behavior, including proxy trust, exact Origin/Referer, content type/body limits, cookie/cache headers, environment configuration, error codes, normalization, and password boundaries.
- Acceptance: valid registration enters Dashboard; invalid password categories/characters, blocklisted password, duplicate email, provenance failure, and API outage follow the contract; gateway does not cache private/`Set-Cookie` responses; database has no plaintext password; Web cannot read JWT.

#### I-02 Integrate login — `TODO`

- Prerequisite: B-07, W-07, W-05
- Action: exercise successful and failed real credentials, cookie set/delete parity, redirect/session/cache behavior, dummy-hash unknown-user path, and login compatibility after a test policy change.
- Acceptance: success enters Dashboard; both invalid-credential causes are externally identical; refresh restores the no-store session; expiry returns safely to Login without loops; an API outage is not treated as `401`; return URLs remain same-origin; a stored password is not rejected by creation-policy validation.

#### E2E-01 Automate the main browser path — `TODO`

- Prerequisite: I-01, I-02, W-03
- Action: automate sign-up -> automatic Dashboard -> three navigation entries -> refresh restore -> logout -> login, plus duplicate registration, password-policy failures, wrong credentials, and unauthenticated access.
- Acceptance: isolated data; repeatable in CI; safe failure screenshots/traces without passwords.

#### Q-01 Run full quality and security review — `TODO`

- Prerequisite: F-01 through F-08, B-01 through B-10, W-01 through W-08, I-01, I-02, and E2E-01
- Action: run format, lint, typecheck, unit/integration/E2E, and production build; inspect dependencies, Action SHA pinning, workflow permissions/events/cache trust, required-check behavior, repository rules, ownership, proxy/CORS/origin behavior, cookie/cache policy, database privileges, sensitive logs, response fields, environment files, password dataset/policy boundaries, and English catalog completeness.
- Acceptance: every local and GitHub gate passes; required checks cannot remain accidentally pending after path skips; no skipped tests, mutable workflow dependency, hard-coded secret, or unexplained TODO exists; supported dependency/CodeQL/secret checks have no unresolved high-severity finding; known risks have owners; results authorize local handoff only, not public exposure.

#### H-01 Synchronize documentation and handoff — `TODO`

- Prerequisite: Q-01
- Action: update actual versions, structure, commands, environment variables, migrations, contracts, and tests in authoritative English docs; synchronize every existing `_ZH.md` follower and plan status.
- Acceptance: a new engineer can start and verify the system from English docs; Chinese followers carry matching task/decision IDs, dependencies, and status; links and English-primary checks pass; docs match runtime; the public-release gate remains visibly closed.

### Post-MVP — registered backlog, not first-slice scope

Each item begins only after the first slice is accepted. Every item requires independent review, migrations where relevant, tests, and release evidence. Listing does not authorize implementation.

#### R-01 Establish Swagger/OpenAPI and a generated client — `TODO (later)`

- Prerequisite: H-01
- Action: document REST schemas, cookie auth, error codes, and examples; generate `packages/api-client` in CI and detect drift.
- Acceptance: Web no longer duplicates response models manually; generation is reproducible; breaking changes have version/migration guidance.

#### R-02 Add the public-exposure authentication controls — `TODO (later)`

- Prerequisite: H-01; preferably R-01
- Action: add Redis-backed distributed limits for authentication and future mail endpoints, privacy-safe audit events, security headers, validated proxy trust, abuse thresholds, operator override/runbook, and explicit fail-open/fail-closed behavior for Redis outages.
- Acceptance: limits work across API replicas and cannot be bypassed through spoofed forwarded headers; audit records contain no credentials/tokens; headers and outage behavior are integration-tested; this task is mandatory before any public or shared-environment release.

#### R-03 Add refresh-token rotation and server-side revocation — `TODO (later)`

- Prerequisite: H-01 and approved session/device semantics; preferably R-01 and R-02
- Action: design short-lived access plus rotating refresh tokens, hashed server records, reuse detection, family revocation, Redis/database responsibility, key rotation, device/session boundaries, and outage behavior.
- Acceptance: logout and security events can revoke sessions; replay of an old refresh token revokes its family; cookie/CSRF rules remain explicit; TTL, concurrency, rotation, and degraded-state tests pass.

#### R-04 Add mail foundation and email verification — `TODO (later)`

- Prerequisite: R-01, R-02, and an approved mail-provider/local-capture, sender-domain, bounce, and template design
- Action: decide unverified-user permissions; add `email_verified_at`, hashed one-time random tokens, TTL, resend throttle, verify/resend APIs, templates, delivery observability, and audit events.
- Acceptance: tokens are single-use and not recoverable from storage; expired/replayed/forged tokens fail safely; responses do not disclose account existence; delivery failures are actionable; registration-to-verification automation passes.

#### R-05 Add forgot/reset password — `TODO (later)`

- Prerequisite: R-02, R-03, and the R-04 mail boundary
- Action: implement generic request responses, a hashed single-use short-TTL reset token, secure password replacement, prior-session revocation, notification mail, rate limits, and audit.
- Acceptance: unknown/existing email responses match; token is not logged/reused; new password follows the then-current PasswordPolicy; old password/sessions stop working; delivery, limit, and audit coverage exists.

#### R-06 Establish account lifecycle status — `TODO (later)`

- Prerequisite: approved business semantics and operations workflow
- Action: determine whether `active`, `suspended`, `deactivated`, and `deleted` are truly required; define transitions, login/data-retention effects, recovery, migration, domain service, guard, and audit.
- Acceptance: no ambiguous free-form status; every transition has authorization, audit, and tests; default/backfill and repair paths are explicit.

#### R-07 Establish RBAC/authorization model — `TODO (later)`

- Prerequisite: at least one approved restricted operation and role/permission use case; R-06 only if that use case depends on account status
- Action: derive role/permission/assignment data from a permission matrix; implement deny-by-default NestJS authorization, management boundaries, and Web navigation filtering.
- Acceptance: hidden navigation is not treated as security; API independently denies privilege escalation; role changes are audited; matrix, migration, and tests agree.

#### R-08 Add Simplified Chinese product localization — `TODO (later)`

- Prerequisite: stable W-02 message boundary
- Action: decide locale URL/persistence from SEO and preference needs; add `zh-CN` catalog, switcher, fallback, date/currency formatting, and translation QA.
- Acceptance: English and Simplified Chinese catalogs are complete; missing/extra keys fail CI; preference survives refresh; narrow layouts tolerate longer copy.

#### R-09 Containerize applications and establish GitHub delivery/operational readiness — `TODO (later)`

- Prerequisite: H-01; approved deployment target, registry, GitHub Environment ownership, domain/TLS topology, and RPO/RTO/SLO targets
- Action: benchmark pinned LTS Debian slim and Alpine candidates for each Web/API runtime before selecting a base: verify `glibc`/`musl`, Argon2id and other native addons, Next.js runtime artifacts, amd64/arm64 support, security-update availability, cold/warm build time, compressed size, startup, scan results, and smoke behavior. Optimize with a small `.dockerignore` context, stable layers, multi-stage output, frozen installs, filtered monorepo artifacts, `pnpm fetch` or BuildKit cache mounts, and trust-separated caches; final stages contain no build toolchain. Then, from a trusted `main`/release commit, GitHub Actions builds each non-root image once, scans it, generates an SBOM and artifact attestation/provenance, and publishes an immutable digest. Promote that exact digest through protected `staging` and `production` Environments using OIDC rather than long-lived cloud keys; automate staging and smoke checks, require an eligible production reviewer with self-review disabled, restrict deployable refs, serialize per-environment deployments, and keep migrations as an explicit least-privilege job. Define liveness/readiness, graceful termination, read-only filesystem, secret injection, proxy trust, release/rollback, PostgreSQL backup/restore exercises, log retention/redaction, SLOs, alerts, and on-call runbooks.
- Acceptance: the image decision record proves compatibility and measured benefit rather than selecting Alpine by size alone; reproducible digest-pinned images contain no development dependencies, package-manager cache, build toolchain, or secrets; pull-request code cannot access deployment credentials or trigger production; trusted releases carry verifiable digest/SBOM/provenance evidence; staging and production run the same approved digest; smoke and shutdown tests pass on supported architectures; Web/API deploy and roll back independently to a previously verified digest; production approval and concurrency rules work; OIDC trust is branch/environment scoped; migration ownership is unambiguous; a restore exercise meets approved RPO/RTO; dashboards and actionable alerts exist; production data is not stored in application containers.

#### R-10 Complete privacy, data-governance, and threat modeling — `TODO (later)`

- Prerequisite: H-01; revisit for each new external provider or sensitive data class
- Action: inventory personal/travel/payment-adjacent data, define purpose/consent, retention/deletion/export, regional/vendor constraints, log/trace redaction, prompt-injection and tool-authorization threats, incident handling, and model/provider data-use settings.
- Acceptance: data flows and trust boundaries are reviewed; each sensitive field has an owner, purpose, retention, and deletion path; providers have approved contractual/configuration posture; abuse cases and mitigations have tests or runbooks.

#### R-11 Design and validate vector retrieval — `TODO (later)`

- Prerequisite: R-10 and an approved retrieval use case, corpus, embedding model/version, privacy classification, and evaluation metric
- Action: record and approve the vector design in `PLANS.md`, covering privileged production extension provisioning, schema ownership, chunking, metadata/tenant isolation, vector dimension, distance function, index type, filtering, re-embedding/versioning, deletion, and offline retrieval evaluation.
- Acceptance: no vector schema precedes the approved design and evaluation; representative recall/latency/cost targets pass; tenant/privacy controls and delete/re-embed paths are tested; schema/index changes are migration-driven.

#### R-12 Implement the first travel-agent vertical slice — `TODO (later)`

- Prerequisite: R-10 and an approved travel use case, model provider, tool contracts, streaming security, human-approval boundary, and evaluation metrics; R-11 only if retrieval is required
- Action: create the real NestJS `AgentModule`; add explicit LangGraph State/graph/tool ports, authenticated streaming contract, safety, cancellation, timeout, bounded retries, idempotency, cost limits, and Web consumption.
- Acceptance: browser has no model key/tool authority; tools have strict schemas and authorization; deterministic graph tests, recorded provider-contract tests, prompt-injection/side-effect tests, and independent evaluations pass; service-extraction triggers are recorded.

#### R-13 Reassess and, if justified, relax password policy — `TODO (later)`

- Prerequisite: first-slice usage/support evidence or a new compliance/MFA requirement
- Action: review validation-abandonment and support data without logging passwords; consider longer maxima, broader characters, passphrases, and removing composition requirements while retaining blocklist and Argon2id; update English contract and `_ZH` follower together.
- Acceptance: one approved policy exists; sign-up/reset/change tests and messages reflect it; login compatibility tests prove existing users remain valid; no User-table migration is introduced merely for validation changes.

#### R-14 Review and authorize public exposure — `BLOCKED (later)`

- Prerequisite: Q-01, H-01, R-02, R-09, R-10, plus every feature-specific task included in the intended release
- Action: run the release threat model, external-surface scan, production configuration/secret/backup/restore review, load and abuse tests, accessibility review, observability drill, rollback rehearsal, and owner sign-off. Wait for explicit public-release authorization.
- Acceptance: all release criteria have evidence and owners; no high-severity finding is open; rollback and incident paths are rehearsed; the user explicitly approves public exposure. A local vertical-slice handoff alone cannot satisfy this task.

## 9. Recommended order and safe parallelism

```text
P-01 -> P-02 -> P-03 -> F-01
F-01 -> F-02 -----------------------> W-01 -> W-02 -> W-03
     `-> F-03 -> F-05 -> B-01 ------+-> B-02 -> B-03
           |                         `-> B-05
           `-> B-09
F-02 + F-03 -> F-04 ----------------> F-07
F-04 + F-05 ------------------------> F-06
F-06 + F-07 ------------------------> F-08

B-03 + B-04 + B-05 + B-09 ---------> B-06 and B-07
B-03 + B-05 + B-09 ----------------> B-08
W-01 + B-09 -----------------------> W-04
W-02 + B-08 -----------------------> W-05
B-06 + W-04 + W-05 ----------------> W-06 -> I-01
B-07 + W-04 + W-05 ----------------> W-07 -> I-02
W-03 + W-06 + W-07 ----------------> W-08
W-03 + I-01 + I-02 ----------------> E2E-01
F-01..F-08 + B-01..B-10 + W-01..W-08 + I/E2E -> Q-01 -> H-01
```

After the monorepo root exists, Web foundation and API/database foundation can proceed in parallel. Freeze each relevant API contract before its Web error mapping. A single owner coordinates migrations, shared configuration, primary English docs, and their `_ZH` followers to prevent merge drift.

## 10. Reviewable change sets

Preserve these review and rollback boundaries; the full list is not a one-day commitment:

1. **Foundation**: pnpm workspace, Web/API scaffolding, shared configuration, local PostgreSQL, fast local hooks, GitHub PR CI, and repository governance/security automation.
2. **Backend auth**: users migration, Users/Auth modules, PasswordPolicy/Argon2id, access JWT/cookie, `me`/logout, error contract, API tests.
3. **Web shell**: MUI SSR/theme, route groups, English message catalog, Navigation, route targets.
4. **Web auth**: form schema/checklist, Sign Up/Login, API adapter, component tests.
5. **Integration**: session restore, protected routes, E2E, bilingual documentation synchronization, quality gates.

Every set must build and test independently. Do not mix a database migration with unrelated UI work.

## 11. Acceptance matrix

| Scenario                                       | Web expectation                               | API expectation                                                | Database expectation                      |
| ---------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------- |
| Empty sign-up fields                           | Field errors; no submit                       | `400` if Web is bypassed                                       | No write                                  |
| Invalid email                                  | Field error                                   | `400 VALIDATION_ERROR`                                         | No write                                  |
| Noncanonical direct email write                | Not applicable                                | Application always canonicalizes                               | Database check rejects bypass writes      |
| Password length 7/21                           | Checklist/field error                         | `400 VALIDATION_ERROR`                                         | No write                                  |
| Missing uppercase/lowercase/digit/`$#@%`       | Specific checklist item remains unmet         | `400 VALIDATION_ERROR` with stable field code                  | No write                                  |
| Unsupported password character                 | Clear allowed-character error                 | `400 VALIDATION_ERROR`                                         | No write                                  |
| Common/compromised password                    | Actionable generic password error             | `400 VALIDATION_ERROR`; password not echoed                    | No write                                  |
| Valid sign-up                                  | Loading, then Dashboard                       | `201`, set HttpOnly cookie, return safe User                   | One User row; hash only                   |
| Duplicate sign-up                              | Clear form-level message                      | `409 EMAIL_ALREADY_EXISTS`                                     | Still one row                             |
| Empty/invalid login email                      | Field error                                   | `400 VALIDATION_ERROR`                                         | No change                                 |
| Unknown email                                  | Generic credential error                      | `401 INVALID_CREDENTIALS`                                      | No change                                 |
| Wrong password                                 | Same as unknown email                         | Same external shape as unknown email                           | No change                                 |
| Oversized login password transport             | Field/form error                              | `400 VALIDATION_ERROR`; no hash work                           | No change                                 |
| Existing password after policy change          | Form permits submission                       | Exact hash verification; no creation-policy rejection          | No change                                 |
| Session restore                                | Remains signed in after refresh               | `/auth/me` returns safe User                                   | No unnecessary write                      |
| Logout                                         | Return to Login; clear User state             | `204` and clear cookie                                         | No server revocation write in first slice |
| Successful login                               | Enter Dashboard; token unreadable to JS       | `200`, set HttpOnly cookie, no sensitive fields                | No unnecessary write                      |
| Unauthenticated protected access               | Return to Login; no private-content flash     | Guard returns `401`                                            | No change                                 |
| Unsafe request with invalid/missing provenance | Actionable request failure; no redirect loop  | Reject before mutation                                         | No change                                 |
| Auth/private response caching                  | Private state never comes from a shared cache | `Cache-Control: no-store`; gateway does not cache `Set-Cookie` | No change                                 |
| Navigation                                     | Active item, keyboard usable                  | No API required                                                | No change                                 |
| API/network outage                             | Recoverable error; form usable again          | Request ID traceable where response exists                     | No partial registration write             |

## 12. Risks and controls

| Risk                                                                        | Impact                                                                                                             | Control                                                                                                                                                                                                                                       |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Short-lived access JWT has no active revocation                             | A stolen token remains valid until expiry                                                                          | 15-minute TTL and Secure/HttpOnly cookie; R-03 adds refresh/revocation                                                                                                                                                                        |
| Distinguishing unknown email from wrong password                            | Account enumeration                                                                                                | One `INVALID_CREDENTIALS` response                                                                                                                                                                                                            |
| Login paths differ in expensive work                                        | Timing can aid account enumeration                                                                                 | Fixed dummy Argon2id verification for unknown accounts; test the path, not brittle timing equality                                                                                                                                            |
| Selected 8–20 composition/allowed-set policy                                | Rejects many password-manager values and long passphrases; may encourage predictable compliance patterns           | Clear single checklist, paste/autofill, pinned whole-password blocklist, centralized policy, explicit R-13 review path                                                                                                                        |
| Reapplying creation rules during login                                      | Existing users can be locked out after policy changes                                                              | Login performs exact hash verification only; regression tests preserve compatibility                                                                                                                                                          |
| Client validation treated as security                                       | Invalid data reaches persistence                                                                                   | Server DTO/policy + global ValidationPipe + database constraints                                                                                                                                                                              |
| ORM automatic synchronization                                               | Schema drift or data loss                                                                                          | Migrations only; `synchronize` off in production                                                                                                                                                                                              |
| Check-then-create registration                                              | Concurrent duplicate accounts                                                                                      | Database unique constraint and conflict mapping                                                                                                                                                                                               |
| JWT stored in Web Storage                                                   | XSS can read token                                                                                                 | Host-only HttpOnly cookie only                                                                                                                                                                                                                |
| Cookies attach automatically                                                | CSRF/login-CSRF                                                                                                    | `__Host-` cookie, SameSite=Lax, JSON-only unsafe methods, exact Origin/Referer checks; token required before protected business mutations or broader topology                                                                                 |
| Auth/private responses enter a shared cache                                 | Cross-user data or cookie leakage                                                                                  | End-to-end `no-store`; gateway tests reject caching of private/`Set-Cookie` responses                                                                                                                                                         |
| Incorrect MUI/App Router SSR setup                                          | Flash or hydration errors                                                                                          | Official cache provider and production-build verification                                                                                                                                                                                     |
| Containerizing every app in the inner loop or no containerization at all    | Slow debugging or environment drift                                                                                | Host Web/API; pinned stateful containers; ephemeral CI service                                                                                                                                                                                |
| Local hooks are mistaken for merge/security enforcement                     | `--no-verify` or a missing hook bypasses controls                                                                  | Hooks stay fast and advisory; GitHub required checks and pull-request-title validation repeat authoritative rules                                                                                                                             |
| Bootstrap approval constraints are modeled as a broad ruleset bypass        | Contributors can skip the very CI controls intended to protect `main`                                              | Keep approval requirements satisfiable; keep pull requests and required checks mandatory; add one non-author approval whenever eligible reviewers are available                                                                               |
| AI review is treated as an accountable or deterministic approver            | Incorrect advice, missed defects, vendor outage, or instruction manipulation creates false confidence              | Use AI review only as advisory commentary, never count it as human approval, manually inspect instruction changes, and keep deterministic CI plus self-review authoritative                                                                   |
| Advisory AI review is unavailable or produces low-value results             | Review may stop unexpectedly or add noise without improving risk detection                                         | Request manually only after green CI/self-review; evaluate three risk-bearing PRs; measure useful findings, false positives, misses, and latency; skip low-value review classes and every-push re-review; keep deterministic CI authoritative |
| An untrusted pull request reaches secrets or a privileged trigger           | Credential theft or repository compromise                                                                          | Read-only permissions, no secret-bearing untrusted jobs, no execution of untrusted code through `pull_request_target`, and isolated trust-boundary caches                                                                                     |
| GitHub Actions use mutable tags or excessive permissions                    | Supply-chain substitution or excessive blast radius                                                                | Full-SHA Action pins, Dependabot-reviewed updates, read-only workflow defaults, and job-scoped permissions                                                                                                                                    |
| Path filtering or cache behavior hides a required failure                   | A pull request merges without running the intended gate                                                            | Stable aggregate `ci-required` always reports; caches never replace frozen-lockfile or generated-artifact checks; trusted/untrusted caches remain separate                                                                                    |
| Each environment rebuilds the release or uses long-lived cloud keys         | Staging differs from production; leaked credentials persist                                                        | Build and attest once, promote the same immutable digest, use protected Environments and scoped OIDC, and roll back by verified digest                                                                                                        |
| A GitHub security feature is unavailable for the repository plan/visibility | A documented gate silently does not exist                                                                          | F-08 performs a capability check and records an equivalent control, owner, or explicitly accepted risk                                                                                                                                        |
| Alpine or a tiny runner is selected from image size alone                   | Native-addon incompatibility, missing tools, slower builds, delayed security updates, or insufficient CI resources | Run normal CI on a versioned standard Ubuntu runner; benchmark Debian slim against Alpine across compatibility, architectures, cold/warm time, size, startup, scans, and update latency                                                       |
| Premature agent/pgvector design                                             | Scope growth and wrong abstraction                                                                                 | Keep boundaries only until real retrieval/tool requirements exist                                                                                                                                                                             |
| pgvector installation is confused with enablement                           | Runtime privilege escalation or failed migrations                                                                  | Privileged provisioner enables/verifies extension; separate migrator/runtime roles; R-11 owns vector design                                                                                                                                   |
| Attempting all production capabilities in one slice                         | Review and testing collapse                                                                                        | Deliver vertical slice; keep hardening in explicit backlog                                                                                                                                                                                    |
| Local completion is mistaken for launch readiness                           | Public system lacks abuse, operations, or privacy controls                                                         | D-19 and blocked R-14 require R-02/R-09/R-10 evidence plus explicit authorization                                                                                                                                                             |
| English and Chinese docs drift                                              | Conflicting instructions                                                                                           | English is authoritative; matching `_ZH` updates are part of definition of done                                                                                                                                                               |

## 13. Resolved conclusions and next gate

Resolved in D-01 through D-13: access JWT + same-origin HttpOnly cookie, automatic login after registration, generic invalid credentials, TypeORM, pnpm workspace + Turborepo, same public origin with independent services, backend TypeScript LangGraph created only with its first use case, UUID/`users`/normalized unique email, first English UI with later `zh-CN`, no verification/status/roles in the first migration, host-run applications with containerized infrastructure, the initial 8–20 composition password policy, and English-authoritative documentation with `_ZH` followers.

Accepted from the audit in D-14 through D-19: the exact JWT/cookie profile, Origin/Referer CSRF baseline, end-to-end no-store policy, database-enforced canonical ASCII email, separated database privilege/pgvector provisioning roles, and an independently blocked public-release gate.

Confirmed in D-20 through D-24: GitHub as source-control/automation platform; a public repository owned by `@Donny-Guo`; a bootstrap review mode that never removes required CI or permits a general bypass; fast Husky/lint-staged/commitlint local checks with authoritative CI; a later GitHub CD model based on trusted build-once artifacts, immutable digest promotion, protected Environments, OIDC, approval, and rollback; MIT licensing; and a manual provider-neutral advisory AI-review evaluation.

Confirmed in D-25: the active framework/ORM major lines are Next.js 16, MUI v9, and TypeORM 1.1, with exact reviewed stable pins and owning-task installation boundaries recorded in P-03 and `docs/toolchain.md`.

No foundational product, review, or first-slice implementation gate remains. The owner closed `P-02`, the version-policy evidence completed `P-03`, and the monorepo-root evidence completed `F-01` locally on 2026-08-02. `F-02` completed locally and was reverified on Next.js 16 on 2026-08-03; `F-03` completed locally with its verified NestJS lifecycle and liveness boundary on 2026-08-03. `F-04` completed locally with shared TypeScript/ESLint configuration, one root Prettier policy, standardized checks, negative-rule probes, and cache/ignore/package-boundary evidence on 2026-08-05. `F-05` completed locally on 2026-08-05 with digest-pinned PostgreSQL/pgvector infrastructure, atomic bootstrap, separated roles, clean-start/security/persistence evidence, and the owner-approved B-01/B-02 boundary. `ISSUE-009` and `ISSUE-010` are the remaining dependency-eligible wave, and their authoritative issue order remains the safe default. The independent public-release gate remains blocked, and the first-slice authorization does not extend to post-MVP or production work.

Assumption recorded for D-08: `$#@%` is the complete allowed special-character set for the first policy, not merely an example list. If the user intended these as examples, updating the plan is small and does not affect the architecture.

## 14. Review closure and implementation gate

The plan review is complete:

- Required and excluded scope, API semantics, and the User table are accepted.
- D-08 and its login-compatibility behavior are accepted.
- D-14 through D-19 security, data, and release boundaries are accepted.
- D-20 through D-24 GitHub identity/governance, hook/CI authority, gated-CD boundaries, MIT licensing, and advisory AI-review policy are accepted.
- D-25 Next.js 16/MUI v9/TypeORM 1.1 major-line revision and its owning-task boundaries are accepted.
- English authority and `_ZH` follower rules are accepted.

The owner issued the separate implementation-start instruction on 2026-08-02. It authorizes only the planned first local authentication slice and its listed repository-governance work. It does not authorize post-MVP scope, production deployment, CD activation, cloud resources, public exposure, repository visibility changes, remote creation of `ISSUE-028` onward, or remote update/closure of any GitHub issue.

## 15. Implementation-time inputs

These inputs do not reopen the accepted architecture. Their current disposition is:

1. **F-08 repository profile — policy resolved; artifact alignment pending:** the public repository is owned by `@Donny-Guo`, and MIT is its confirmed open-source license choice. A tracked root `LICENSE` already exists with `Copyright (c) 2026 Dongping Guo (Donny)`, which does not match D-23's confirmed `Copyright (c) 2026 Donny-Guo` notice. F-08 must align and verify the artifact through a reviewable governance change and assign initial sensitive-path ownership to `@Donny-Guo`; do not silently rewrite it during the P-02 gate.
2. **F-08 review policy — resolved:** bootstrap approval requirements remain satisfiable without a general owner bypass of required CI; author self-review and any non-required advisory AI review are requested manually after green CI for selected risk-bearing pull requests. Evaluate three representative pull requests without enabling overlapping reviewers, and record useful findings, false positives, misses, and latency before changing the policy. Provider and account details remain outside the public repository. Require at least one non-author owned-path approval whenever eligible reviewers are available.
3. **R-09 delivery target — deferred by the user:** hosting platform, region, image registry, `staging`/`production` domains, and OIDC provider will be decided later. The image evaluation method is defined, but no base image or platform is selected yet.
4. **R-09/R-14 operations — deferred by the user:** production approver, RPO, RTO, SLO, alerting/on-call, data residency, and rollback targets will be decided later.

Until items 3 and 4 are resolved, use GitHub-hosted runners and keep CD disabled; do not guess cloud credentials or production ownership.
