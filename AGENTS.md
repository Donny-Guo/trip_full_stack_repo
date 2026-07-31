# AGENTS.md

This file defines the working rules for AI agents and engineering contributors in this repository. It applies to the repository root and every subdirectory. If a more specific `AGENTS.md` is added later, the file closest to the target path takes precedence.

Chinese translation: [`AGENTS_ZH.md`](./AGENTS_ZH.md). This English file is authoritative.

## 1. Project objective and current state

Build a production-oriented, full-stack travel agent application with:

- A pnpm workspace monorepo and Turborepo task orchestration with local caching.
- Web: Next.js App Router, TypeScript, and Material UI v6.
- API: NestJS, TypeScript, and REST.
- Agent runtime: TypeScript LangGraph, initially inside the API with a boundary that can be extracted later.
- Data: PostgreSQL with pgvector available for future vector workloads.
- Initial authentication slice: a short-lived access JWT in a same-origin HttpOnly cookie; refresh tokens, Redis-backed revocation, and rotation come later.
- Later capabilities: Swagger/OpenAPI, Redis, observability, agent persistence, and travel-provider integrations.

The repository is still in the planning stage. Decisions D-01 through D-24 are confirmed, but implementation has not been authorized. Until the user separately asks to start implementation, do not create scaffolding, application source files, dependencies, lockfiles, license artifacts, migrations, GitHub automation, hooks, or infrastructure configuration.

On 2026-07-30, the user authorized only the remote creation of `ISSUE-001` through `ISSUE-027` and their scoped issue metadata. Those issues now exist, but `P-02`/`ISSUE-001` remains blocked and no implementation authority follows from issue creation. The repository is public; do not change its visibility without a separate explicit request.

## 2. Instruction, fact, and documentation authority

Apply instructions in this order:

1. The user's current explicit request.
2. This file and any more specific descendant `AGENTS.md`.
3. The approved `PLANS.md` and architecture decision records.
4. `ISSUES.md`, as the implementation packaging derived from `PLANS.md`; it may add review detail or stricter sequencing but may not override the plan.
5. `README.md` and other project documentation.

For claims about an implemented system, current code, migrations, tests, and verified runtime behavior are evidence. If they disagree with documentation, do not guess or silently preserve stale prose: report the mismatch and update the affected authoritative documents in the same change, or request a decision.

Documentation language rules:

- Primary project documentation is written in English and uses unsuffixed names such as `README.md`, `PLANS.md`, `ISSUES.md`, and `AGENTS.md`.
- A Simplified Chinese follower may use the matching `_ZH.md` name. It must identify the English file as authoritative.
- When an English document changes materially, update its `_ZH` follower in the same change when that follower exists. Decision IDs, task IDs, status, scope, paths, commands, and acceptance criteria must stay aligned.
- If translations conflict, the English document controls. Fix the Chinese follower rather than maintaining two interpretations.
- Code identifiers, API names, schema names, ADRs, operational runbooks, commit-facing technical language, and primary user-interface copy are English unless a later localization task explicitly says otherwise.
- Public repository content may identify `@Donny-Guo` as the repository owner, assignee, `CODEOWNERS` identity, or copyright name. Do not record account plans or tiers, eligibility or subscription status, billing or usage allowances, maintainer-count profiles, or other private account metadata.

## 3. Planned repository boundaries

```text
.github/
  workflows/             # PR CI/security first; deployment only after R-09 approval
  CODEOWNERS
  dependabot.yml
  PULL_REQUEST_TEMPLATE.md
  ISSUE_TEMPLATE/
.husky/                  # Root pre-commit and commit-msg hooks once implementation begins
apps/
  web/                  # Next.js web application
  api/                  # NestJS API; receives the agent boundary only when agent work begins
packages/
  api-client/           # Generated from OpenAPI; generated files are not maintained manually
  config-eslint/        # Shared ESLint configuration
  config-typescript/    # Shared TypeScript configuration
  test-utils/           # Create only after real cross-application reuse exists
infra/
  docker/               # Local dependency services and later image-related configuration
docs/
  adr/                  # Important, hard-to-reverse architecture decisions
  api/                  # API conventions and error-code documentation
  agent/                # Agent graphs, tool contracts, evaluations, and safety guidance
AGENTS.md
AGENTS_ZH.md
CONTRIBUTING.md
ISSUES.md               # Ordered issue drafts derived from PLANS.md
ISSUES_ZH.md
LICENSE                  # Standard MIT text; changes require explicit owner authorization
PLANS.md
PLANS_ZH.md
README.md
README_ZH.md
SECURITY.md
```

Boundary rules:

- `apps/web` must not access PostgreSQL, Redis, model providers, or privileged agent tools directly.
- `apps/api` is the authority for business rules, authentication, authorization, and data access.
- Web and API must not import one another's source through relative paths.
- Cross-application contracts should come from generated OpenAPI artifacts once available; do not maintain duplicate request and response models that can drift.
- Extract a shared package only after at least two real consumers exist. Do not create speculative `common` or `utils` dumping grounds.
- Do not scaffold an empty `AgentModule`, vector table, or generated API client in the authentication slice. Create each boundary with its first real use case.
- LangGraph nodes must not depend directly on HTTP controllers. They call business capabilities through ports or services owned by the agent module.

## 4. Engineering workflow

For each change:

1. Read the applicable rules and the approved plan.
2. Inspect worktree state and preserve unrelated user changes.
3. Confirm acceptance criteria, dependencies, and non-goals.
4. Deliver the smallest useful vertical slice before broad abstractions.
5. Run checks proportional to the change's risk.
6. Keep contracts, migrations, environment examples, and documentation synchronized.
7. Report changed files, verification evidence, residual risks, and unresolved decisions.

Without explicit authorization, do not:

- Replace or upgrade the framework, package manager, ORM, authentication approach, or deployment platform.
- Write real secrets, commit `.env`, or log passwords, tokens, model prompts, or private tool results.
- Perform destructive database operations, rewrite Git history, or overwrite user changes.
- Place temporary mocks, hard-coded users, or authentication bypasses on a production path.

### GitHub collaboration and automation

- GitHub is the source-control and automation platform. Changes to `main` go through pull requests; squash merge and linear history are the default.
- The public repository is owned by `@Donny-Guo`. MIT is the confirmed license choice, and the root license artifact is created only through an authorized repository-governance change. During bootstrap, require pull requests, resolved conversations, and stable CI checks. Approval settings must remain satisfiable and must never permit a general bypass of required checks.
- `CODEOWNERS` assigns `@Donny-Guo` to `.github/workflows/`, authentication/security boundaries, database migrations, and agent/tool code. Require at least one non-author approval and owned-path approval whenever eligible reviewers are available.
- At most one advisory AI reviewer may be enabled initially. Request review manually only after a pull request is ready, deterministic CI passes, and self-review is complete; do not automatically review drafts, every pull request, or every push. Re-request only after material risk-bearing changes. Evaluate it on three representative pull requests and record useful findings, false positives, misses, and latency before revising the policy. AI-review comments never satisfy a human-approval requirement and are not merge-required; deterministic CI remains authoritative.
- Do not enable overlapping AI reviewers during the evaluation. Consider a single replacement only if the current reviewer is unavailable or measured value is insufficient, after a separate permission, data-handling, retention, availability, and cost review. Manually inspect any change to AI/agent instructions because review instructions can be modified in the pull-request branch.
- Root Git hooks use Husky. `pre-commit` runs lint-staged formatting and linting only on staged files; `commit-msg` runs commitlint with Conventional Commits. Hooks must support partial staging and must not run network calls, database work, full builds, or the full test suite.
- Local hooks are bypassable convenience checks, never the merge or security authority. CI repeats every required invariant and validates the pull-request title because squash merge makes that title part of `main` history.
- Pull-request CI uses GitHub-hosted ephemeral runners by default and runs on `pull_request`; trusted post-merge verification runs on pushes to `main`; add `merge_group` when merge queue is enabled. Never execute untrusted pull-request code with `pull_request_target`, expose repository/environment secrets to forked code, or let an untrusted cache feed a trusted release job.
- Pin third-party GitHub Actions to full commit SHAs with human-readable version comments. Give workflows read-only top-level `GITHUB_TOKEN` permissions and grant the minimum extra permission per job. Set explicit timeouts and concurrency cancellation.
- Keep required check names stable and provide an aggregate required result that always reports, including when path filters skip work. CI configuration changes receive the same review rigor as production code.
- Use Dependabot for both the pnpm/npm and GitHub Actions ecosystems. For this public repository, enable dependency review, CodeQL/code scanning, secret scanning, and push protection; verify current availability during F-08 and document any unavailable control.
- Self-hosted runners, remote Turbo cache, automatic dependency merging, and privileged GitHub Apps require separate threat-model and trust-boundary review.

## 5. Dependency and version policy

- Use pnpm only; the root lockfile is the sole dependency lockfile.
- Use Turborepo for cross-package `lint`, `typecheck`, `test`, and `build` task graphs. Start with local cache only; remote cache requires a separate environment-variable and sensitive-log review.
- Use the workspace protocol for internal packages.
- Pin Node.js, pnpm, and critical framework versions in root configuration and validate them in CI.
- Pin third-party Actions by immutable full SHA; let Dependabot propose reviewed updates for both package and workflow dependencies.
- Explain every new runtime dependency. Prefer the standard library or an existing dependency where suitable.
- Keep version upgrades separate from feature work and document migration and rollback impact.
- Do not place unapproved preview or canary features on the production path.

## 6. TypeScript and code organization

- Enable strict type checking. Avoid unjustified `any`, non-null assertions, and broad casts.
- Validate external input at runtime; TypeScript types are not runtime validation.
- Organize files and modules by business capability, not by cross-project controller/service/helper buckets.
- Keep controllers, pages, and components thin. Put business rules in independently testable services or use cases.
- Use explicit domain names. Prefix booleans with `is`, `has`, `can`, or another meaningful predicate.
- Minimize exports, prevent circular dependencies, and avoid deep imports across module boundaries.
- Comments explain reasons, constraints, or risks rather than restating code.

## 7. Web rules: Next.js and MUI v6

- Use App Router and a `src/` directory. Routes live in `src/app`; business capabilities live in `src/features`.
- Prefer Server Components. Add a Client Component only for browser APIs, interactive state, or client-side forms.
- MUI is the default component library. Use theme tokens and deliberate component wrappers or `sx`; avoid scattered magic colors and dimensions.
- Configure MUI's official App Router SSR cache integration to prevent hydration mismatches and style flashes.
- MUI `TextField` and related controls present validation state; a form/schema layer owns validation rules.
- Client validation provides immediate feedback. The API repeats all validation and remains authoritative.
- Make errors accessible: associate fields and helper text, make submission errors focusable or announced, and never rely on color alone.
- Navigation uses semantic links and supports keyboard access, active-route state, mobile layouts, future permission filtering, and feature flags.
- Read the API base URL from validated environment configuration. Components must not assemble endpoint URLs ad hoc.
- Browser requests use relative same-origin `/api/v1` URLs. Server Components use a server-only internal API origin, explicitly forward the incoming cookie when required, and never expose that origin to the client bundle.
- Browser authentication uses same-origin HttpOnly cookies. Never store access tokens, refresh tokens, or session IDs in Web Storage.
- Protect the `(app)` route group in a server-side layout by calling `/auth/me` with explicit no-store semantics before rendering private content. Sanitize same-origin return paths, distinguish `401` from API outage, and prevent login redirect loops.
- The first UI release is English. User-visible copy, validation messages, and navigation labels must come from stable message keys and a centralized English catalog rather than hard-coded component strings.
- Use locale-aware date, time, number, and currency formatters. The first later locale is at least Simplified Chinese (`zh-CN`).
- The first slice creates an i18n-ready boundary only; it does not add a locale router or language switcher.

## 8. API rules: NestJS

- Organize by domain modules such as `AuthModule`, `UsersModule`, and `AgentModule`; avoid a global catch-all module.
- Controllers own transport concerns, services/use cases own business logic, and repositories own persistence.
- External DTOs use concrete classes and a global ValidationPipe with planned `whitelist`, `forbidNonWhitelisted`, and `transform` settings.
- Use a stable success/error contract and machine-readable error codes. HTTP status codes must preserve their semantics.
- Never return ORM entities, password hashes, internal exceptions, SQL details, or stack traces.
- Validate configuration at startup and fail fast when critical values are absent.
- Version API routes under `/api/v1`.
- Accept JSON only on JSON endpoints, reject unsupported media types and unknown fields, and set explicit request-body limits. Validation and logs must never echo password input.
- Mark authentication and user-specific responses `Cache-Control: no-store`; a gateway or CDN must never cache a response that contains `Set-Cookie` or private user data.
- Once Swagger/OpenAPI is the REST contract source, contract changes must regenerate the client and pass drift checks.
- Separate liveness from dependency-aware readiness, enable graceful shutdown, and use structured logs with request/correlation IDs.

## 9. Authentication and security

- Trim surrounding whitespace from email input, normalize it to the approved lowercase policy, and enforce the canonical stored form and uniqueness in PostgreSQL. The first slice accepts ASCII email addresses only; internationalized local parts and domains require an explicit later policy.
- The confirmed initial password policy applies to sign-up and future password creation/change flows: 8–20 ASCII characters, limited to `A-Z`, `a-z`, `0-9`, `$`, `#`, `@`, and `%`; require at least one uppercase letter, one lowercase letter, one digit, and one of `$#@%`. Never trim or otherwise rewrite a password.
- Permit paste and password-manager autofill. Show a concise checklist before submission and specific field errors after validation.
- Keep password rules in one testable `PasswordPolicy` boundary shared by intent, not by importing a Nest runtime DTO into Web. Do not duplicate regexes across components and controllers.
- Login must not reapply the current sign-up composition policy. It accepts the stored user's password input and verifies the hash, so later policy changes do not lock out existing users.
- Relaxing length or allowed characters later requires policy, UI-copy, contract, and boundary-test changes, but no user-table migration. A stricter future policy applies to new/reset passwords unless a separately approved re-enrollment plan says otherwise.
- Reject known common or compromised whole passwords through a pinned, licensed, checksummed, local server-side blocklist and return an actionable, non-sensitive error. Document its source, update cadence, and fail-closed behavior for password creation; never send a candidate password or derived hash to a remote lookup service.
- Store only salted Argon2id hashes. Parameters must meet the then-current OWASP floor and be benchmarked in the target runtime. Never use plaintext or reversible encryption and never log passwords or hashes. An optional pepper belongs outside PostgreSQL in a managed secret system.
- Handle concurrent duplicate registration through the database unique constraint, not only a pre-insert lookup.
- Login returns the same external `INVALID_CREDENTIALS` response for an unknown email and a wrong password to reduce account enumeration.
- The unknown-account path performs one verification against a fixed dummy Argon2id hash so both paths do comparable expensive work. Do not assert exact timing in tests; test that the dummy path executes and that public shapes match. Apply a generous login transport cap, independent of the password-creation policy, to bound resource use.
- Never return `passwordHash`; ordinary queries must not select it by default.
- The first slice signs access JWTs with allowlisted `HS256` using at least 256 bits of secret material supplied by the deployment secret store. The lifetime is 15 minutes; `sub` is the User UUID, `iss` is `trip-api`, `aud` is `trip-web`, `iat` and `exp` are required, and clock tolerance is at most 30 seconds. Rotation and previous-key overlap require a runbook before public release.
- Production uses `__Host-trip_access` with `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, no `Domain`, and `Max-Age=900`. Local HTTP uses the visibly distinct `trip_access_dev` name with `Secure=false` only in the development configuration and the same 900-second lifetime. Logout sends `Max-Age=0` with the same cookie name/path/security tuple.
- Sign-up and login reuse one token-issuance boundary. Successful sign-up creates a real authenticated session and redirects to Dashboard.
- For the first browser-only, same-origin authentication slice, every unsafe method is JSON-only and must match an exact trusted `Origin`; a valid same-origin `Referer` is the fallback, and missing/`null` provenance is rejected. Use Fetch Metadata as defense in depth when present and never mutate state through `GET`. Under this narrow topology, the `__Host-`/SameSite/origin controls are the accepted CSRF baseline; add a synchronizer token or signed double-submit token before the first protected state-changing business endpoint unrelated to authentication, or earlier if the topology broadens.
- The first slice provides current-user and logout endpoints. Logout clears the cookie. Refresh rotation, server-side revocation, and Redis come later, so a stolen access token cannot be actively revoked before expiry; keep its TTL short.
- Validate JWT signature, allowed algorithm, `iss`, `aud`, `exp`, and other required claims. Secrets come from controlled configuration and never enter the repository.
- All authentication and `/auth/me` responses use `Cache-Control: no-store`; shared caches must not store responses with `Set-Cookie` or authenticated content.
- Before any public or shared-environment release, authentication endpoints require Redis-backed distributed rate limits, security headers, safe audit events, proxy-trust validation, and tested outage behavior. Completing the local slice is not public-release approval.
- Use an explicit CORS allowlist; never combine credentialed production requests with wildcard origins.

## 10. Database rules: PostgreSQL and pgvector

- TypeORM is approved. Use reviewable migrations only and keep `synchronize` disabled in production.
- Every schema change uses a reviewable, forward-compatible migration. ORM automatic schema synchronization is forbidden in production.
- Follow a single naming convention for tables, columns, and indexes. Store time as UTC `timestamptz`.
- User IDs are UUIDs. The physical table is `users`; normalized email is unique; include `created_at` and `updated_at`.
- The canonical email is trimmed, lowercased ASCII with a 254-character maximum. Enforce canonical storage with a database check plus a unique constraint; application prechecks improve feedback but are not the race-safety boundary.
- The first migration does not add email verification, account status, or roles. Add them later through forward migrations after their workflow and authorization semantics are approved.
- Consider locks, backfills, rollback/repair paths, and zero-downtime compatibility windows for migrations.
- Distinguish a pgvector-capable image from a database where `CREATE EXTENSION vector` has run. A privileged infrastructure/provisioning role owns extension enablement; application startup and the runtime role never do. Local bootstrap enables and verifies the extension for repeatability, while production enables it only before an approved vector migration.
- Separate database roles: a provisioner may manage extensions/roles, a migrator owns approved DDL, and the runtime application role receives only required DML. Run migrations as an explicit deployment job, not implicitly on every application startup.
- Decide vector dimension, distance function, index type, embedding model/version, and re-embedding strategy together in an ADR before creating vector columns.
- Do not create unused vector tables or indexes only because they may be useful later.
- Repository integration tests use real PostgreSQL, not a behaviorally different in-memory substitute.

## 11. Agent and tool rules: LangGraph

- Start with TypeScript `@langchain/langgraph` under `apps/api/src/modules/agent`; extracting it into another service requires an ADR.
- Graphs, model credentials, and privileged tools run only on the backend. Web may later consume streaming events through a React/SDK client, but it must not run the graph, hold model keys, or bypass NestJS authentication.
- Explicitly type graph state, node inputs/outputs, routing conditions, and termination conditions.
- Tool definitions use strict input schemas, timeouts, cancellation, bounded retries, and stable error types.
- Side-effecting tools must be idempotent or use idempotency keys and compensation; never retry without a bound.
- Treat travel-provider responses as untrusted input and validate and normalize them before they enter the domain layer.
- Separate system instructions, user content, and tool results to reduce prompt-injection and tool-authorization risk.
- Carry `userId`, `threadId`, `runId`, and correlation ID through every run. Logs and traces must not contain secrets or full private data.
- Define persistence, streaming, human-in-the-loop, and long-running recovery semantics before implementation; do not rely only on process memory.
- Agent releases require deterministic unit tests, recorded or mocked tool-contract tests, and an independent evaluation set. Manual chat alone is not acceptance evidence.

## 12. Local development and deployment rules

- Keep Next.js and NestJS independently buildable, deployable, scalable, and reversible.
- The default local inner loop runs Next.js and NestJS on the host through pnpm/Turborepo for fast HMR, debugging, and type feedback.
- Run stateful local infrastructure such as PostgreSQL + pgvector through fixed-version container orchestration. Add Redis and a local mail-capture service only in the phases that need them.
- CI runs application tasks on the runner and starts an isolated, ephemeral PostgreSQL/pgvector service for integration tests; tests must not depend on a developer volume.
- Use a versioned standard GitHub-hosted Ubuntu runner for normal CI; do not put routine Node.js checks inside an Alpine application container merely to make CI appear smaller. A lightweight runner may host short documentation/metadata jobs only after its CPU, timeout, and feature limits are verified.
- After the first local vertical slice is stable, add separate multi-stage, non-root OCI images and a full-stack container smoke test. Prefer managed PostgreSQL/Redis in production and do not bind state data to an application-container lifecycle.
- Select application base images with evidence. Start evaluation from a pinned LTS Debian slim image because native dependencies and `glibc` compatibility are less surprising; accept Alpine only after `musl`, native-addon, multi-architecture, security-update latency, build-time, startup, and smoke tests prove a net benefit. Small size alone is not acceptance.
- Optimize container builds through a small build context, stable layer order, multi-stage output, filtered monorepo artifacts, frozen installs, `pnpm fetch` or BuildKit cache mounts, and strict trusted/untrusted cache separation. Pin base and service images by digest for releases.
- Continuous deployment stays disabled until R-09 has an approved target, registry, environments, migration policy, observability, and rollback evidence. When enabled, a trusted commit builds each image once; the same immutable digest is promoted through protected `staging` and `production` GitHub Environments.
- Deployment jobs use OIDC federation instead of long-lived cloud credentials. Production requires an eligible reviewer with self-review disabled, environment-specific branch/tag restrictions, serialized deployments, a separately controlled migration job, provenance/SBOM evidence, smoke checks, and rollback to a previously verified digest.
- Keep the browser's production entry point same-origin: pages at `https://<host>/` and API routes at `/api/v1`, routed by a gateway, ingress, or reverse proxy to NestJS.
- Next.js proxy or middleware may improve user experience but never replaces server authorization; NestJS guards are the final API boundary.
- A future mobile or partner API domain needs separate CORS, token transport, rate limiting, and client-identity design. Do not widen the browser cookie domain.
- Use an explicit local proxy to simulate same-origin behavior. Any direct API port is restricted to approved development origins.
- Route only `/api/v1/*` to NestJS. Configure trusted proxy hops explicitly before relying on forwarded IP/protocol values for secure cookies, redirects, logs, or rate limits.

## 13. Testing and quality gates

At minimum, cover:

- Unit tests: validation schemas, password-policy boundaries, domain rules, services, error mapping, and agent routing.
- Integration tests: NestJS with real PostgreSQL, migrations, repositories, and authentication endpoints.
- Component tests: form states, accessible errors, API error mapping, and responsive navigation.
- End-to-end tests: automatic sign-in after registration, duplicate registration, session restore, logout, login, invalid credentials, protected routes, and the primary navigation path.
- Security contract tests: cookie set/delete parity, exact Origin/Referer policy, JSON-only/body-size rejection, no-store headers, private-response gateway behavior, JWT claim/expiry handling, dummy-hash login path, and sensitive-value redaction.

Before merge, the planned gates are documentation policy checks, dependency review, lint, type checking, unit/integration tests, production builds, and applicable end-to-end tests. CodeQL and secret-scanning gates apply when available. Tests must not depend on execution order, real third-party APIs, or shared production data. Pre-commit success never substitutes for these CI results.

## 14. Documentation and decision records

- Primary documentation is English. Keep an existing `_ZH.md` follower synchronized in the same change; English wins on conflict.
- Update `README.md` and `.env.example` when environment variables, ports, startup commands, or local dependencies change.
- Update OpenAPI and `docs/api` when API contracts or error codes change.
- Attach migration notes to data-model changes.
- Add an ADR for consequential changes to service boundaries, ORM, authentication storage, agent runtime placement, or deployment topology.
- Update `PLANS.md` when scope or status changes; do not leave completed or superseded plans presented as current.
- Update `ISSUES.md` when implementation order, dependencies, issue scope, pull-request boundaries, or acceptance evidence changes; keep it derived from `PLANS.md`.
- CI must compare decision/task/issue IDs and statuses across English documents and existing `_ZH` followers, validate local Markdown links, and reject Han characters in authoritative English documents except where explicitly required by a technical value.

## 15. Definition of done

A task is complete only when:

- Every acceptance criterion has evidence.
- Relevant tests have been added and pass.
- Lint, type checking, and applicable builds pass.
- Required GitHub checks report success; required reviews and owned-file approvals are complete; conversations are resolved.
- Security, privacy, accessibility, and failure paths have been reviewed.
- Workflow dependencies, permissions, secret exposure, cache trust, and release provenance have been reviewed when automation changes.
- API contracts, migrations, environment examples, and English documentation agree.
- Existing Chinese followers have been synchronized or explicitly marked pending with a reason.
- There are no hidden TODOs, hard-coded secrets, skipped tests, or unexplained out-of-scope modifications.
