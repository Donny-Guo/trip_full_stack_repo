# Trip Agent Full Stack

A production-oriented travel-agent monorepo. The current worktree contains the workspace foundation, the locally verified ISSUE-010 Next.js/MUI authentication journey, and the merged ISSUE-009 NestJS ESM authentication API backed by TypeORM and local PostgreSQL/pgvector with separated database roles. Agent capabilities follow in later work.

Simplified Chinese: [README_ZH.md](./README_ZH.md). This English file is authoritative.

## Current status

As of 2026-08-06:

- Available in this worktree: the pnpm/Turborepo root, shared engineering configuration, Next.js 16/MUI v9 sign-up and login pages, server-protected sparse Dashboard, session restore/logout, session-aware 404 handling, local hooks, immutable-SHA-pinned PR CI configuration, and the NestJS 11 authentication API with its PostgreSQL boundary.
- Completed locally: `P-03`/`ISSUE-002`, `F-01` through `F-05`/`ISSUE-003` through `ISSUE-007`, `W-01`/`ISSUE-008`, and the ISSUE-010 implementation and local verification.
- Current order: `ISSUE-009`/`MVP-01` is merged and closed as completed. `ISSUE-010`/`MVP-02` remains open pending normal PR CI, review, merge, and remote closure. GitHub issues #11-#27 are closed as superseded or deferred, not as implementation evidence.
- Not available yet: agent capabilities, travel business features, product Dashboard content, or production deployment.
- Production deployment and public exposure are not authorized.

See [PLANS.md](./PLANS.md) for authoritative scope and status.

## First slice

The time-limited local demo provides:

- Email/password sign-up and login.
- Automatic login after registration using a 15-minute access JWT in a same-origin HttpOnly cookie.
- Session restore, logout, and protected Web routes.
- An intentionally sparse protected Dashboard proving session restore, logout, and route protection; only accessible route identity and a logout control are required.
- A PostgreSQL-backed User model with API-authoritative validation and automated tests.
- Fast local Husky/lint-staged/commitlint hooks and minimum deterministic pull-request CI.

Dashboard product content and design, extensible navigation, Flight Info/User pages, localization, full GitHub governance/security administration, travel-provider integration, LangGraph workflows, vector retrieval, refresh-token rotation, Redis, and production deployment are documented later work.

## Stack

| Area      | Choice                                                   | State                                                                    |
| --------- | -------------------------------------------------------- | ------------------------------------------------------------------------ |
| Workspace | pnpm 11.18.0 + Turborepo 2.10.8                          | Available with shared TypeScript/ESLint/Prettier policy                  |
| Web       | Next.js 16.2.12 + React 19.2.8                           | Sign-up/login, protected sparse Dashboard, logout, and session-aware 404 |
| UI        | MUI Material/Icons 9.2.0                                 | App Router SSR/CSS-variable theme and accessible auth forms              |
| API       | NestJS 11.1.28 REST + TypeScript                         | Merged ESM authentication API available                                  |
| Data      | PostgreSQL 18 + pgvector + TypeORM 1.1                   | Explicit migration and separated runtime/migrator connections available  |
| Agent     | TypeScript LangGraph inside the API boundary             | Later                                                                    |
| Tests     | Jest/Supertest, Vitest/React Testing Library, Playwright | 60 API tests, 73 Web tests, and 6 browser journeys verified locally      |

Exact pins, compatibility evidence, and update policy live in [docs/toolchain.md](./docs/toolchain.md).

## Quick start

Requirements: Node.js 24.18.0, pnpm 11.18.0, and Docker with Compose.

```sh
pnpm install --frozen-lockfile
test -e apps/web/.env.local || cp apps/web/.env.example apps/web/.env.local
pnpm --filter web dev
```

Open http://localhost:3000. Use `/sign-up` or `/login`; authenticated users land on the intentionally sparse `/dashboard`.

Start local PostgreSQL. If `.env` does not exist, create it from `.env.example` without overwriting an existing file. Fill each blank password with a different 64-character lowercase hexadecimal development value (for example, run `openssl rand -hex 32` three times), then keep the file ignored and mode `0600`.

```sh
test -e .env || cp .env.example .env
chmod 600 .env
docker compose --env-file .env -f infra/docker/compose.yaml up --detach --wait postgres
docker compose --env-file .env -f infra/docker/compose.yaml ps
docker compose --env-file .env -f infra/docker/compose.yaml exec --no-tty postgres \
  /opt/trip-db/verify/capabilities.sh
```

Stop the database container while preserving its named development volume:

```sh
docker compose --env-file .env -f infra/docker/compose.yaml down
```

The provisioner is bootstrap-only, the migrator owns approved application DDL, and NestJS connects only as `trip_runtime`. TypeORM has automatic synchronization, startup migrations, and extension installation disabled.

Create the ignored API files from `apps/api/.env.migration.example` and `apps/api/.env.runtime.example`, populate only their matching role credentials and generated auth values, and set both files to mode `0600`. The complete field-by-field setup is in [the authentication API runbook](./docs/api/authentication.md).

Run the migration explicitly, then start the API:

```sh
pnpm --filter api migration:show
pnpm --filter api migration:run
pnpm --filter api migration:show
pnpm --filter api dev
```

The API exposes process liveness at http://localhost:3001/api/v1/health/live and PostgreSQL-aware readiness at http://localhost:3001/api/v1/health/ready.

Run the repository checks from the root:

```sh
pnpm format
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:local
pnpm test:e2e
pnpm build
pnpm docs:check
```

`pnpm format` formats files with the root Prettier policy, and `pnpm format:check` verifies it without mutation. `pnpm test:local` automatically creates the three ignored test-only environment files when none exist, restricts them to mode `0600`, creates a fresh isolated database, runs migration `show/run/show`, executes the API and Web suites, and removes only its test project and volume. It refuses to overwrite a partial test configuration.

Install the pinned Chromium runtime once before the first local browser run:

```sh
pnpm --filter web exec playwright install chromium
pnpm test:e2e
```

The E2E wrapper uses isolated Web/API ports `43000`/`43001`, a separate PostgreSQL project on `55432`, and an additional unavailable-API build. Development remains on `3000`/`3001`. The normal `pnpm test` command assumes its required services and migrations are already available; prefer `pnpm test:local` for a clean root verification.

## Repository layout

```text
apps/web/                   Next.js/MUI authentication UI, protected route, and browser tests
apps/api/                   NestJS ESM authentication API, migrations, and tests
packages/config-eslint/     Shared typed ESLint configuration
packages/config-typescript/ Shared strict TypeScript configuration
infra/docker/               Local PostgreSQL/pgvector Compose, bootstrap, and verification
docs/toolchain*.md          Exact version and compatibility evidence
docs/api/                   Authentication contracts and local runbook
.github/                    Least-privilege pull-request CI configuration
.husky/                     Fast staged-file and commit-message hooks
AGENTS*.md                  Repository rules for contributors and agents
PLANS*.md                   Decisions, scope, status, and acceptance criteria
ISSUES*.md                  Ordered implementation issue specifications
package.json                Root commands and runtime constraints
pnpm-workspace.yaml         Workspace and install policy
turbo.json                  Cross-package task graph
```

Application containers, Redis, and production database selection remain absent.

## Architecture guardrails

- The browser calls the API through same-origin `/api/v1`; Web code never accesses PostgreSQL, model providers, or privileged tools directly.
- NestJS owns business rules, authentication, authorization, and persistence.
- Database changes use migrations; production schema synchronization stays disabled.
- LangGraph and model credentials remain backend-only, and no empty agent module is created early.
- The local authentication MVP is not authorization for production deployment or public exposure.

## Documentation

- [PLANS.md](./PLANS.md) — authoritative decisions, scope, task status, and acceptance criteria.
- [ISSUES.md](./ISSUES.md) — the two consolidated execution specifications, remote disposition map, and documented-backlog routing.
- [docs/toolchain.md](./docs/toolchain.md) — exact dependency pins and source evidence.
- [docs/api/authentication.md](./docs/api/authentication.md) — authentication endpoints, errors, environment setup, migrations, testing, and manual smoke checks.
- [AGENTS.md](./AGENTS.md) — repository-wide engineering and safety rules.

The README intentionally stays at onboarding level. Detailed contracts and evidence belong in the documents above. Unsuffixed English files are authoritative; matching `_ZH.md` files are Simplified Chinese followers.

## License

[MIT](./LICENSE)
