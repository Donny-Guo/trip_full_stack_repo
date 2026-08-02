# Trip Agent Full Stack

Production-oriented planning for a full-stack travel agent application. The repository will use a pnpm monorepo to manage a Next.js web application, a NestJS API, LangGraph agent orchestration, and shared engineering configuration, with PostgreSQL + pgvector as the transactional and future vector-data foundation.

Simplified Chinese translation: [`README_ZH.md`](./README_ZH.md). This English file is authoritative.

> Status: **decisions D-01 through D-24 are confirmed, and the first local authentication slice was authorized for implementation on 2026-08-02**. `P-03`/`ISSUE-002` is complete locally and `F-01`/`ISSUE-003` is next. Remote issues [#1–#27](https://github.com/Donny-Guo/trip_full_stack_repo/issues) cover the approved path through the Sign Up and Login pages, but no application scaffolding, automation, hooks, or business code exists yet. A root MIT `LICENSE` predates this authorization and awaits F-08 notice alignment. Production deployment and public exposure remain unauthorized. See [`PLANS.md`](./PLANS.md) for authoritative scope and task status.

The first vertical slice is a milestone composed of several independently reviewable change sets, not a promise that production-quality foundation, API, Web, integration, and quality work all fit into one calendar day.

## Product scope

The first vertical slice focuses on account access and an application shell:

- Email-and-password sign-up.
- Email-and-password login.
- Automatic login after registration through a short-lived access JWT in a same-origin HttpOnly cookie.
- An extensible navigation bar containing Dashboard, Flight Info, and User.
- A PostgreSQL User model.
- NestJS sign-up/login APIs, authoritative input validation, and stable error states.

Agent graphs, travel-provider integration, vector retrieval, Swagger-generated clients, refresh-token rotation/revocation, and Redis remain behind clear boundaries but are not part of the first slice.

## Technology direction

| Area | Planned choice | Rationale |
| --- | --- | --- |
| Monorepo | pnpm workspace | One root lockfile; internal dependencies use the workspace protocol |
| Task orchestration | Turborepo | Cross-package task graph and local cache; remote cache only after CI and sensitive-log review |
| Web | Next.js 15 App Router + TypeScript | Server Components by default; client boundaries only for interaction |
| UI | Material UI v6 | Central theme, official SSR integration, responsive behavior, and accessibility |
| Product language | English first, i18n-ready | Centralized English messages from the first slice; later add at least Simplified Chinese (`zh-CN`) |
| API | NestJS REST + TypeScript | Domain modules, DTO validation, and a stable error contract |
| Agent | LangGraph.js | Initially inside NestJS `AgentModule`, with an extractable boundary |
| Database | PostgreSQL 18 + pgvector | Begin with transactional data and retain vector capability in the same database |
| ORM | TypeORM 0.3.31 | Confirmed compatibility line for the first slice; native vector-column mapping remains unused until an approved vector design; schema sync is disabled in production |
| API contract | Swagger/OpenAPI later | Generate the Web client and prevent contract drift |
| Auth | Email/password + access JWT | JWT in a same-origin HttpOnly cookie; refresh rotation and Redis later |
| Cache/coordination | Redis later | Cache, rate limiting, and short-lived coordination; never the User source of truth |
| Source and automation | GitHub + GitHub Actions | Pull-request CI, repository rulesets, security automation, and later environment-gated delivery |
| Repository license | MIT | Public open-source repository owned by `@Donny-Guo`; the root license artifact uses the standard MIT text and approved notice |
| Local commit checks | Husky + lint-staged + commitlint | Fast staged-file checks and Conventional Commits; CI remains authoritative |
| Tests | Jest + Supertest; Vitest + React Testing Library; Playwright | API unit/integration, Web unit/component, and browser E2E respectively |

P-03 freezes the exact compatible baseline before scaffolding in [`docs/toolchain.md`](./docs/toolchain.md). The owner confirmed Next.js 15 + MUI v6, TypeORM 0.3.31, PostgreSQL 18, and the listed test stack on 2026-08-02. Because MUI v6 is no longer upstream-supported and Next.js 15 is in Maintenance LTS, re-evaluate the pairing by 2026-09-21 or before public exposure, whichever comes first, and immediately upon a critical unpatched security or compatibility blocker. A review does not authorize an upgrade. Do not install floating `latest` or preview releases by default.

## Planned repository structure

The following is the target structure; it does not imply that these files exist today:

```text
.
├── apps/
│   ├── web/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/
│   │   │   │   │   └── sign-up/
│   │   │   │   ├── (app)/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── flight-info/
│   │   │   │   │   └── user/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/       # UI genuinely shared across features
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   └── navigation/
│   │   │   ├── i18n/             # Message keys, English catalog, locale formatters
│   │   │   ├── lib/              # API client and validated environment adapters
│   │   │   └── theme/
│   │   └── tests/
│   └── api/
│       ├── src/
│       │   ├── common/            # Small, explicit filters/guards/interceptors
│       │   ├── config/
│       │   ├── database/
│       │   │   └── migrations/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   └── agent/         # Create later with the first approved Agent use case
│       │   ├── app.module.ts
│       │   └── main.ts
│       └── test/
├── packages/
│   ├── api-client/                # Generated after Swagger/OpenAPI is enabled
│   ├── config-eslint/
│   ├── config-typescript/
│   └── test-utils/                # Create only after real reuse exists
├── infra/
│   └── docker/                    # Local PostgreSQL/pgvector; add Redis later
├── docs/
│   ├── adr/
│   ├── agent/
│   ├── api/
│   ├── toolchain.md                # P-03 version matrix, policy, and Action register
│   └── toolchain_ZH.md             # Simplified Chinese follower
├── .github/
│   ├── workflows/                    # CI/security first; deployment after R-09
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
├── .husky/                           # pre-commit and commit-msg hooks
├── .editorconfig
├── .gitignore
├── .node-version                     # Exact Node line selected by P-03
├── .npmrc                            # pnpm/install policy; never secrets
├── AGENTS.md
├── AGENTS_ZH.md
├── CONTRIBUTING.md
├── ISSUES.md
├── ISSUES_ZH.md
├── LICENSE                            # Existing MIT text; F-08 verifies and aligns the notice
├── PLANS.md
├── PLANS_ZH.md
├── README.md
├── README_ZH.md
├── SECURITY.md
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json
```

### Web boundaries

- `app/` owns routes, layouts, loading/error boundaries, and page composition.
- `features/auth` owns sign-up/login forms, schemas, API adapters, and related tests.
- `features/navigation` owns typed navigation configuration and the responsive app bar.
- Global `components/` contains only components shared across real features.
- The browser reaches NestJS through same-origin `/api/v1`; it never connects directly to PostgreSQL, Redis, an LLM, or an internal agent runtime.

### API boundaries

- `AuthModule` owns credential validation, password hashing, the first access-JWT boundary, and future token lifecycle work.
- `UsersModule` owns the User domain and persistence; it never exposes password hashes.
- A future `AgentModule` owns LangGraph orchestration. Do not create an empty module in the authentication slice; travel providers enter through tool adapters rather than controllers when the first use case is approved.
- `database/migrations` is the schema-history authority; production does not use automatic schema synchronization.

## Initial API contract draft

The planned base prefix is `/api/v1`:

| Method | Path | Success | Main failures |
| --- | --- | --- | --- |
| POST | `/auth/sign-up` | `201`; set access cookie and return a safe User summary; user is automatically logged in | `400 VALIDATION_ERROR`, `409 EMAIL_ALREADY_EXISTS` |
| POST | `/auth/login` | `200`; set access cookie and return a safe User summary | `400 VALIDATION_ERROR`, `401 INVALID_CREDENTIALS` |
| GET | `/auth/me` | `200`; return the current safe User summary | `401 UNAUTHENTICATED` |
| POST | `/auth/logout` | Idempotent `204`; clear the access cookie even when absent or invalid | No business body; still apply Origin/CSRF checks |

Every error response carries a stable machine-readable `code`, a safe English fallback `message`, a `requestId`, and optional `fieldErrors: Record<string, string[]>` containing stable codes. The Web maps codes through its catalog rather than treating API prose as localization. Successful auth responses use a stable `messageCode` and return only the safe User fields `id`, `email`, `createdAt`, and `updatedAt`. Unknown email and wrong password deliberately map to the same `INVALID_CREDENTIALS` response to reduce account enumeration.

The first-slice access JWT uses allowlisted `HS256`, at least 256 bits of deployment-managed secret material, a 15-minute TTL, User UUID `sub`, `iss=trip-api`, `aud=trip-web`, required issued-at/expiry, and at most 30 seconds of clock tolerance. Production sets `__Host-trip_access` with `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, no `Domain`, and `Max-Age=900`; local HTTP uses the distinct `trip_access_dev` name with the same lifetime. It never enters Web Storage. Logout sends `Max-Age=0` with the same cookie tuple but cannot invalidate a stolen access JWT before expiry because refresh tokens and server revocation come later.

Unsafe auth requests are JSON-only and require an exact trusted `Origin`, with a same-origin `Referer` fallback; missing or `null` browser provenance is rejected. This is the accepted CSRF baseline for the narrow browser-only, same-origin first slice. Add a synchronizer or signed double-submit token before the first protected business mutation, or earlier if the topology broadens. Auth and user-specific responses are `Cache-Control: no-store`, and gateways must not cache `Set-Cookie` or private responses.

## User model draft

| Field | Planned type | Constraints |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `email` | varchar(254) | Required canonical lowercased ASCII value; database check + unique constraint |
| `password_hash` | text | Required and never returned by the API |
| `created_at` | timestamptz | Required with database default |
| `updated_at` | timestamptz | Required with one consistent update strategy |

The first migration deliberately excludes `email_verified_at`, account `status`, roles, and a full user profile. Those capabilities have sequenced follow-up tasks and will be introduced through forward migrations only after their workflows and authorization semantics are approved.

## Input and error experience

- MUI `TextField` presents input, errors, and helper text; the form schema owns immediate validation and NestJS remains authoritative.
- Email is required, trimmed around the edges, lowercased, limited to 254 characters, and validated as an ASCII email structure. Internationalized email is a later explicit product decision. Avoid a hand-written regex that attempts full RFC coverage.
- The confirmed first password policy is 8–20 ASCII characters from `A-Z`, `a-z`, `0-9`, `$`, `#`, `@`, and `%`, with at least one uppercase letter, one lowercase letter, one digit, and one character from `$#@%`.
- Passwords are never trimmed. Paste and password-manager autofill remain enabled. The UI shows one concise requirements checklist rather than revealing failures one submit at a time.
- The server also rejects maintained common/compromised whole passwords and stores only a benchmarked Argon2id hash.
- This composition policy is a product-selected first iteration, not the entire security boundary. It is isolated behind `PasswordPolicy` so a later increase to 64/128 characters or a broader character set changes validation, messages, contracts, and boundary tests without changing the User table.
- Login never reapplies current registration policy; it verifies the submitted value against the stored hash. Existing users therefore remain able to log in after a policy change.
- Login still has a generous transport-only cap (planned at 1,024 bytes) to bound parsing and hashing work. Unknown-user login performs a dummy Argon2id verification so its expensive path is comparable to a wrong-password attempt; the external response remains identical.
- Field errors appear next to the relevant field. Business errors use a form-level alert and preserve the email input.
- Registration success feedback comes from a real successful API response, after which the user enters Dashboard with the cookie-backed session.
- Submissions show loading state, prevent duplicates, and recover to an actionable state after failure.

## Navigation draft

| Label | Route | First-slice behavior |
| --- | --- | --- |
| Dashboard | `/dashboard` | Minimal content or placeholder; active route is visible |
| Flight Info | `/flight-info` | Placeholder; flight-data integration is out of scope |
| User | `/user` | Placeholder for later account and authorization capabilities |

Desktop uses an App Bar with semantic navigation links; narrow screens use a Drawer or Menu. Typed configuration supports later permissions, feature flags, and localization.

## Documentation and product-language policy

English is authoritative for project documentation. Unsuffixed files such as `README.md`, `PLANS.md`, `ISSUES.md`, and `AGENTS.md` are the sources of truth. Matching `_ZH.md` files are Simplified Chinese followers and must be synchronized whenever a material English decision, task, path, command, or acceptance criterion changes. English controls if translations disagree.

The first product UI is also English, but copy is not hard-coded in pages or components. Navigation labels, form labels, validation messages, and success/failure messages use stable keys in a centralized English catalog. Dates, times, numbers, and currencies use locale-aware formatters.

The first slice does not include a language switcher, Chinese product translations, or locale URLs. A later localization task adds at least `en` and `zh-CN` catalogs, fallback behavior, missing-key checks, preference persistence, and a switcher. Locale path strategy waits for public-page SEO and user-preference requirements.

## Local development and containerization

The plan deliberately uses host-run applications with containerized infrastructure:

- Run Next.js and NestJS on the host through pnpm/Turborepo for fast HMR, breakpoint debugging, and type feedback.
- Run fixed-version PostgreSQL + pgvector through Docker Compose with a health check and named development volume.
- Use separate local provisioner, migration, and runtime database roles. A pgvector-capable image does not mean the extension is enabled: privileged local bootstrap enables and verifies it, while application startup never does.
- Add Redis and a local mail-capture service only when their corresponding features begin.
- Route local `/api/v1` traffic to NestJS through an explicit proxy to approximate production same-origin cookie behavior.
- CI runs application tasks on the runner and starts an isolated, ephemeral PostgreSQL/pgvector service for migrations and integration tests.
- After the first local vertical slice is stable, build separate multi-stage, non-root Web/API images and a full-stack container smoke profile. Production applications remain stateless and preferably use managed PostgreSQL/Redis.

## GitHub collaboration, hooks, and CI/CD

The first slice includes repository governance and continuous integration, but not a live production deployment:

- The public repository is owned by `@Donny-Guo`. MIT is the confirmed open-source license choice. A root `LICENSE` already exists, but its current `Copyright (c) 2026 Dongping Guo (Donny)` notice does not match confirmed decision D-23; F-08 must align and verify the artifact through a reviewable governance change. Changes still reach `main` through pull requests with squash merge and linear history. The ruleset blocks deletion and force pushes and requires resolved conversations plus the stable aggregate CI check.
- The standard root MIT `LICENSE` must use `Copyright (c) 2026 Donny-Guo`; F-08 verifies that GitHub recognizes it and keeps source-file headers optional.
- During bootstrap, approval requirements must remain satisfiable without weakening CI. `CODEOWNERS` still documents workflow, authentication/security, migration, and agent/tool ownership; require at least one non-author approval and owned-path review whenever eligible reviewers are available.
- Root Husky hooks run lint-staged formatting/linting on staged files and commitlint on commit messages. They stay fast, work with partial staging, and avoid network, database, build, or full-test work. Because hooks can be bypassed, CI repeats all merge requirements and validates the pull-request title used by squash merge.
- GitHub Actions pull-request CI installs with the frozen pnpm lockfile and checks formatting, lint, types, unit/integration tests, builds, documentation policy, and later the critical browser path. Integration jobs use an ephemeral PostgreSQL + pgvector service.
- Workflows use GitHub-hosted ephemeral runners, least-privilege permissions, explicit timeouts and concurrency, full-SHA-pinned third-party Actions, and no production credentials. Untrusted pull-request code never runs through `pull_request_target` and never contributes cache artifacts to trusted release jobs.
- Dependabot covers pnpm/npm packages and GitHub Actions. Because the repository is public, F-08 enables dependency review, CodeQL/code scanning, secret scanning, and push protection after confirming the then-current settings.

### AI review policy

- At most one advisory AI reviewer may be enabled initially.
- Request AI review manually only after a pull request is Ready for Review, deterministic CI is green, and self-review is complete. Do not enable automatic review for drafts, every pull request, or every push.
- Evaluate it on three representative, risk-bearing pull requests—prefer authentication, migration, or workflow changes—while measuring useful findings, false positives, misses, and latency. Skip docs-only, generated-only, and routine dependency-update reviews initially; request a re-review only after material risk-bearing changes.
- AI-review comments never satisfy a human-approval requirement or block merging. Do not enable overlapping AI reviewers; consider a replacement only after a separate permissions, data-handling, retention, and reliability review.
- AI review is defense in depth, not evidence that authentication, migrations, workflows, or agent tools are safe. The pull-request author must disposition substantive comments and manually inspect changes to review instructions; independent human review remains a release-hardening option for sensitive boundaries.

### CI runner and container-image strategy

- Standard checks run directly on a versioned GitHub-hosted Ubuntu runner, initially evaluating `ubuntu-24.04` rather than `ubuntu-latest`; this avoids an unnecessary container layer and keeps PostgreSQL service-container support. Consider `ubuntu-slim` only for short documentation/metadata jobs after verifying its lower CPU, shorter timeout, and container restrictions.
- Do not equate Alpine with faster CI. Alpine application images are smaller, but they use `musl` instead of Debian's `glibc`, omit common tools, and can complicate native dependencies such as Argon2id/image processing or multi-architecture builds.
- For later Web/API runtime images, benchmark a pinned LTS Debian slim candidate first and compare Alpine only if all native dependencies and smoke tests pass. Record cold/warm build time, compressed size, startup, vulnerability findings, architecture coverage, and security-update availability; select the measured winner rather than the smallest tag.
- Most build-time savings should come from frozen installs, pnpm/Turbo caching, careful job parallelism, small Docker contexts, stable layer order, multi-stage builds, filtered monorepo output, and `pnpm fetch` or BuildKit cache mounts. Never reuse a cache writable by an untrusted pull request in a trusted release build.

Continuous deployment is activated only after R-09 approves the hosting target, image registry, operational controls, and migration/rollback policy. The intended model builds Web/API images once from a trusted commit, produces SBOM/provenance evidence, and promotes the same immutable digests through protected `staging` and `production` GitHub Environments. Cloud access uses OIDC instead of long-lived keys; production requires an eligible reviewer with self-review disabled, serialized deployment, smoke verification, and rollback to a previously verified digest. Pull requests cannot deploy with production secrets.

## Deployment topology

Next.js and NestJS deploy independently while the browser sees one public origin:

```text
https://trip.example.com/*       -> Next.js
https://trip.example.com/api/v1/* -> Gateway/Ingress -> NestJS
                                              `----> Agent runtime (extract later if needed)
```

This retains independent scaling and rollback while simplifying cookies, CORS, and browser authentication. A future mobile or partner API domain needs its own authentication and CORS design. A Next.js proxy or middleware may improve navigation UX but is not the final authorization boundary; NestJS guards are.

## Agent boundary

- The first approved agent implementation uses TypeScript LangGraph inside NestJS `AgentModule`; the authentication slice does not create an empty module.
- Graphs, model keys, and side-effecting travel tools run only on the backend and avoid controller dependencies so they can later move to `apps/agent`.
- Extract the runtime through an ADR only when long-running work, background recovery, high-volume streaming, or independent scaling justifies it.
- Web may later use a LangGraph React/SDK client to display token, node, and tool progress, but it still goes through the authenticated NestJS entry point and never executes the agent in the browser.

## Production-oriented baseline

- Security: Argon2id, a pinned local common/compromised-password dataset, generic credential errors with a dummy-hash path, exact cookie/CSRF/cache controls, a separate public-release security gate, and sensitive fields excluded by default.
- Data: migration-driven schema, database uniqueness, UTC timestamps, and integration tests against real PostgreSQL.
- Contracts: one error shape; generate the Web client and check drift after Swagger is enabled.
- Observability: structured logs, request/correlation IDs, health checks, and agent run/thread identifiers.
- Quality: lint, strict type checking, unit tests, integration tests, end-to-end tests, and production builds as CI gates.
- Delivery: protected pull requests, owned workflows, immutable Action references, dependency/security scanning, artifact provenance, environment approvals, OIDC, and same-digest promotion.
- Accessibility: keyboard navigation, explicit labels, announced errors, focus management, sufficient contrast, and responsive layouts.

## Documentation entry points

- [`AGENTS.md`](./AGENTS.md): authoritative repository rules, safety boundaries, and definition of done.
- [`PLANS.md`](./PLANS.md): authoritative task breakdown, dependencies, decisions, and acceptance criteria.
- [`ISSUES.md`](./ISSUES.md): ordered, implementation-ready issue drafts with dependencies, pull-request boundaries, review criteria, and required evidence; derived from `PLANS.md`.
- [`README_ZH.md`](./README_ZH.md), [`AGENTS_ZH.md`](./AGENTS_ZH.md), [`PLANS_ZH.md`](./PLANS_ZH.md), and [`ISSUES_ZH.md`](./ISSUES_ZH.md): Simplified Chinese followers.

## References

- [pnpm workspaces](https://pnpm.io/workspaces)
- [pnpm continuous integration](https://pnpm.io/continuous-integration)
- [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use)
- [GitHub repository rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [GitHub deployment environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)
- [GitHub artifact attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations)
- [GitHub-hosted runners](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)
- [GitHub repository licensing](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)
- [Husky get started](https://typicode.github.io/husky/get-started.html)
- [lint-staged](https://github.com/lint-staged/lint-staged)
- [Node.js Docker image variants](https://github.com/nodejs/docker-node#image-variants)
- [pnpm with Docker](https://pnpm.io/docker)
- [Docker build-cache optimization](https://docs.docker.com/build/cache/optimize/)
- [Next.js App Router project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js App Router internationalization](https://nextjs.org/docs/app/guides/internationalization)
- [Next.js authentication guide](https://nextjs.org/docs/app/guides/authentication)
- [Next.js self-hosting and cache behavior](https://nextjs.org/docs/app/guides/self-hosting)
- [Material UI integration with Next.js](https://mui.com/material-ui/integrations/nextjs/)
- [NestJS validation](https://docs.nestjs.com/techniques/validation)
- [NestJS authentication](https://docs.nestjs.com/security/authentication)
- [LangGraph.js overview](https://docs.langchain.com/oss/javascript/langgraph/overview)
- [pgvector](https://github.com/pgvector/pgvector)
- [PostgreSQL `CREATE EXTENSION`](https://www.postgresql.org/docs/17/sql-createextension.html)
- [TypeORM vector columns](https://typeorm.io/docs/entity/entities/#vector-columns)
- [Turborepo](https://vercel.com/docs/monorepos/turborepo)
- [NIST SP 800-63B-4 authenticator management](https://pages.nist.gov/800-63-4/sp800-63b.html#passwordver)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
