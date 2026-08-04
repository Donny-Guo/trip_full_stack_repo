# Trip Agent Full Stack

A production-oriented travel-agent monorepo. The repository currently contains the workspace foundation plus minimal Next.js Web and NestJS API applications; the authentication flow, database infrastructure, and agent capabilities are planned but not implemented yet.

Simplified Chinese: [README_ZH.md](./README_ZH.md). This English file is authoritative.

## Current status

As of 2026-08-03:

- Available: the pnpm/Turborepo root, one lockfile, a minimal Next.js 16 Web scaffold, and a minimal NestJS 11 API scaffold with process liveness.
- Completed locally: `P-03`/`ISSUE-002` and `F-01` through `F-03`/`ISSUE-003` through `ISSUE-005`.
- Next: the dependency-eligible `ISSUE-006` through `ISSUE-010` wave, following the authoritative issue order.
- Not available yet: MUI, authentication, PostgreSQL infrastructure, CI/hooks, or business features.
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

| Area | Choice | State |
| --- | --- | --- |
| Workspace | pnpm 11.18.0 + Turborepo 2.10.8 | Available |
| Web | Next.js 16.2.12 + React 19.2.8 | Minimal scaffold available |
| UI | MUI v9 | Planned in W-01 |
| API | NestJS 11.1.28 REST + TypeScript | Minimal scaffold available |
| Data | PostgreSQL 18 + pgvector + TypeORM 1.1 | Planned in F-05/B-01 |
| Agent | TypeScript LangGraph inside the API boundary | Later |
| Tests | Jest/Supertest, Vitest/React Testing Library, Playwright | API Jest/Supertest available; Web and browser suites planned |

Exact pins, compatibility evidence, and update policy live in [docs/toolchain.md](./docs/toolchain.md).

## Quick start

Requirements: Node.js 24.18.0 and pnpm 11.18.0.

```sh
pnpm install --frozen-lockfile
pnpm --filter web dev
```

Open http://localhost:3000. The current page displays only the minimal Web scaffold.

Start the API in a separate terminal:

```sh
pnpm --filter api dev
```

Its process-only liveness endpoint is http://localhost:3001/api/v1/health/live.

Run the repository checks from the root:

```sh
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

At the current scaffold stage, `pnpm format` completes without package tasks; F-04 will add shared formatting tooling. `pnpm test` runs the API unit and HTTP checks. No database service is required until F-05.

## Repository layout

```text
apps/web/              Minimal Next.js application
apps/api/              Minimal NestJS application and liveness endpoint
docs/toolchain*.md     Exact version and compatibility evidence
AGENTS*.md             Repository rules for contributors and agents
PLANS*.md              Decisions, scope, status, and acceptance criteria
ISSUES*.md             Ordered implementation issue specifications
package.json           Root commands and runtime constraints
pnpm-workspace.yaml    Workspace and install policy
turbo.json             Cross-package task graph
```

Directories such as `infra/docker` and shared packages are created only when their owning task begins.

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
