# GitHub Issue Catalog and Dependency Plan

Status: **ISSUE-007, ISSUE-009/MVP-01, and ISSUE-010/MVP-02 are merged and remotely closed; ISSUE-039 through ISSUE-044 are open planning issues for the proposed Airline Delay Data slice, whose implementation is not authorized**\
Plan date: 2026-07-30\
Consolidation date: 2026-08-05\
Airline Delay Data planning date: 2026-08-10\
Scope source: [`PLANS.md`](./PLANS.md)\
Repository owner: `@Donny-Guo`

Simplified Chinese follower: [`ISSUES_ZH.md`](./ISSUES_ZH.md). This English file is authoritative.

## 1. Purpose and authority

This catalog gives the repository one current issue answer for the completed local authentication slice and the open Airline Delay Data planning chain. Detailed decisions and task requirements remain in `PLANS.md`; this file owns the issue packaging, dependencies, review boundaries, and planning-only status.

Authority order:

1. `AGENTS.md` defines repository-wide engineering and safety rules.
2. `PLANS.md` defines confirmed decisions, detailed requirements, and later backlog.
3. This file defines GitHub issue packaging, disposition, dependencies, implementation gates, and acceptance evidence.

On 2026-08-05, the owner explicitly authorized rewriting GitHub issues #9 and #10 and closing #11 through #27 while leaving #7 untouched. The remote reorganization is complete. On 2026-08-06, the owner separately authorized narrowing #10 so Dashboard product details move to the documented backlog, together with synchronized local documentation; that remote update is also complete. PR #38 merged ISSUE-010, and #10 closed on 2026-08-06. On 2026-08-10, the owner separately authorized creation of English planning issues #39-#44 and this synchronized local documentation. That request did not authorize implementation or any additional issue mutation.

MVP quality in this slice means the retained authentication path keeps the durable controls required for real PostgreSQL persistence, password hashing, cookie sessions, database uniqueness, and safe API failures. Exhaustive pre-release hardening remains deferred, and the application is not approved for public exposure or production deployment.

## 2. Current remote state and order

| Order | GitHub issue                                                                                                                          | State                 | Disposition                                                                                 |
| ----: | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------- |
|   1-6 | [#1-#6](https://github.com/Donny-Guo/trip_full_stack_repo/issues?q=is%3Aissue+number%3A1..6)                                          | Closed                | Completed historical foundation and authorization                                           |
|     7 | [#7 — Local PostgreSQL and pgvector infrastructure](https://github.com/Donny-Guo/trip_full_stack_repo/issues/7)                       | Closed                | Completed local database infrastructure                                                     |
|     8 | [#8 — MUI v9 App Router SSR](https://github.com/Donny-Guo/trip_full_stack_repo/issues/8)                                              | Closed                | Completed Web UI foundation                                                                 |
|     9 | [#9 — MVP-01 authentication API](https://github.com/Donny-Guo/trip_full_stack_repo/issues/9)                                          | Closed                | Completed and merged on 2026-08-06                                                          |
|    10 | [#10 — MVP-02 local demo and quality gates](https://github.com/Donny-Guo/trip_full_stack_repo/issues/10)                              | Closed                | Merged through PR #38 and remotely closed on 2026-08-06                                     |
| 11-27 | [Historical issues](https://github.com/Donny-Guo/trip_full_stack_repo/issues?q=is%3Aissue+is%3Aclosed+number%3A11..27)                | Closed as not planned | Superseded by #9/#10 or moved to the documented backlog; closure is not completion evidence |
| 39-44 | [Airline Delay Data planning issues](https://github.com/Donny-Guo/trip_full_stack_repo/issues?q=is%3Aissue+is%3Aopen+number%3A39..44) | Open                  | Proposed AD-01 through AD-06 sequence; issue creation is not implementation authorization   |

Safe execution order:

```text
ISSUE-007 (DONE) -> ISSUE-009 / MVP-01 (DONE) -> ISSUE-010 / MVP-02 (MERGED; CLOSED)
```

Proposed Airline Delay Data sequence:

```text
ISSUE-039 / AD-01 -> ISSUE-040 / AD-02 -> ISSUE-041 / AD-03 ────────────────┐
                                           \-> ISSUE-042 / AD-04 -> ISSUE-043 / AD-05 ──┴-> ISSUE-044 / AD-06
```

AD-03 and AD-04 may proceed in parallel only after AD-02. AD-06 requires both AD-03 and AD-05. No item in this sequence is executable until the owner separately authorizes implementation.

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
- **Status:** `DONE`
- **Prerequisite:** ISSUE-007 is `DONE`
- **Remote state:** closed as completed on 2026-08-06 after the implementation merged
- **Consolidates:** the former task scopes from #9, #10, #13, #17, #18, and #20-#24
- **PR boundary:** one outcome-focused backend PR with layered configuration/data, security-boundary, endpoint, and test commits; split into multiple PRs only when reviewability requires it

### Outcome

Deliver a working, tested NestJS authentication API backed by the Docker Compose PostgreSQL service, with explicit migrations, safe persistence, Argon2id password hashing, a short-lived HttpOnly JWT cookie, and the minimum request-security boundaries needed by the local demo.

### Work

- [x] Add fail-fast API configuration, TypeORM 1.1 data sources, dependency-aware database readiness, explicit migration commands, and runtime/migrator separation.
- [x] Create the `users` migration with UUID identity, canonical unique email, non-default-selected `password_hash`, and UTC timestamps.
- [x] Implement narrow Users repository/service boundaries without returning ORM entities or credential fields.
- [x] Implement email normalization, the approved PasswordPolicy, Argon2id hashing, dummy-hash verification, and sensitive-value redaction. Do not add a local blocklist or remote password lookup in this MVP.
- [x] Add stable API errors and field codes, request IDs, global input validation, JSON-only/body limits, no-store headers, and exact trusted Origin/Referer enforcement for unsafe methods.
- [x] Implement the approved HS256 access-JWT claims and validation, shared token issuance, local/production cookie profiles, and exact cookie deletion.
- [x] Implement `POST /api/v1/auth/sign-up`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`, `POST /api/v1/auth/logout`, and a reusable NestJS JWT guard.
- [x] Add focused unit and real-PostgreSQL integration tests for the core success path and highest-value failure boundaries; synchronize README, API documentation, environment examples, and English/Chinese authority documents.

### Acceptance

- [x] A clean database migrates explicitly; application startup never synchronizes or runs migrations.
- [x] The runtime role can perform only required application DML and cannot perform DDL or extension management; TypeORM never installs extensions.
- [x] Sign-up creates one real user, returns `201`, and sets the approved 15-minute HttpOnly JWT cookie.
- [x] Canonical duplicate registration is enforced by PostgreSQL and maps to `409`; one focused concurrent-registration test proves only one request succeeds.
- [x] Valid login succeeds; unknown email and wrong password return the same `401 INVALID_CREDENTIALS` contract, with one focused test proving the dummy-hash path.
- [x] `/auth/me` returns only safe User fields; logout is idempotent and clears the exact cookie tuple.
- [x] Focused JWT tests reject a tampered signature, expiration, invalid algorithm, and invalid required claims.
- [x] Focused request tests reject an unknown field, an oversized body, an unsupported media type, and missing or untrusted provenance before mutation.
- [x] Passwords, hashes, JWTs, cookies, and connection secrets do not appear in public response bodies or normal application logs.
- [x] API format, lint, typecheck, focused unit/integration tests, and production build pass.
- [x] README, API runbook/contracts, environment examples, and English/Chinese issue/plan documentation describe what the implementation actually does.

**Minimum evidence:** clean migration `show/run/show`; focused unit and real-PostgreSQL integration reports; API format/lint/typecheck/build output; and a sanitized Postman or curl sign-up -> `/auth/me` -> logout -> login smoke result.

**Deliberately deferred:** compromised/common-password blocklist and assets; exhaustive password/JWT/provenance/database/log matrices; formal Argon2 p95/peak-memory benchmarking; Web pages, refresh tokens, Redis, email verification, password reset, roles, public rate limiting, Swagger/OpenAPI, production deployment, and public exposure.

## 6. ISSUE-010 / MVP-02 — Ship the local sign-up/login demo and developer quality gates

- **GitHub:** [#10](https://github.com/Donny-Guo/trip_full_stack_repo/issues/10)
- **Status:** `DONE (merged; residual evidence note below)`
- **Remote state:** PR [#38](https://github.com/Donny-Guo/trip_full_stack_repo/pull/38) merged as `e1ad0046f9075e2b35ed5f2ac665076107a7f13a`, and #10 closed on 2026-08-06
- **Prerequisite:** ISSUE-009 is `DONE`
- **Consolidates:** former issues #11, #12, the demo-essential portions of #14/#15, and #25-#27
- **PR boundary:** one outcome-focused Web/demo/quality-gates PR with layered Web-boundary, auth UI/session, hooks/CI, test, and documentation commits; split into multiple PRs only when reviewability requires it

### Outcome

Deliver a reproducible local demonstration where a user can register, enter an intentionally sparse protected Dashboard destination, restore the session after refresh, log out, and log back in, with local hooks and deterministic pull-request quality gates. The Dashboard proves the auth boundary; it is not a product-dashboard deliverable. Product Dashboard requirements, data, content, and design are deferred to documented W-09 and require separate authorization.

### Work

- [x] Configure validated Web environment boundaries and a narrow same-origin `/api/v1` proxy to NestJS.
- [x] Create minimal `/sign-up`, `/login`, and protected `/dashboard` routes using the existing MUI v9 App Router SSR foundation. Keep Dashboard to accessible route identity and the logout control required by the auth journey.
- [x] Build accessible MUI forms with immediate client feedback, stable API-error mapping, submission-state protection, keyboard support, paste, and autofill.
- [x] Protect Dashboard through server-side `/auth/me`, explicit cookie forwarding, no-store behavior, sanitized same-origin return paths, and distinct `401` versus API-outage handling.
- [x] Implement logout and session restoration without storing tokens or session identifiers in browser-accessible persistent state.
- [x] Add focused Vitest/Testing Library coverage and Playwright journeys covering sign-up, restore, logout, login, route protection, session-aware 404 behavior, and API outage against real PostgreSQL.
- [x] Add Husky installation, staged-only lint-staged pre-commit checks, and Conventional Commit validation through `commit-msg`.
- [x] Add least-privilege, immutable-SHA-pinned pull-request CI for frozen install, formatting, lint, typecheck, unit/integration tests, the critical E2E journey, production builds, and a stable aggregate result.
- [x] Document environment variables, Docker/database startup, migrations, application startup, the demo journey, verification commands, and known public-release limitations.

### Acceptance

- [ ] From a clean checkout, documented commands start PostgreSQL, migrate it, and run the host Web/API applications.
- [x] Successful sign-up creates a database row, receives the HttpOnly JWT cookie, and enters Dashboard exactly once.
- [x] Refresh restores the authenticated session without flashing or caching private content.
- [x] Logout protects Dashboard again; subsequent valid login restores access.
- [x] Dashboard has no required product content beyond accessible route identity and logout: no cards, metrics, trip or itinerary data, product navigation, personalization, or polished product design.
- [x] Duplicate registration, password-policy failures, invalid credentials, provenance failures, and API outages produce safe, accessible, distinct responses where the public contract permits.
- [x] The JWT is absent from response bodies, URLs, Web Storage, browser-readable cookies, and persistent client state; API redaction tests cover logs.
- [ ] Pre-commit touches only staged files, performs no network/database/full-build work, and preserves partial staging.
- [ ] Root format, lint, typecheck, tests, critical E2E, and production builds pass locally and in pull-request CI.
- [x] README, environment examples, plans/issues, and Chinese followers agree with implemented behavior and keep the public-release gate closed.

**Evidence (2026-08-06):** isolated migration `show/run/show`; 48 API unit, 12 real-PostgreSQL integration, 73 Web unit/component, and 6 Playwright journey tests; production builds; exact HttpOnly cookie and empty Web Storage inspection; accessibility scans; hook/config review; synchronized documentation; merged PR #38; and remotely closed #10.

**Residual evidence warning:** the read-only GitHub PR record returned no status-check rollup or review decision, and the remote issue body retained unchecked acceptance boxes. The previously open clean-checkout, owner-performed partial-staging/visual handoff, and PR-CI evidence are therefore not independently recoverable from remote metadata. This is documentation/evidence debt, not an unmerged implementation claim, and it does not relax future completion rules.

**Non-goals:** Dashboard product content or visual design, full navigation, Flight Info/User screens, localization or a language switcher, final branding, generated OpenAPI clients, complete GitHub governance/security settings, deployment, or public exposure.

## 7. Historical issue disposition

Closing a historical issue as not planned records consolidation or deferral, not implemented evidence.

| Closed issue           | Disposition                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| #11, #12               | Minimum PR CI and local hooks moved to ISSUE-010/MVP-02                                                                   |
| #13, #17, #18, #20-#24 | Required API/data/security work moved to ISSUE-009/MVP-01                                                                 |
| #14                    | Sparse protected auth destination moved to ISSUE-010; product Dashboard, extensible shell, and localization work deferred |
| #15, #25-#27           | Required Web auth/session/forms work moved to ISSUE-010/MVP-02                                                            |
| #16                    | Full GitHub governance and security-administration work moved to later/public-release backlog                             |
| #19                    | Extensible navigation and Flight Info/User targets moved to later product backlog                                         |

## 8. Active Airline Delay Data planning chain

These English issues are open and assigned to `@Donny-Guo`. Their scope and acceptance criteria are detailed in their remote bodies, summarized in `PLANS.md`, and packaged here with their dependency order. Every status below is planning-only: `TODO` does not imply implementation authorization.

| Plan task | Local issue ID | GitHub                                                             | Status                 | Depends on           | Review boundary                                                                |
| --------- | -------------- | ------------------------------------------------------------------ | ---------------------- | -------------------- | ------------------------------------------------------------------------------ |
| AD-01     | ISSUE-039      | [#39](https://github.com/Donny-Guo/trip_full_stack_repo/issues/39) | `TODO (planning only)` | None                 | Source schema, official mapping provenance, and formula proof                  |
| AD-02     | ISSUE-040      | [#40](https://github.com/Donny-Guo/trip_full_stack_repo/issues/40) | `TODO (planning only)` | ISSUE-039            | Aggregate/audit migrations, indexes, privileges, and atomic publication        |
| AD-03     | ISSUE-041      | [#41](https://github.com/Donny-Guo/trip_full_stack_repo/issues/41) | `TODO (planning only)` | ISSUE-039, ISSUE-040 | Development-only streaming import CLI and reconciliation reports               |
| AD-04     | ISSUE-042      | [#42](https://github.com/Donny-Guo/trip_full_stack_repo/issues/42) | `TODO (planning only)` | ISSUE-039, ISSUE-040 | Authenticated query/options API and real-PostgreSQL tests                      |
| AD-05     | ISSUE-043      | [#43](https://github.com/Donny-Guo/trip_full_stack_repo/issues/43) | `TODO (planning only)` | ISSUE-042            | Protected 21-field table, linked filters, pagination, and accessibility        |
| AD-06     | ISSUE-044      | [#44](https://github.com/Donny-Guo/trip_full_stack_repo/issues/44) | `TODO (planning only)` | ISSUE-041, ISSUE-043 | Ten-year import, reconciliation, activation, performance, and handoff evidence |

Shared gates:

- AD-01 is a stop/go data-contract gate. Missing or ambiguous official mappings, source drift, or a formula mismatch blocks AD-02 onward.
- Full per-flight CSVs, generated reports, and populated environment files stay ignored and uncommitted.
- `csv-parse@7.0.1` and `decimal.js@10.6.0` belong to the AD-03 importer as direct `apps/api` development-only dependencies outside the `AppModule` runtime graph.
- AD-02 publishes only the 21-field aggregate and audit metadata; PostgreSQL does not retain raw per-flight rows.
- AD-04 and AD-05 use authenticated, no-store, server-backed filtering and pagination; the browser never receives more than the selected 100-row maximum.
- AD-06 activates data only after independent ten-year reconciliation and all applicable documentation, format, lint, typecheck, integration, E2E, and build gates pass.

## 9. Documented backlog, not active GitHub issues

`PLANS.md` remains the detailed source for these later requirements. Listing them does not authorize implementation or remote issue creation.

- Full localization architecture, Simplified Chinese product copy, locale persistence, and language switching.
- Product Dashboard requirements, data sources, cards/metrics, trip or itinerary content, personalization, responsive composition, and polished visual design.
- Extensible navigation, Flight Info/User targets, feature flags, and future permission filtering.
- Full GitHub governance and security administration: repository rulesets, CODEOWNERS, templates, Dependabot, CodeQL, secret scanning, push protection, license-notice alignment, and advisory AI-review evaluation.
- Swagger/OpenAPI and generated clients.
- Public-exposure controls: distributed rate limits, security headers, proxy-trust validation, privacy-safe audit events, outage behavior, and runbooks.
- Refresh rotation/revocation, Redis, mail, email verification, password reset, account lifecycle, and RBAC.
- Production images, cloud/CD/OIDC, observability, backup/restore, rollback, and release approval.
- Privacy/threat modeling, vector retrieval, LangGraph, travel providers, agent persistence, and evaluation.

The public-release gate stays blocked until all mandatory release prerequisites in `PLANS.md` have evidence and the owner explicitly authorizes exposure.
