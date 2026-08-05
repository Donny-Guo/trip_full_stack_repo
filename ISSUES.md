# Consolidated GitHub Issues for the Local Authentication Demo

Status: **owner-approved issue consolidation completed remotely on 2026-08-05; ISSUE-007 is complete; ISSUE-009/MVP-01 and ISSUE-010/MVP-02 are the only open execution issues**\
Plan date: 2026-07-30\
Consolidation date: 2026-08-05\
Scope source: [`PLANS.md`](./PLANS.md)\
Repository owner: `@Donny-Guo`

Simplified Chinese follower: [`ISSUES_ZH.md`](./ISSUES_ZH.md). This English file is authoritative.

## 1. Purpose and authority

This catalog gives the repository one current issue answer after the owner compressed the time-limited local authentication demo into two execution issues after infrastructure. Detailed architecture, security decisions, task-level requirements, and later backlog remain in `PLANS.md`; they are not additional active GitHub issues.

Authority order:

1. `AGENTS.md` defines repository-wide engineering and safety rules.
2. `PLANS.md` defines confirmed decisions, detailed requirements, and later backlog.
3. This file defines active GitHub issue packaging, disposition, dependencies, and acceptance evidence.

On 2026-08-05, the owner explicitly authorized rewriting GitHub issues #9 and #10 and closing #11 through #27 while leaving #7 untouched. The remote reorganization is complete. That authorization does not permit later issue creation, editing, reopening, or closure without another explicit owner request.

Production-quality in this slice means the retained authentication path keeps its security, data-integrity, accessibility, migration, testing, hook, and CI requirements. It does not mean the application is approved for public exposure or production deployment.

## 2. Current remote state and order

| Order | GitHub issue                                                                                                           | State                 | Disposition                                                                                 |
| ----: | ---------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------- |
|   1-6 | [#1-#6](https://github.com/Donny-Guo/trip_full_stack_repo/issues?q=is%3Aissue+number%3A1..6)                           | Closed                | Completed historical foundation and authorization                                           |
|     7 | [#7 — Local PostgreSQL and pgvector infrastructure](https://github.com/Donny-Guo/trip_full_stack_repo/issues/7)        | Closed                | Completed local database infrastructure                                                     |
|     8 | [#8 — MUI v9 App Router SSR](https://github.com/Donny-Guo/trip_full_stack_repo/issues/8)                               | Closed                | Completed Web UI foundation                                                                 |
|     9 | [#9 — MVP-01 authentication API](https://github.com/Donny-Guo/trip_full_stack_repo/issues/9)                           | Open                  | First consolidated execution issue after #7                                                 |
|    10 | [#10 — MVP-02 local demo and quality gates](https://github.com/Donny-Guo/trip_full_stack_repo/issues/10)               | Open                  | Second consolidated execution issue; blocked by #9                                          |
| 11-27 | [Historical issues](https://github.com/Donny-Guo/trip_full_stack_repo/issues?q=is%3Aissue+is%3Aclosed+number%3A11..27) | Closed as not planned | Superseded by #9/#10 or moved to the documented backlog; closure is not completion evidence |

Safe execution order:

```text
ISSUE-007 (DONE) -> ISSUE-009 / MVP-01 -> ISSUE-010 / MVP-02
```

The closed #2 body records the pre-D-25 version baseline. D-25 and `docs/toolchain.md` are the current authority for Next.js 16.2.12, MUI 9.2.0, and TypeORM 1.1.0.

## 3. Shared readiness and review rules

An active issue is ready only when its prerequisite is complete, its decisions in `PLANS.md` remain valid, and required local services, environment values, and test paths are available through approved non-secret configuration.

Completion requires:

- A reviewable outcome with no unrelated dependency upgrades or speculative architecture.
- Root and affected-package formatting, lint, strict typecheck, tests, and production builds passing.
- Real PostgreSQL for repository, migration, and auth integration tests.
- Direct negative tests for security controls rather than line coverage alone.
- No secrets, plaintext passwords, hashes, JWTs, sensitive logs, skipped tests, or unexplained TODOs.
- Synchronized contracts, migrations, environment examples, README, `PLANS.md`, this catalog, and existing Chinese followers.
- Evidence for security, privacy, accessibility, failure, cache, and rollback boundaries proportionate to the change.

One consolidated issue may contain layered commits. If a single pull request becomes unreviewable, multiple focused pull requests may close the same issue; issue consolidation must not force an unsafe diff.

## 4. ISSUE-007 — Local PostgreSQL and pgvector infrastructure

- **GitHub:** [#7](https://github.com/Donny-Guo/trip_full_stack_repo/issues/7)
- **Status:** `DONE`
- **Plan task:** `F-05`
- **Remote state:** closed as completed on 2026-08-05

The merged implementation provides digest-pinned PostgreSQL 18.4/pgvector 0.8.5 infrastructure, loopback-only Compose access, health checks, a named volume, separate provisioner/migrator/runtime roles, privileged extension bootstrap, and least-privilege verification. A migration-shaped transactional DDL probe succeeds as migrator and rolls back; direct TCP/SCRAM runtime access succeeds while runtime DDL and extension operations fail. Actual NestJS/TypeORM connection/readiness remains in ISSUE-009/B-01, and the first real application migration remains in ISSUE-009/B-02.

## 5. ISSUE-009 / MVP-01 — Build the PostgreSQL-backed authentication API

- **GitHub:** [#9](https://github.com/Donny-Guo/trip_full_stack_repo/issues/9)
- **Status:** `TODO`
- **Blocked by:** ISSUE-007 (`DONE`)
- **Consolidates:** the former task scopes from #9, #10, #13, #17, #18, and #20-#24
- **PR boundary:** one outcome-focused backend PR with layered configuration/data, security-boundary, endpoint, and test commits; split into multiple PRs only when reviewability requires it

### Outcome

Deliver a tested NestJS authentication API backed by the Docker Compose PostgreSQL service, with production-quality persistence, password, JWT, cookie, validation, request-security, and failure boundaries.

### Work

- [ ] Add fail-fast API configuration, TypeORM 1.1 data sources, dependency-aware database readiness, explicit migration commands, and runtime/migrator separation.
- [ ] Create the `users` migration with UUID identity, canonical unique email, non-default-selected `password_hash`, and UTC timestamps.
- [ ] Implement narrow Users repository/service boundaries without returning ORM entities or credential fields.
- [ ] Implement email normalization, the approved PasswordPolicy, a pinned licensed/checksummed local compromised-password blocklist, Argon2id hashing, dummy-hash verification, and sensitive-value redaction.
- [ ] Add stable API errors and field codes, request IDs, global input validation, JSON-only/body limits, no-store headers, and exact trusted Origin/Referer enforcement for unsafe methods.
- [ ] Implement the approved HS256 access-JWT claims and validation, shared token issuance, local/production cookie profiles, and exact cookie deletion.
- [ ] Implement `POST /api/v1/auth/sign-up`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`, `POST /api/v1/auth/logout`, and a reusable NestJS JWT guard.
- [ ] Add unit and real-PostgreSQL integration tests for the complete critical contract and negative security paths.

### Acceptance

- [ ] A clean database migrates explicitly; application startup never synchronizes or runs migrations.
- [ ] The runtime database role cannot perform DDL or extension management.
- [ ] Sign-up creates one real user, returns `201`, and sets the approved 15-minute HttpOnly JWT cookie.
- [ ] Canonical duplicate and concurrent registration are database-safe and map to stable `409` responses.
- [ ] Valid login succeeds; unknown email and wrong password execute the intended verification paths and return the same `401 INVALID_CREDENTIALS` shape.
- [ ] `/auth/me` returns only safe User fields; logout is idempotent and clears the exact cookie tuple.
- [ ] Invalid JWT algorithms, signatures, claims, and expiration fail safely.
- [ ] Unsupported media types, unknown fields, oversized bodies, and untrusted or missing request provenance fail before mutation.
- [ ] Passwords, hashes, JWTs, and connection secrets never appear in responses, logs, screenshots, or test artifacts.
- [ ] API format, lint, typecheck, unit/integration tests, and production build pass.

**Evidence:** migration/role verification, API contract report, JWT/cookie/provenance matrix, concurrent-registration test, dummy-hash-path evidence, sanitized log scan, and root/API quality-command output.

**Non-goals:** Web pages, refresh tokens, Redis, email verification, password reset, roles, public rate limiting, Swagger/OpenAPI, production deployment, or public exposure.

## 6. ISSUE-010 / MVP-02 — Ship the local sign-up/login demo and developer quality gates

- **GitHub:** [#10](https://github.com/Donny-Guo/trip_full_stack_repo/issues/10)
- **Status:** `TODO`
- **Blocked by:** ISSUE-009
- **Consolidates:** former issues #11, #12, the demo-essential portions of #14/#15, and #25-#27
- **PR boundary:** one outcome-focused Web/demo/quality-gates PR with layered Web-boundary, auth UI/session, hooks/CI, test, and documentation commits; split into multiple PRs only when reviewability requires it

### Outcome

Deliver a reproducible local demonstration where a user can register, enter a protected Dashboard, restore the session after refresh, log out, and log back in, with local hooks and deterministic pull-request quality gates.

### Work

- [ ] Configure validated Web environment boundaries and a narrow same-origin `/api/v1` proxy to NestJS.
- [ ] Create minimal `/sign-up`, `/login`, and protected `/dashboard` routes using the existing MUI v9 App Router SSR foundation.
- [ ] Build accessible MUI forms with immediate client feedback, stable API-error mapping, submission-state protection, keyboard support, paste, and autofill.
- [ ] Protect Dashboard through server-side `/auth/me`, explicit cookie forwarding, no-store behavior, sanitized same-origin return paths, and distinct `401` versus API-outage handling.
- [ ] Implement logout and session restoration without storing tokens or session identifiers in browser-accessible persistent state.
- [ ] Add focused Vitest/Testing Library coverage and one Playwright journey covering sign-up, restore, logout, login, and route protection against real PostgreSQL.
- [ ] Add Husky installation, staged-only lint-staged pre-commit checks, and Conventional Commit validation through `commit-msg`.
- [ ] Add least-privilege, immutable-SHA-pinned pull-request CI for frozen install, formatting, lint, typecheck, unit/integration tests, the critical E2E journey, production builds, and a stable aggregate result.
- [ ] Document environment variables, Docker/database startup, migrations, application startup, the demo journey, verification commands, and known public-release limitations.

### Acceptance

- [ ] From a clean checkout, documented commands start PostgreSQL, migrate it, and run the host Web/API applications.
- [ ] Successful sign-up creates a database row, receives the HttpOnly JWT cookie, and enters Dashboard exactly once.
- [ ] Refresh restores the authenticated session without flashing or caching private content.
- [ ] Logout protects Dashboard again; subsequent valid login restores access.
- [ ] Duplicate registration, password-policy failures, invalid credentials, provenance failures, and API outages produce safe, accessible, distinct responses where the public contract permits.
- [ ] The JWT is absent from response bodies, URLs, Web Storage, logs, screenshots, analytics, and persistent client state.
- [ ] Pre-commit touches only staged files, performs no network/database/full-build work, and preserves partial staging.
- [ ] Root format, lint, typecheck, tests, critical E2E, and production builds pass locally and in pull-request CI.
- [ ] README, environment examples, plans/issues, and Chinese followers agree with implemented behavior and keep the public-release gate closed.

**Evidence:** clean-start transcript, responsive Sign Up/Login/Dashboard screenshots, accessibility/component-test results, Playwright critical-path report, browser cookie/storage inspection, hook partial-staging checks, CI result, and synchronized documentation.

**Non-goals:** full navigation, Flight Info/User screens, localization or a language switcher, final branding, generated OpenAPI clients, complete GitHub governance/security settings, deployment, or public exposure.

## 7. Historical issue disposition

Closing a historical issue as not planned records consolidation or deferral, not implemented evidence.

| Closed issue           | Disposition                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| #11, #12               | Minimum PR CI and local hooks moved to ISSUE-010/MVP-02                                          |
| #13, #17, #18, #20-#24 | Required API/data/security work moved to ISSUE-009/MVP-01                                        |
| #14                    | Minimal auth/Dashboard shell moved to ISSUE-010; extensible shell and localization work deferred |
| #15, #25-#27           | Required Web auth/session/forms work moved to ISSUE-010/MVP-02                                   |
| #16                    | Full GitHub governance and security-administration work moved to later/public-release backlog    |
| #19                    | Extensible navigation and Flight Info/User targets moved to later product backlog                |

## 8. Documented backlog, not active GitHub issues

`PLANS.md` remains the detailed source for these later requirements. Listing them does not authorize implementation or remote issue creation.

- Full localization architecture, Simplified Chinese product copy, locale persistence, and language switching.
- Extensible navigation, Flight Info/User targets, feature flags, and future permission filtering.
- Full GitHub governance and security administration: repository rulesets, CODEOWNERS, templates, Dependabot, CodeQL, secret scanning, push protection, license-notice alignment, and advisory AI-review evaluation.
- Swagger/OpenAPI and generated clients.
- Public-exposure controls: distributed rate limits, security headers, proxy-trust validation, privacy-safe audit events, outage behavior, and runbooks.
- Refresh rotation/revocation, Redis, mail, email verification, password reset, account lifecycle, and RBAC.
- Production images, cloud/CD/OIDC, observability, backup/restore, rollback, and release approval.
- Privacy/threat modeling, vector retrieval, LangGraph, travel providers, agent persistence, and evaluation.

The public-release gate stays blocked until all mandatory release prerequisites in `PLANS.md` have evidence and the owner explicitly authorizes exposure.
