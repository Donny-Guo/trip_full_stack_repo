# Trip Agent Full Stack

A production-oriented travel-agent monorepo. The current ISSUE-009 worktree contains the workspace foundation, a Next.js/MUI Web scaffold, and a NestJS ESM authentication API backed by TypeORM and local PostgreSQL/pgvector with separated database roles. Web authentication pages and agent capabilities follow in later work.

Simplified Chinese: [README_ZH.md](./README_ZH.md). This English file is authoritative.

## Current status

As of 2026-08-06:

- Available in this worktree: the pnpm/Turborepo root, shared engineering configuration, the Next.js 16/MUI v9 Web scaffold, and a NestJS 11 ESM API with liveness/readiness, TypeORM 1.1, an explicit `users` migration, Argon2id password hashing, sign-up/login, `/auth/me`, logout, and a 15-minute HttpOnly JWT cookie.
- Completed locally: `P-03`/`ISSUE-002`, `F-01` through `F-05`/`ISSUE-003` through `ISSUE-007`, and `W-01`/`ISSUE-008`.
- Current order: finish and merge consolidated `ISSUE-009`/`MVP-01`, then implement `ISSUE-010`/`MVP-02`. GitHub issues #11-#27 are closed as superseded or deferred, not as implementation evidence.
- Not available yet: Web authentication pages/protected Dashboard, CI/hooks, agent capabilities, or travel business features.
- Production deployment and public exposure are not authorized.

See [PLANS.md](./PLANS.md) for authoritative scope and status.

## First slice

The time-limited local demo will provide:

- Email/password sign-up and login.
- Automatic login after registration using a 15-minute access JWT in a same-origin HttpOnly cookie.
- Session restore, logout, and protected Web routes.
- A protected Dashboard proving session restore and route protection.
- A PostgreSQL-backed User model with API-authoritative validation and automated tests.
- Fast local Husky/lint-staged/commitlint hooks and minimum deterministic pull-request CI.

Extensible navigation, Flight Info/User pages, localization, full GitHub governance/security administration, travel-provider integration, LangGraph workflows, vector retrieval, refresh-token rotation, Redis, and production deployment are documented later work.

## Stack

| Area      | Choice                                                   | State                                                                   |
| --------- | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| Workspace | pnpm 11.18.0 + Turborepo 2.10.8                          | Available with shared TypeScript/ESLint/Prettier policy                 |
| Web       | Next.js 16.2.12 + React 19.2.8                           | Minimal scaffold with MUI SSR/theme foundation                          |
| UI        | MUI Material/Icons 9.2.0                                 | SSR/CSS-variable foundation available                                   |
| API       | NestJS 11.1.28 REST + TypeScript                         | ESM authentication API available in the ISSUE-009 worktree              |
| Data      | PostgreSQL 18 + pgvector + TypeORM 1.1                   | Explicit migration and separated runtime/migrator connections available |
| Agent     | TypeScript LangGraph inside the API boundary             | Later                                                                   |
| Tests     | Jest/Supertest, Vitest/React Testing Library, Playwright | API checks and one Web render regression available; browser E2E planned |

Exact pins, compatibility evidence, and update policy live in [docs/toolchain.md](./docs/toolchain.md).

## Quick start

Requirements: Node.js 24.18.0, pnpm 11.18.0, and Docker with Compose.

```sh
pnpm install --frozen-lockfile
pnpm --filter web dev
```

Open http://localhost:3000. The current page displays a minimal MUI SSR/theme proof without product navigation or custom branding.

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
pnpm build
```

`pnpm format` formats files with the root Prettier policy, and `pnpm format:check` verifies it without mutation. API integration tests require PostgreSQL. After creating the ignored test configuration files from `apps/api/test/config/*.example`, this command creates a fresh isolated database, runs migration `show/run/show`, executes the integration suite, and removes only the test project and volume:

```sh
pnpm --filter api test:integration:local
```

The normal `pnpm test` command assumes its required services and migrations are already available.

## Repository layout

```text
apps/web/                   Minimal Next.js application with MUI theme/render regression
apps/api/                   NestJS ESM authentication API, migrations, and tests
packages/config-eslint/     Shared typed ESLint configuration
packages/config-typescript/ Shared strict TypeScript configuration
infra/docker/               Local PostgreSQL/pgvector Compose, bootstrap, and verification
docs/toolchain*.md          Exact version and compatibility evidence
docs/api/                   Authentication contracts and local runbook
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
