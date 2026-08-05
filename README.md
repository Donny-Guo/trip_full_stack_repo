# Trip Agent Full Stack

A production-oriented travel-agent monorepo. The repository currently contains the workspace foundation, shared TypeScript/ESLint/Prettier engineering configuration, minimal Next.js Web and NestJS API applications, a simple MUI SSR/theme foundation, and local PostgreSQL/pgvector infrastructure with separated database roles. The authentication flow, TypeORM integration, and agent capabilities are planned but not implemented yet.

Simplified Chinese: [README_ZH.md](./README_ZH.md). This English file is authoritative.

## Current status

As of 2026-08-05:

- Available: the pnpm/Turborepo root, one lockfile, one root Prettier policy, shared strict TypeScript and typed ESLint packages, a minimal Next.js 16 Web scaffold with MUI v9 SSR/theme integration, a minimal NestJS 11 API scaffold with process liveness, and digest-pinned local PostgreSQL 18.4/pgvector 0.8.5 infrastructure.
- Completed locally: `P-03`/`ISSUE-002`, `F-01` through `F-05`/`ISSUE-003` through `ISSUE-007`, and `W-01`/`ISSUE-008`.
- Next: `ISSUE-009` and `ISSUE-010`, following the authoritative issue order.
- Not available yet: authentication, TypeORM/API database integration, CI/hooks, or business features.
- Production deployment and public exposure are not authorized.

See [PLANS.md](./PLANS.md) for authoritative scope and status.

## First slice

The first vertical slice will provide:

- Email/password sign-up and login.
- Automatic login after registration using a 15-minute access JWT in a same-origin HttpOnly cookie.
- Session restore, logout, and protected Web routes.
- Dashboard, Flight Info, and User navigation targets.
- A PostgreSQL-backed User model with API-authoritative validation and automated tests.

Travel-provider integration, LangGraph workflows, vector retrieval, refresh-token rotation, Redis, and production deployment are later work.

## Stack

| Area      | Choice                                                   | State                                                                   |
| --------- | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| Workspace | pnpm 11.18.0 + Turborepo 2.10.8                          | Available with shared TypeScript/ESLint/Prettier policy                 |
| Web       | Next.js 16.2.12 + React 19.2.8                           | Minimal scaffold with MUI SSR/theme foundation                          |
| UI        | MUI Material/Icons 9.2.0                                 | SSR/CSS-variable foundation available                                   |
| API       | NestJS 11.1.28 REST + TypeScript                         | Minimal scaffold available                                              |
| Data      | PostgreSQL 18 + pgvector + TypeORM 1.1                   | Local database infrastructure available; TypeORM planned in B-01        |
| Agent     | TypeScript LangGraph inside the API boundary             | Later                                                                   |
| Tests     | Jest/Supertest, Vitest/React Testing Library, Playwright | API checks and one Web render regression available; browser E2E planned |

Exact pins, compatibility evidence, and update policy live in [docs/toolchain.md](./docs/toolchain.md).

## Quick start

Requirements: Node.js 24.18.0 and pnpm 11.18.0.

```sh
pnpm install --frozen-lockfile
pnpm --filter web dev
```

Open http://localhost:3000. The current page displays a minimal MUI SSR/theme proof without product navigation or custom branding.

Start the API in a separate terminal:

```sh
pnpm --filter api dev
```

Its process-only liveness endpoint is http://localhost:3001/api/v1/health/live.

Start local PostgreSQL separately. If `.env` does not exist, create it from `.env.example` without overwriting an existing file. Fill each blank password with a different 64-character lowercase hexadecimal development value (for example, run `openssl rand -hex 32` three times), then keep the file ignored and mode `0600`.

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

The provisioner is bootstrap-only, the migrator owns approved application DDL, and the runtime role is the later API connection identity. Issue 7 deliberately adds no TypeORM connection or business migration; B-01 and B-02 own those steps.

Run the repository checks from the root:

```sh
pnpm format
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm format` formats files with the root Prettier policy, and `pnpm format:check` verifies that policy without mutation. `pnpm test` runs the API unit/HTTP checks and the Web render regression. The current application checks still do not require the database service; database verification is run explicitly through Compose until B-01 integrates TypeORM.

## Repository layout

```text
apps/web/                   Minimal Next.js application with MUI theme/render regression
apps/api/                   Minimal NestJS application and liveness endpoint
packages/config-eslint/     Shared typed ESLint configuration
packages/config-typescript/ Shared strict TypeScript configuration
infra/docker/               Local PostgreSQL/pgvector Compose, bootstrap, and verification
docs/toolchain*.md          Exact version and compatibility evidence
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
- Authentication and production-release controls remain mandatory even though the current repository is only a local scaffold.

## Documentation

- [PLANS.md](./PLANS.md) — authoritative decisions, scope, task status, and acceptance criteria.
- [ISSUES.md](./ISSUES.md) — implementation-ready issue specifications and the remote issue registry.
- [docs/toolchain.md](./docs/toolchain.md) — exact dependency pins and source evidence.
- [AGENTS.md](./AGENTS.md) — repository-wide engineering and safety rules.

The README intentionally stays at onboarding level. Detailed contracts and evidence belong in the documents above. Unsuffixed English files are authoritative; matching `_ZH.md` files are Simplified Chinese followers.

## License

[MIT](./LICENSE)
