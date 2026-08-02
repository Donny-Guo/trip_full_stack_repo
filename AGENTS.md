# AGENTS.md

This file governs AI agents and contributors for the repository root and all descendants. A closer descendant `AGENTS.md` overrides it for that subtree. Simplified Chinese follower: [`AGENTS_ZH.md`](./AGENTS_ZH.md). This English file is authoritative.

## 1. Objective, state, and authorized scope

Build a production-oriented travel-agent application with a pnpm/Turborepo monorepo; Next.js 15 App Router, TypeScript, and MUI v6 on the Web; NestJS, TypeScript, and REST in the API; TypeScript LangGraph initially behind an extractable API boundary; TypeORM 0.3.31; and PostgreSQL 18 with pgvector available for later vector work. The first authentication slice uses a 15-minute access JWT in a same-origin HttpOnly cookie. Refresh/rotation/revocation, Redis, Swagger/OpenAPI, observability, agent persistence, and travel-provider integrations come later.

Decisions D-01 through D-24 are confirmed. On 2026-08-02, the owner authorized the planned first local authentication slice, closing `P-02`/`ISSUE-001`. The authorization covers planned code/scaffolding, dependencies and the root lockfile, hooks, MIT-license governance, first-slice GitHub CI/governance, migrations, local PostgreSQL/pgvector infrastructure, and synchronized documentation/status updates. `P-03`/`ISSUE-002` and `F-01`/`ISSUE-003` are complete locally; continue with `F-02`/`ISSUE-004` and `F-03`/`ISSUE-005` in dependency order and stay within that slice.

On 2026-08-02, the owner also confirmed that `P-03` must retain the Next.js 15 + MUI v6 pairing, use TypeORM 0.3.31 and PostgreSQL 18, and select Jest/Supertest for API tests, Vitest/React Testing Library for Web unit/component tests, and Playwright for browser E2E. Treat these as deliberate constraints: do not silently substitute another major or test family. Because upstream currently lists MUI v6 as unsupported and Next.js 15 as Maintenance LTS, re-evaluate that pairing by 2026-09-21 or before public exposure, whichever comes first, and immediately upon a critical unpatched security or compatibility blocker. A review does not authorize a major-version change; that still requires the owner's explicit approval.

That authorization excludes post-MVP work, production deployment, CD activation, cloud resources, public exposure, repository-visibility changes, remote creation of `ISSUE-028` onward, and remote update/closure of any GitHub issue. The owner separately authorized remote creation of `ISSUE-001` through `ISSUE-027` and their scoped metadata on 2026-07-30; those public-repository issues exist. Any other remote issue operation needs a separate explicit request.

## 2. Authority, evidence, and documentation

Resolve conflicts in this order:

1. The user's current explicit request.
2. This file and any closer `AGENTS.md`.
3. Approved `PLANS.md` and architecture decision records (ADRs).
4. `ISSUES.md`, which packages `PLANS.md` and may add review detail or stricter sequencing but not override the plan.
5. `README.md` and other documentation.

Current code, migrations, tests, and verified runtime behavior are evidence for implemented-system claims. If evidence and documentation differ, report the mismatch and update the authoritative documents in the same change, or request a decision; do not guess or preserve stale prose.

- Unsuffixed project documents are authoritative English. Existing `_ZH.md` files are Simplified Chinese followers and must identify their English source.
- Material English changes require same-change follower updates. Keep decision/task/issue IDs, status, scope, paths, commands, and acceptance criteria aligned. English controls on conflict; fix the follower.
- Code identifiers, APIs, schemas, ADRs, runbooks, commit-facing technical language, and initial UI copy are English unless a later localization task says otherwise.
- Public content may identify `@Donny-Guo` as owner, assignee, `CODEOWNERS` identity, or copyright name. Never record private account plans/tiers, eligibility/subscription status, billing/usage allowances, maintainer-count profiles, or similar account metadata.

## 3. Repository and architecture boundaries

Planned locations are `.github/{workflows,CODEOWNERS,dependabot.yml,PULL_REQUEST_TEMPLATE.md,ISSUE_TEMPLATE/}`, `.husky/`, `apps/{web,api}`, `packages/{api-client,config-eslint,config-typescript,test-utils}`, `infra/docker`, `docs/{adr,api,agent}`, `docs/toolchain*.md`, and root `AGENTS*`, `PLANS*`, `ISSUES*`, `README*`, `CONTRIBUTING.md`, `SECURITY.md`, and `LICENSE`. Workflows start with PR CI/security; deployment waits for R-09. Create `test-utils` only after real cross-application reuse. Generated `api-client` files are never maintained manually. `LICENSE` remains standard MIT text and changes require explicit owner authorization.

- `apps/web` never accesses PostgreSQL, Redis, model providers, or privileged agent tools directly. `apps/api` owns business rules, authentication/authorization, and data access.
- Web and API do not import one another's source by relative path. Once available, cross-application contracts come from generated OpenAPI artifacts; do not hand-maintain duplicate request/response models.
- Extract a shared package only for at least two real consumers; never create speculative `common`/`utils` dumping grounds.
- Do not scaffold an empty `AgentModule`, vector table, or generated API client in the authentication slice. Create each boundary with its first real use case.
- LangGraph nodes do not depend on HTTP controllers; they call business capabilities through agent-owned ports/services.

## 4. Workflow and remote-operation controls

For every change: read applicable rules/plans; inspect the worktree and preserve unrelated changes; confirm acceptance criteria, dependencies, and non-goals; deliver the smallest useful vertical slice; run risk-proportionate checks; synchronize contracts, migrations, environment examples, and docs; then report changed files, evidence, residual risks, and unresolved decisions.

Without explicit authorization, do not replace/upgrade the framework, package manager, ORM, authentication approach, or deployment platform; write real secrets or commit `.env`; log passwords, tokens, model prompts, or private tool results; perform destructive database work or rewrite history; overwrite user changes; or put temporary mocks, hard-coded users, or auth bypasses on a production path.

### User-controlled remote operations

- Before every `git push`, report the remote, branch, and commits, then wait for the owner's explicit confirmation in the current conversation. Earlier or broad authorization never satisfies this gate.
- Never authenticate or sign in to GitHub through a browser/UI or start interactive GitHub authentication.
- Never create, submit, update, close, or merge a pull request through a browser, CLI, API, connector, or app. Put requested PR content only in an ignored, uncommitted, unpushed local `PR_ISSUE_<nnn>.md`; the owner submits it.
- Do not provision, configure, or retain GitHub API, App/connector, or browser-session write access. If found, stop remote work and ask the owner to remove/restrict it. User-requested read-only inspection is allowed; push still needs the gate above.
- These repository instructions govern behavior but cannot revoke tool, session, account, or connector capabilities. Actual capability removal is an owner/admin action in the relevant platform/account controls; never claim the repository rule performed it.

### GitHub collaboration and automation

- Changes to `main` use PRs; squash merge and linear history are the defaults. Bootstrap protection requires PRs, resolved conversations, stable CI checks, satisfiable approval settings, and no general required-check bypass.
- The public repository belongs to `@Donny-Guo`; MIT is confirmed. The tracked root `LICENSE` notice conflicts with D-23: preserve it until F-08 aligns and verifies it in a reviewable governance change.
- `CODEOWNERS` assigns `@Donny-Guo` to workflows, auth/security boundaries, migrations, and agent/tool code. When eligible reviewers exist, require one non-author approval and owned-path approval.
- Enable at most one advisory AI reviewer initially. Request it manually only after a PR is ready, deterministic CI passes, and self-review completes; never auto-review drafts, every PR, or every push. Re-request only after material risk-bearing changes. Evaluate three representative PRs and record useful findings, false positives, misses, and latency before changing policy. AI comments never satisfy human approval or block merge; deterministic CI is authoritative.
- Do not overlap AI reviewers. Consider one replacement only if the current reviewer is unavailable or measured value is insufficient, after a separate permission/data-handling/retention/availability/cost review. Manually inspect changes to AI/agent instructions.
- Root Husky hooks: `pre-commit` runs lint-staged formatting/linting only on staged files; `commit-msg` runs commitlint with Conventional Commits. Hooks support partial staging and never run network calls, database work, full builds, or the full test suite. They are bypassable feedback, not merge/security authority; CI repeats required invariants and validates the PR title used by squash merge.
- PR CI uses GitHub-hosted ephemeral runners on `pull_request`; trusted post-merge checks run on pushes to `main`; add `merge_group` only with merge queue. Never run untrusted PR code via `pull_request_target`, expose repository/environment secrets to forks, or feed untrusted caches into trusted release jobs.
- Pin third-party Actions to full immutable SHAs with readable version comments. Default top-level `GITHUB_TOKEN` to read-only, grant minimum per-job additions, and set explicit timeouts and concurrency cancellation.
- Keep required-check names stable and provide an aggregate result that always reports, including path-filter skips. Review CI changes like production code.
- Dependabot covers pnpm/npm and Actions. For this public repo, enable dependency review, CodeQL/code scanning, secret scanning, and push protection; F-08 must verify current availability and document gaps.
- Self-hosted runners, remote Turbo cache, automatic dependency merging, and privileged GitHub Apps require separate threat-model and trust-boundary review.

## 5. Dependencies, TypeScript, and organization

- Use pnpm only and one root lockfile. Turborepo owns cross-package `lint`, `typecheck`, `test`, and `build`; start with local cache. Remote cache requires separate environment-variable and sensitive-log review.
- Use the workspace protocol internally. Pin Node.js, pnpm, and critical frameworks in root config and validate them in CI. Explain runtime dependencies; prefer the standard library or existing packages.
- Keep version upgrades separate from features and document migration/rollback impact. No unapproved preview/canary production features.
- Enable strict TypeScript. Avoid unjustified `any`, non-null assertions, and broad casts; validate all external input at runtime.
- Organize by business capability. Keep controllers/pages/components thin and business rules independently testable. Use explicit domain names and meaningful boolean prefixes; minimize exports, circular dependencies, and cross-boundary deep imports. Comments explain reasons, constraints, or risks.

## 6. Web: Next.js and MUI v6

- Use App Router with `src/app` for routes and `src/features` for capabilities. Prefer Server Components; use Client Components only for browser APIs, interactive state, or client-side forms.
- MUI is the default. Use theme tokens and deliberate wrappers/`sx`; configure official App Router SSR caching; avoid hydration/style flashes and scattered magic values.
- Form/schema code owns validation; MUI fields present it. Client validation gives immediate feedback, while the API repeats validation and remains authoritative. Associate fields/help text, make submission errors focusable or announced, and never rely on color alone.
- Navigation uses semantic links and supports keyboard access, active routes, mobile layouts, future permission filtering, and feature flags.
- Read the API base URL from validated environment configuration; components do not assemble URLs. Browser calls use relative same-origin `/api/v1`; Server Components use a server-only internal API origin, forward incoming cookies explicitly when needed, and never expose that origin to the client bundle.
- Authentication uses same-origin HttpOnly cookies; never put access/refresh tokens or session IDs in Web Storage.
- Protect `(app)` in a server layout by calling no-store `/auth/me` before private rendering. Sanitize same-origin return paths, distinguish `401` from API outage, and prevent redirect loops.
- Initial UI copy is English and comes from stable keys in a centralized catalog, including validation/navigation. Use locale-aware date/time/number/currency formatters. Establish only an i18n-ready boundary in this slice; no locale router/switcher. The first later locale includes at least `zh-CN`.

## 7. API: NestJS

- Organize domain modules such as `AuthModule`, `UsersModule`, and later `AgentModule`; no catch-all module. Controllers own transport, services/use cases own business rules, and repositories own persistence.
- External DTOs are concrete classes. Configure a global `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, and `transform` as planned.
- Use stable success/error contracts and machine-readable codes with semantic HTTP statuses. Never return ORM entities, password hashes, internal exceptions, SQL details, or stacks.
- Validate configuration at startup and fail fast on missing critical values. Version routes under `/api/v1`.
- JSON endpoints accept JSON only, reject unsupported media types/unknown fields, and enforce explicit body limits. Validation and logs never echo passwords.
- Mark auth and user-specific responses `Cache-Control: no-store`; gateways/CDNs never cache responses with `Set-Cookie` or private user data.
- Once Swagger/OpenAPI is the REST source, regenerate clients and enforce drift checks for contract changes.
- Separate liveness from dependency-aware readiness, enable graceful shutdown, and use structured logs with request/correlation IDs.

## 8. Authentication and security

- Trim email surroundings, normalize to lowercase ASCII, cap at 254 characters, and enforce canonical storage plus uniqueness in PostgreSQL. Internationalized local parts/domains need a later explicit policy.
- Password creation accepts exactly 8-20 ASCII characters from `A-Z`, `a-z`, `0-9`, `$#@%`, with at least one uppercase, lowercase, digit, and `$#@%`. Never trim/rewrite passwords. Permit paste/autofill; show a concise pre-submit checklist and specific post-validation errors.
- Keep rules in one testable `PasswordPolicy` boundary shared by intent, not by importing a Nest runtime DTO into Web; never duplicate regexes across components/controllers. Login does not reapply current creation composition rules: verify the stored user's submitted value unchanged.
- Relaxing length/characters later changes policy, UI copy, contract, and boundary tests but not the user table. A stricter policy affects new/reset passwords unless a separately approved re-enrollment plan says otherwise.
- Reject known common/compromised whole passwords with a pinned, licensed, checksummed, local server-side blocklist. Document source, update cadence, and fail-closed creation behavior; never send a candidate or derived hash to a remote lookup.
- Store only salted Argon2id hashes. Parameters meet the then-current OWASP floor and are benchmarked in the target runtime. Never store plaintext/reversible encryption or log passwords/hashes. Any pepper stays outside PostgreSQL in managed secrets.
- Database uniqueness is the concurrent duplicate-registration boundary; a precheck is only UX.
- Unknown-email and wrong-password login return identical `INVALID_CREDENTIALS`. The unknown-account path performs one verification against a fixed dummy Argon2id hash. Tests assert dummy execution and matching public shapes, never exact timing. Apply a generous login transport cap independent of creation policy.
- Never return `passwordHash`; ordinary queries do not select it by default.
- Sign first-slice access JWTs only with allowlisted `HS256` and a deployment-provided secret of at least 256 bits. TTL is 15 minutes; `sub` is User UUID; `iss=trip-api`; `aud=trip-web`; `iat` and `exp` are required; clock tolerance is at most 30 seconds. Validate signature, algorithm, issuer, audience, expiry, and required claims. Secrets never enter the repo; rotation/previous-key overlap need a runbook before public release.
- Production cookie: `__Host-trip_access`, `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, no `Domain`, `Max-Age=900`. Local HTTP development only: visibly distinct `trip_access_dev`, `Secure=false`, same TTL. Logout sends `Max-Age=0` with the identical name/path/security tuple.
- Sign-up and login share one token-issuance boundary. Successful sign-up creates a real session and redirects to Dashboard.
- In the first browser-only same-origin slice, every unsafe method is JSON-only and requires an exact trusted `Origin`; accept a valid same-origin `Referer` only as fallback, and reject missing/`null` provenance. Use Fetch Metadata as defense in depth and never mutate through `GET`. `__Host-`/SameSite/origin is the accepted narrow-topology CSRF baseline; add a synchronizer or signed double-submit token before the first unrelated protected business mutation, or earlier if topology broadens.
- Provide `/auth/me` and logout; logout clears the cookie. Refresh, rotation, revocation, and Redis come later, so stolen access tokens remain active until short expiry.
- All auth and `/auth/me` responses are no-store; shared caches never store `Set-Cookie` or authenticated content.
- Before any public/shared release, add Redis-backed distributed rate limits, security headers, safe audit events, proxy-trust validation, and tested outage behavior. Local-slice completion is not release approval. Use explicit CORS allowlists; never combine credentialed production requests with wildcard origins.

## 9. PostgreSQL and pgvector

- TypeORM is approved. Every schema change uses a reviewable, forward-compatible migration; production `synchronize` is always off. Use consistent table/column/index naming and UTC `timestamptz`.
- `users` has UUID IDs, canonical unique email, `created_at`, and `updated_at`. Enforce trimmed lowercase ASCII email (maximum 254) with a database check and unique constraint; application prechecks are not race safety.
- The first migration has no email-verification, account-status, or role fields. Add them by forward migration only after workflow/authorization semantics are approved.
- Plan locks, backfills, repair/rollback paths, and zero-downtime compatibility windows.
- Distinguish a pgvector-capable image from an enabled `vector` extension. A privileged provisioner owns extensions/roles; application startup and the runtime role never execute `CREATE EXTENSION`. Local bootstrap enables/verifies it; production does so only before an approved vector migration.
- Separate provisioner, migrator, and runtime roles: the migrator owns approved DDL; runtime gets only required DML. Run migrations as an explicit deployment job, never implicitly at application startup.
- Before vector columns, an ADR jointly decides dimension, distance function, index type, embedding model/version, and re-embedding strategy. Do not create unused vector tables/indexes.
- Repository integration tests use real PostgreSQL, not an in-memory substitute.

## 10. LangGraph agents and tools

- Start TypeScript `@langchain/langgraph` in `apps/api/src/modules/agent`; extraction requires an ADR. Graphs, model credentials, and privileged tools stay backend-only; Web may later consume streams but never run graphs, hold model keys, or bypass NestJS auth.
- Explicitly type graph state, node inputs/outputs, routing, and termination. Tools use strict input schemas, timeouts, cancellation, bounded retries, and stable errors.
- Side-effecting tools are idempotent or use idempotency keys and compensation; never retry without a bound. Validate/normalize untrusted provider responses before the domain layer.
- Separate system instructions, user content, and tool results. Carry `userId`, `threadId`, `runId`, and correlation ID; logs/traces omit secrets and full private data.
- Define persistence, streaming, human-in-the-loop, and recovery before implementation; do not rely only on process memory.
- Releases require deterministic unit tests, recorded/mocked tool-contract tests, and an independent evaluation set; manual chat is insufficient.

## 11. Local development, CI, and deployment

- Keep Next.js and NestJS independently buildable, deployable, scalable, and reversible. Run them on the host through pnpm/Turbo for the default inner loop; run fixed-version PostgreSQL/pgvector containers. Add Redis/mail capture only when required.
- CI runs application tasks on the runner with isolated ephemeral PostgreSQL/pgvector; tests never depend on developer volumes. Use a versioned standard GitHub-hosted Ubuntu runner. Lightweight runners may host short docs/metadata jobs only after verifying CPU/timeouts/features; do not put routine Node checks in Alpine merely for appearance.
- After the first local vertical slice is stable, add separate multi-stage non-root OCI images and a full-stack container smoke test. Prefer managed production data services; never bind state to application-container lifecycles.
- Evaluate base images with evidence, starting from pinned LTS Debian slim. Accept Alpine only if musl, native addons, multi-architecture, security-update latency, build/start time, and smoke tests show net benefit; size alone is insufficient.
- Optimize with a small context, stable layers, multi-stage output, filtered monorepo artifacts, frozen installs, `pnpm fetch` or BuildKit cache mounts, and strict trusted/untrusted cache separation. Pin release base/service images by digest.
- CD stays disabled until R-09 approves target, registry, environments, migration policy, observability, and rollback evidence. Then build each image once from a trusted commit and promote the same digest through protected `staging` and `production` environments.
- Deployment uses OIDC, not long-lived cloud credentials. Production requires an eligible non-self reviewer, branch/tag restrictions, serialized deployments, a separately controlled migration job, provenance/SBOM, smoke checks, and rollback to a verified digest.
- Keep the browser production entry same-origin: `https://<host>/` and `/api/v1` routed by gateway/ingress/reverse proxy to NestJS. Next.js proxy/middleware never replaces NestJS guards.
- A future mobile/partner domain needs separate CORS, token transport, rate limiting, and client-identity design; never widen the browser-cookie domain.
- Use an explicit local same-origin proxy and restrict direct API ports to approved development origins. Route only `/api/v1/*` to NestJS. Configure trusted proxy hops before relying on forwarded IP/protocol for cookies, redirects, logs, or limits.

## 12. Tests, documentation, and completion

Minimum coverage:

- Unit: validation schemas, `PasswordPolicy`, domain rules, services, error mapping, and agent routing.
- Integration: NestJS with real PostgreSQL, migrations, repositories, and auth endpoints.
- Component: form states, accessible errors, API-error mapping, and responsive navigation.
- E2E: sign-up auto-login, duplicate registration, restore, logout/login, invalid credentials, protected routes, and primary navigation.
- Security contracts: cookie set/delete parity, exact Origin/Referer, JSON/body limits, no-store, gateway private-response behavior, JWT claims/expiry, dummy-hash path, and sensitive-value redaction.

Before merge, pass documentation-policy checks, dependency review, lint, typecheck, unit/integration tests, production builds, applicable E2E, and available CodeQL/secret-scanning gates. Tests are order-independent and use neither real third-party APIs nor shared production data. Hooks never substitute for CI.

Documentation duties:

- Update `README.md` and `.env.example` for environment variables, ports, commands, or local dependencies; OpenAPI and `docs/api` for contracts/error codes; and migration notes for data-model changes.
- Add ADRs for consequential service-boundary, ORM, auth-storage, agent-placement, or deployment-topology changes.
- Update `PLANS.md` for scope/status. Update derived `ISSUES.md` for order, dependencies, issue scope, PR boundaries, or acceptance evidence.
- CI compares IDs/statuses across English docs and existing followers, validates local Markdown links, and rejects Han characters in authoritative English except required technical values.

Done means every acceptance criterion has evidence; relevant tests and lint/typecheck/build pass; required GitHub checks, reviews, owned-file approvals, and conversations are complete; security/privacy/accessibility/failure paths are reviewed; automation reviews cover dependencies, permissions, secret exposure, cache trust, and provenance; contracts/migrations/environment/docs agree; followers are synchronized or explicitly pending with reason; and there are no hidden TODOs, hard-coded secrets, skipped tests, or unexplained out-of-scope changes.
