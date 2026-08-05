# Ordered GitHub Issue Drafts

Status: **first-slice implementation authorized on 2026-08-02; ISSUE-002 through ISSUE-006 and ISSUE-008 are complete locally; ISSUE-007, ISSUE-009, and ISSUE-010 remain in the dependency-eligible wave**\
Plan date: 2026-07-30  
Source of scope: [`PLANS.md`](./PLANS.md)  
Repository owner: `@Donny-Guo`

Simplified Chinese translation: [`ISSUES_ZH.md`](./ISSUES_ZH.md). This English file is authoritative.

## 1. Purpose, authority, and usage

This catalog converts the approved plan into implementation-ready GitHub issue bodies. The registry below is the evidence for drafts that now exist remotely; entries without a registered URL remain local drafts. The 2026-07-30 remote issue authorization did not authorize implementation. The owner separately authorized the planned first local authentication slice on 2026-08-02. Post-MVP work, deployment, public exposure, repository visibility changes, remote creation of `ISSUE-028` onward, and remote update/closure of any GitHub issue remain outside that authorization.

Authority and synchronization rules:

1. `AGENTS.md` defines repository-wide engineering rules.
2. `PLANS.md` defines authoritative decisions, scope, task status, and acceptance.
3. This file defines the ordered issue packaging derived from `PLANS.md`; it may add stricter sequencing or evidence requirements but may not relax the plan.
4. Each `ISSUE-nnn` key is a stable draft identifier, not a GitHub issue number. When remote issues are explicitly authorized and created, record their URLs without replacing the stable keys.
5. `P-01` is already `DONE` and is intentionally not backfilled as a synthetic issue. The owner explicitly satisfied `P-02`, the version-policy evidence completed `P-03`, and the monorepo-root evidence completed `F-01` on 2026-08-02. The Web scaffold completed `F-02` and was reverified on the D-25 Next.js 16 baseline on 2026-08-03. The API scaffold completed `F-03` on 2026-08-03. Shared engineering configuration completed `F-04`, and the MUI SSR/theme foundation completed `W-01`, on 2026-08-05. `ISSUE-001` through `ISSUE-006` and `ISSUE-008` are therefore `DONE` locally; `ISSUE-007`, `ISSUE-009`, and `ISSUE-010` remain in the dependency-eligible wave.
6. An issue status changes only with evidence. Closing a GitHub issue must be followed by the matching `PLANS.md`/`PLANS_ZH.md` status update.

### 1.1 Remote issue registry

On 2026-07-30, the owner explicitly authorized remote creation of `ISSUE-001` through `ISSUE-027`. All 27 were created, assigned to `@Donny-Guo`, placed in milestone `MVP — Local Auth Vertical Slice`, labeled, and verified with native blocked-by relationships. `ISSUE-028` onward remain local drafts.

The repository is public. Its visibility and the remote issue registry do not authorize implementation or deployment.

| Draft     | Plan task | GitHub issue                                                       |
| --------- | --------- | ------------------------------------------------------------------ |
| ISSUE-001 | P-02      | [#1](https://github.com/Donny-Guo/trip_full_stack_repo/issues/1)   |
| ISSUE-002 | P-03      | [#2](https://github.com/Donny-Guo/trip_full_stack_repo/issues/2)   |
| ISSUE-003 | F-01      | [#3](https://github.com/Donny-Guo/trip_full_stack_repo/issues/3)   |
| ISSUE-004 | F-02      | [#4](https://github.com/Donny-Guo/trip_full_stack_repo/issues/4)   |
| ISSUE-005 | F-03      | [#5](https://github.com/Donny-Guo/trip_full_stack_repo/issues/5)   |
| ISSUE-006 | F-04      | [#6](https://github.com/Donny-Guo/trip_full_stack_repo/issues/6)   |
| ISSUE-007 | F-05      | [#7](https://github.com/Donny-Guo/trip_full_stack_repo/issues/7)   |
| ISSUE-008 | W-01      | [#8](https://github.com/Donny-Guo/trip_full_stack_repo/issues/8)   |
| ISSUE-009 | B-04      | [#9](https://github.com/Donny-Guo/trip_full_stack_repo/issues/9)   |
| ISSUE-010 | B-09      | [#10](https://github.com/Donny-Guo/trip_full_stack_repo/issues/10) |
| ISSUE-011 | F-06      | [#11](https://github.com/Donny-Guo/trip_full_stack_repo/issues/11) |
| ISSUE-012 | F-07      | [#12](https://github.com/Donny-Guo/trip_full_stack_repo/issues/12) |
| ISSUE-013 | B-01      | [#13](https://github.com/Donny-Guo/trip_full_stack_repo/issues/13) |
| ISSUE-014 | W-02      | [#14](https://github.com/Donny-Guo/trip_full_stack_repo/issues/14) |
| ISSUE-015 | W-04      | [#15](https://github.com/Donny-Guo/trip_full_stack_repo/issues/15) |
| ISSUE-016 | F-08      | [#16](https://github.com/Donny-Guo/trip_full_stack_repo/issues/16) |
| ISSUE-017 | B-02      | [#17](https://github.com/Donny-Guo/trip_full_stack_repo/issues/17) |
| ISSUE-018 | B-05      | [#18](https://github.com/Donny-Guo/trip_full_stack_repo/issues/18) |
| ISSUE-019 | W-03      | [#19](https://github.com/Donny-Guo/trip_full_stack_repo/issues/19) |
| ISSUE-020 | B-03      | [#20](https://github.com/Donny-Guo/trip_full_stack_repo/issues/20) |
| ISSUE-021 | B-06      | [#21](https://github.com/Donny-Guo/trip_full_stack_repo/issues/21) |
| ISSUE-022 | B-07      | [#22](https://github.com/Donny-Guo/trip_full_stack_repo/issues/22) |
| ISSUE-023 | B-08      | [#23](https://github.com/Donny-Guo/trip_full_stack_repo/issues/23) |
| ISSUE-024 | B-10      | [#24](https://github.com/Donny-Guo/trip_full_stack_repo/issues/24) |
| ISSUE-025 | W-05      | [#25](https://github.com/Donny-Guo/trip_full_stack_repo/issues/25) |
| ISSUE-026 | W-06      | [#26](https://github.com/Donny-Guo/trip_full_stack_repo/issues/26) |
| ISSUE-027 | W-07      | [#27](https://github.com/Donny-Guo/trip_full_stack_repo/issues/27) |

When a draft is created on GitHub:

- Assign them to `@Donny-Guo` initially.
- Put first-slice work in milestone `MVP — Local Auth Vertical Slice`.
- Put later work in `Post-MVP — Production Hardening`, `Post-MVP — Travel Agent`, or `Release — Public Exposure`.
- Use GitHub's native blocked-by relationships; do not rely only on prose dependency lists.
- Use one outcome-focused pull request per issue by default. Split an issue before implementation if it cannot be reviewed, tested, and rolled back as one coherent change.
- Use parent/sub-issue relationships for entries marked `Epic`. Closing an Epic requires all mandatory child issues and Epic-level evidence.

## 2. Shared Definition of Ready

An issue may move to `In Progress` only when all of the following are true:

- [ ] The implementation gate is open and every hard dependency is closed.
- [ ] The relevant decisions in `PLANS.md` are still current; unresolved product or security choices are recorded rather than guessed.
- [ ] Scope, non-goals, acceptance criteria, and expected evidence are understandable to someone who did not write the issue.
- [ ] External services, test data, secrets, environments, and permissions required by the work are available through approved paths.
- [ ] Any schema, API, authentication, deployment, or agent-boundary change has its migration, compatibility, and design-review requirements identified before coding.

## 3. Shared review standard

The issue-specific review checklist is additive to this global gate. A reviewer closes an issue only when:

- [ ] The pull request links the issue, contains one coherent outcome, explains risk and rollback, and has no unrelated refactor or dependency upgrade.
- [ ] Format, lint, strict type checking, relevant unit/integration/component/E2E tests, and production builds pass through the authoritative CI checks.
- [ ] Tests cover success, boundary, authorization, failure, and regression paths without depending on order, production data, or real third-party APIs.
- [ ] No secret, password, token, private prompt/tool result, stack trace, sensitive response field, mutable Action reference, skipped test, or unexplained TODO is introduced.
- [ ] Security, privacy, accessibility, cache behavior, logging/redaction, and least privilege are reviewed where applicable.
- [ ] API contracts, migrations, environment examples, runbooks, authoritative English documentation, and existing `_ZH.md` followers are synchronized.
- [ ] Required conversations are resolved. During bootstrap, `@Donny-Guo` records self-review evidence; AI review is advisory only and never substitutes for deterministic CI or human accountability.

Minimum evidence by change type:

| Change type           | Required review evidence                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| UI                    | Desktop and narrow-layout evidence, keyboard path, focus/error behavior, automated accessibility result                               |
| API/security          | Contract tests, negative cases, redaction check, request/correlation ID, relevant header/cookie evidence                              |
| Database              | Forward migration from empty state, constraint/concurrency tests, least-privilege role check, repair/down guidance                    |
| CI/governance         | Workflow/event/permission review, immutable dependency references, fork/untrusted-code test, repository-setting screenshots or export |
| Documentation         | Local-link validation, English-primary check, stable task/decision/issue ID and status parity                                         |
| Deployment/agent Epic | Closed child issues, threat model, runbooks, evaluation/operational evidence, explicit release authorization where required           |

## 4. Recommended execution sequence

The sequence below is the safe default. Items in the same wave may proceed in parallel only when their listed dependencies remain satisfied and shared-contract ownership is clear.

| Order | Draft     | Plan task | Wave                  | Milestone            | Blocked by                                                                      |
| ----: | --------- | --------- | --------------------- | -------------------- | ------------------------------------------------------------------------------- |
|     1 | ISSUE-001 | P-02      | Gate                  | MVP                  | P-01 (`DONE`)                                                                   |
|     2 | ISSUE-002 | P-03      | 1                     | MVP                  | ISSUE-001                                                                       |
|     3 | ISSUE-003 | F-01      | 2                     | MVP                  | ISSUE-001, ISSUE-002                                                            |
|     4 | ISSUE-004 | F-02      | 3                     | MVP                  | ISSUE-003                                                                       |
|     5 | ISSUE-005 | F-03      | 3                     | MVP                  | ISSUE-003                                                                       |
|     6 | ISSUE-006 | F-04      | 4                     | MVP                  | ISSUE-004, ISSUE-005                                                            |
|     7 | ISSUE-007 | F-05      | 4                     | MVP                  | ISSUE-005                                                                       |
|     8 | ISSUE-008 | W-01      | 4                     | MVP                  | ISSUE-004                                                                       |
|     9 | ISSUE-009 | B-04      | 4                     | MVP                  | ISSUE-005                                                                       |
|    10 | ISSUE-010 | B-09      | 4                     | MVP                  | ISSUE-005                                                                       |
|    11 | ISSUE-011 | F-06      | 5                     | MVP                  | ISSUE-006, ISSUE-007                                                            |
|    12 | ISSUE-012 | F-07      | 5                     | MVP                  | ISSUE-003, ISSUE-006                                                            |
|    13 | ISSUE-013 | B-01      | 5                     | MVP                  | ISSUE-005, ISSUE-007                                                            |
|    14 | ISSUE-014 | W-02      | 5                     | MVP                  | ISSUE-008                                                                       |
|    15 | ISSUE-015 | W-04      | 5                     | MVP                  | ISSUE-008, ISSUE-010                                                            |
|    16 | ISSUE-016 | F-08      | 6                     | MVP                  | ISSUE-011, ISSUE-012                                                            |
|    17 | ISSUE-017 | B-02      | 6                     | MVP                  | ISSUE-013                                                                       |
|    18 | ISSUE-018 | B-05      | 6                     | MVP                  | ISSUE-013                                                                       |
|    19 | ISSUE-019 | W-03      | 6                     | MVP                  | ISSUE-014                                                                       |
|    20 | ISSUE-020 | B-03      | 7                     | MVP                  | ISSUE-017                                                                       |
|    21 | ISSUE-021 | B-06      | 8                     | MVP                  | ISSUE-009, ISSUE-010, ISSUE-018, ISSUE-020                                      |
|    22 | ISSUE-022 | B-07      | 8                     | MVP                  | ISSUE-009, ISSUE-010, ISSUE-018, ISSUE-020                                      |
|    23 | ISSUE-023 | B-08      | 8                     | MVP                  | ISSUE-010, ISSUE-018, ISSUE-020                                                 |
|    24 | ISSUE-024 | B-10      | 9                     | MVP                  | ISSUE-021, ISSUE-022, ISSUE-023                                                 |
|    25 | ISSUE-025 | W-05      | 9                     | MVP                  | ISSUE-014, ISSUE-023                                                            |
|    26 | ISSUE-026 | W-06      | 10                    | MVP                  | ISSUE-015, ISSUE-021, ISSUE-025                                                 |
|    27 | ISSUE-027 | W-07      | 10                    | MVP                  | ISSUE-015, ISSUE-022, ISSUE-025                                                 |
|    28 | ISSUE-028 | W-08      | 11                    | MVP                  | ISSUE-019, ISSUE-026, ISSUE-027                                                 |
|    29 | ISSUE-029 | I-01      | 11                    | MVP                  | ISSUE-021, ISSUE-026                                                            |
|    30 | ISSUE-030 | I-02      | 11                    | MVP                  | ISSUE-022, ISSUE-025, ISSUE-027                                                 |
|    31 | ISSUE-031 | E2E-01    | 12                    | MVP                  | ISSUE-019, ISSUE-029, ISSUE-030                                                 |
|    32 | ISSUE-032 | Q-01      | 13                    | MVP                  | ISSUE-016, ISSUE-024, ISSUE-028, ISSUE-031                                      |
|    33 | ISSUE-033 | H-01      | 14                    | MVP                  | ISSUE-032                                                                       |
|    34 | ISSUE-034 | R-01      | Later 1               | Production Hardening | ISSUE-033                                                                       |
|    35 | ISSUE-035 | R-02      | Later 2               | Production Hardening | ISSUE-033; ISSUE-034 recommended                                                |
|    36 | ISSUE-036 | R-03      | Later 3               | Production Hardening | ISSUE-033, ISSUE-035; approved session semantics                                |
|    37 | ISSUE-037 | R-04      | Later 3               | Production Hardening | ISSUE-034, ISSUE-035; approved mail design                                      |
|    38 | ISSUE-038 | R-05      | Later 4               | Production Hardening | ISSUE-035, ISSUE-036, ISSUE-037                                                 |
|    39 | ISSUE-039 | R-06      | Later 2               | Production Hardening | ISSUE-033; approved lifecycle semantics                                         |
|    40 | ISSUE-040 | R-07      | Later 3               | Production Hardening | ISSUE-033; approved restricted operation; ISSUE-039 if status-dependent         |
|    41 | ISSUE-041 | R-08      | Later 2               | Production Hardening | ISSUE-014, ISSUE-033                                                            |
|    42 | ISSUE-042 | R-10      | Later 2               | Production Hardening | ISSUE-033                                                                       |
|    43 | ISSUE-043 | R-09      | Later 3               | Production Hardening | ISSUE-033; approved platform/operations inputs                                  |
|    44 | ISSUE-044 | R-11      | Later 3               | Travel Agent         | ISSUE-042; approved retrieval inputs                                            |
|    45 | ISSUE-045 | R-12      | Later 4               | Travel Agent         | ISSUE-042; ISSUE-044 only when retrieval is required                            |
|    46 | ISSUE-046 | R-13      | Later evidence-driven | Production Hardening | ISSUE-033; approved usage/compliance evidence                                   |
|    47 | ISSUE-047 | R-14      | Release gate          | Public Exposure      | ISSUE-032, ISSUE-033, ISSUE-035, ISSUE-042, ISSUE-043, and all release features |

## 5. First-slice issue specifications

### ISSUE-001 — [P-02] Authorize implementation

- **Status:** `DONE`
- **Labels:** `type:governance`, `priority:p0`, `scope:first-slice`
- **Blocked by:** none; P-01 is complete and owner authorization was recorded on 2026-08-02
- **PR boundary:** none

**Outcome**

Create an auditable implementation gate so planning approval cannot be mistaken for permission to mutate the repository or GitHub settings.

**Work**

- [x] Obtain an explicit instruction authorizing the first-slice scope.
- [x] Record whether authorization covers code, scaffolding, dependencies, hooks, MIT `LICENSE` governance, first-slice GitHub CI/governance settings, migrations, and local infrastructure.
- [x] Record the 2026-08-02 authorization date and exclusions in `PLANS.md` and its Chinese follower before implementation starts.

**Review / acceptance**

- [x] The instruction is unambiguous and comes from the repository owner.
- [x] Scope and exclusions match the approved decisions D-01 through D-25; D-25 changes only framework/ORM version lines and their migration contract.
- [x] No implementation artifact or remote setting was changed as part of closing this gate before authorization was recorded.

**Evidence:** owner instruction dated 2026-08-02 plus synchronized English/Chinese plan status. The tracked MIT `LICENSE` predates this authorization and is handled by F-08; no remote GitHub state was changed while closing this local gate.

**Non-goals:** technical implementation, issue creation on GitHub, or public-release authorization.

### ISSUE-002 — [P-03] Freeze the compatible version matrix

- **Status:** `DONE`
- **Remote state:** GitHub issue #2 closed on 2026-08-02.
- **Labels:** `type:task`, `area:foundation`, `area:ci`, `priority:p0`
- **Blocked by:** ISSUE-001
- **PR boundary:** one version-policy change

**Outcome**

Produce one reproducible toolchain baseline whose supported components and explicitly accepted support exceptions are auditable before scaffolding.

**Confirmed owner constraints (revised by D-25 on 2026-08-03)**

- Use the current stable Next.js 16 and MUI v9 lines; the reviewed exact pins are Next.js 16.2.12, MUI Material/Icons 9.2.0, and `@mui/material-nextjs` 9.1.1.
- Use the current stable TypeORM line; the reviewed exact pin is TypeORM 1.1.0.
- Use PostgreSQL 18.
- Use Jest/Supertest for API tests, Vitest/React Testing Library for Web unit/component tests, and Playwright for browser E2E.
- Keep exact stable pins, install each dependency only in its owning task, re-review support/compatibility quarterly and before public exposure, and require explicit owner approval for another major change.

**Work**

- [x] From primary sources, select exact compatible versions for Node.js LTS, pnpm, TypeScript, Turborepo, Next.js 16, React/React DOM, MUI v9 plus its official Next/Emotion integration, NestJS plus its CLI/adapter packages, TypeORM 1.1, the PostgreSQL driver, PostgreSQL 18, pgvector, Argon2, ESLint, Prettier, Jest/Supertest, Vitest/React Testing Library, Playwright, Husky, lint-staged, and commitlint.
- [x] Record the owner's test-stack, PostgreSQL-major, and D-25 Next.js/MUI/TypeORM choices without generic placeholders.
- [x] Create authoritative `docs/toolchain.md` and its `docs/toolchain_ZH.md` follower. For every selection, record the exact version or versioned image candidate, compatible/supported intersection, primary-source link and check date, support state or exception, pin/enforcement location, update owner/cadence, rollback target, and downstream verification task.
- [x] Select `ubuntu-24.04` unless primary-source evidence rejects it, and record versioned Debian-slim/Alpine candidates for later image benchmarking without choosing a final production base.
- [x] Define exact pin/range policy, upgrade cadence, rollback ownership, and an enforcement-owner map. P-03 selects policy; F-01 implements root package-manager/engine enforcement, F-05 pins the database image, B-04 proves Argon2, W-01 proves MUI SSR, and F-06/F-08 prove CI parity and the complete Action register.
- [x] Create an initial Action register for known CI/security Actions; every planned reference uses a full commit SHA with a readable version comment. F-06/F-08 update the register when real workflows establish the complete set.

**Review / acceptance**

- [x] `.node-version` contains the exact selected Node release and matches the matrix; the exact pnpm release and its F-01/F-06 enforcement locations are recorded.
- [x] No floating `latest`, unapproved canary, preview, prerelease, or mutable Action reference is selected.
- [x] The D-25 Next.js 16/MUI v9/TypeORM 1.1 selections, owning-task installation boundaries, PostgreSQL 18, and selected test families are explicit in the completed toolchain artifacts.
- [x] Compatibility evidence covers MUI/Next SSR, NestJS/TypeORM/PostgreSQL, pgvector, native Argon2id, and the supported Node/pnpm runtime intersection.
- [x] Every pinned tool has a primary-source link and check date, owner, reviewed update path, rollback, and downstream enforcement task.
- [x] The issue does not claim that package installation, lockfile resolution, application builds, runtime smoke tests, or CI parity passed before their owning downstream tasks exist.

**Evidence:** `.node-version`, `docs/toolchain.md`, synchronized `docs/toolchain_ZH.md`, D-25 in `PLANS.md`, and the required matrix/register contents. The original P-03 documentation checks passed on 2026-08-02; D-25 rechecked and amended the affected rows on 2026-08-03. F-01 supplies root dependency/lockfile/task evidence, and F-02 supplies installed Next.js 16 evidence. MUI SSR, TypeORM/PostgreSQL runtime behavior, and CI remain assigned downstream.

**Non-goals:** installing dependencies, generating the lockfile, scaffolding applications, claiming downstream runtime/CI evidence, or selecting the final production container base.

### ISSUE-003 — [F-01] Create the pnpm/Turborepo monorepo root

- **Status:** `DONE`
- **Remote state:** GitHub issue #3 closed on 2026-08-03.
- **Labels:** `type:task`, `area:foundation`, `priority:p0`
- **Blocked by:** ISSUE-001, ISSUE-002
- **PR boundary:** one root-workspace PR

**Outcome**

Create the smallest root workspace that consistently discovers and orchestrates Web, API, and real shared packages.

**Work**

- [x] Add pnpm workspace/package-manager constraints, root scripts, ignore/editor conventions, and one root lockfile.
- [x] Add a Turbo task graph for `format`, `lint`, `typecheck`, `test`, and `build` with correct dependencies/outputs and local cache only.
- [x] Reserve the root `prepare` boundary for Husky without adding speculative packages.

**Review / acceptance**

- [x] `apps/*` and `packages/*` are discovered from the root and internal packages use `workspace:` references.
- [x] Root tasks execute the intended package graph; cache hits cannot conceal missing outputs.
- [x] There is one pnpm lockfile, no npm/yarn lockfile, and no remote Turbo cache or secret-bearing cache configuration.
- [x] Clean checkout install and root task discovery are documented and repeatable.

**Evidence:** on 2026-08-02, local Node 24.18.0 and pnpm 11.18.0 matched the selected baseline. `pnpm install --frozen-lockfile` succeeded both in the working tree and in a disposable fresh candidate tree assembled from committed HEAD plus this change. The combined Turbo dry run and `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` all succeeded; zero package tasks are expected until F-02/F-03 add applications. A disposable app/package fixture proved discovery through both workspace globs, `workspace:*` resolution, package dependency ordering, build-output restoration after cached outputs were moved outside the repository, and format cache bypass. Repository searches found exactly one dependency lockfile and no npm/yarn lockfile, remote-cache enablement, cache credentials, or speculative application/shared-package scaffold. The repeatable commands are documented in `README.md` and its synchronized follower.

**Non-goals:** application scaffolding beyond the root boundary or speculative `common` packages.

### ISSUE-004 — [F-02] Scaffold the Next.js application

- **Status:** `DONE`
- **Remote state:** GitHub issue #4 closed on 2026-08-03.
- **Labels:** `type:task`, `area:web`, `priority:p0`
- **Blocked by:** ISSUE-003
- **PR boundary:** one minimal Web scaffold PR

**Outcome**

Create `apps/web` as a clean, independently buildable Next.js App Router TypeScript application.

**Work**

- [x] Scaffold App Router with `src/`, strict TypeScript, approved root scripts, and host-run pnpm/Turbo development.
- [x] Remove demo/template assets and unused dependencies.
- [x] Preserve the planned route/feature boundaries without creating auth, navigation, or agent behavior early.
- [x] Apply D-25 to the installed Web surface with exact Next.js 16.2.12 pins and native ESLint flat configuration.

**Review / acceptance**

- [x] Development start, lint, typecheck, tests if generated, and production build pass from root commands.
- [x] No Tailwind or second UI system is introduced.
- [x] No API secret/internal origin is exposed to the client bundle.
- [x] The scaffold contains no fake business behavior or unused generated example.

**Evidence:** on 2026-08-03, exact Next.js 16 installation, ESLint, route type generation, strict TypeScript, Turbopack production build, and a production `GET /` smoke returning `200` with `Trip Agent` passed. Next 16 generated its mandatory `react-jsx` setting and development route-type include. F-02 generated no test; W-01 later added app-local Vitest tooling and one render regression, while later Web test tasks own further coverage.

**Non-goals:** MUI integration, route groups, forms, or authentication.

### ISSUE-005 — [F-03] Scaffold the NestJS application

- **Status:** `DONE`
- **Remote state:** GitHub issue #5 is closed as completed; its closure was observed on 2026-08-03.
- **Labels:** `type:task`, `area:api`, `priority:p0`
- **Blocked by:** ISSUE-003
- **PR boundary:** one minimal API scaffold PR

**Outcome**

Create `apps/api` as a strict, independently buildable NestJS REST application with intentional lifecycle boundaries.

**Work**

- [x] Establish `/api/v1`, domain-module layout, test entry point, strict TypeScript, host-run development, and graceful shutdown.
- [x] Provide a process-only liveness endpoint.
- [x] Remove the default example controller or replace it with the intentional health entry.

**Review / acceptance**

- [x] Start, lint, typecheck, unit test, and production build pass from root commands.
- [x] Liveness does not pretend PostgreSQL is ready.
- [x] No empty `AgentModule`, database entity, auth bypass, or speculative provider integration exists.
- [x] Shutdown behavior is observable and exits without hanging resources.

**Evidence:** on 2026-08-03, API lint, strict typecheck, one unit test, two Supertest HTTP assertions, the combined test entry, and the production build passed. Root format, lint, typecheck, test, build, and frozen install also passed. Development and compiled production starts returned `200` with `{"status":"ok"}` from `GET /api/v1/health/live`; the removed starter root returned `404`, and each process stopped after one interrupt without hanging. Scope searches found no ORM, readiness, authentication, UsersModule, AgentModule, provider integration, nested lockfile, starter example, or unexplained TODO.
**Non-goals:** ORM, readiness, authentication, UsersModule, or LangGraph.

### ISSUE-006 — [F-04] Establish shared engineering configuration

- **Status:** `DONE`
- **Remote state:** GitHub issue #6 remained open when checked on 2026-08-05; no remote update was authorized or performed.
- **Labels:** `type:task`, `area:foundation`, `area:quality`, `priority:p0`
- **Blocked by:** ISSUE-004, ISSUE-005
- **PR boundary:** one shared-config PR

**Outcome**

Remove conflicting application-local engineering rules while keeping shared packages narrow and justified by real reuse.

**Work**

- [x] Establish one Prettier policy and shared strict TypeScript/ESLint configuration where both applications genuinely consume it.
- [x] Standardize root/package task names and Turbo outputs.
- [x] Define generated, secret, environment, build, test, and cache ignore rules.

**Review / acceptance**

- [x] Web/API use the same applicable rules without circular or deep configuration imports.
- [x] `format:check`, lint, typecheck, test, and build work from the root and fail on intentional violations.
- [x] Generated/environment files are ignored without hiding source or contract files.
- [x] No speculative utility/test package is created without two consumers.

**Evidence:** on 2026-08-05, both applications consumed narrow `@trip/config-typescript` and `@trip/config-eslint` packages through `workspace:*`; one exact root Prettier 3.9.6 policy and standardized root/package tasks were active while Next.js, Node, Jest, and Vitest concerns remained application-local. The exact Node/pnpm check, frozen install, `format:check`, forced lint/typecheck/test/build tasks, one Web render test, one API unit test, two API HTTP assertions, production builds, shared-config loading, five intentional negative rule probes, ignore allow/deny matrix, package-boundary audit, and a two-hit local-cache output-restoration run passed. One root lockfile remained, remote cache stayed disabled, and no competing lockfile, deep/circular config import, speculative `test-utils`, probe residue, or hidden source/contract file was found.

**Non-goals:** feature code, dependency upgrades unrelated to configuration, or remote cache.

### ISSUE-007 — [F-05] Add local PostgreSQL and pgvector infrastructure

- **Status:** `TODO`
- **Labels:** `type:task`, `area:database`, `area:infrastructure`, `priority:p0`
- **Blocked by:** ISSUE-005
- **PR boundary:** one local-infrastructure PR

**Outcome**

Provide repeatable local PostgreSQL/pgvector while preserving provisioner, migrator, and runtime privilege boundaries.

**Work**

- [ ] Add pinned Docker Compose database infrastructure, health check, named development volume, and `.env.example`.
- [ ] Use distinct non-production provisioner/migrator/runtime credentials; privileged bootstrap enables and verifies `vector` and records `extversion`.
- [ ] Keep Web/API host-run and exclude Redis.

**Review / acceptance**

- [ ] A clean environment starts, becomes healthy, verifies pgvector, stops, and restarts predictably.
- [ ] Only the provisioner can manage extensions/roles; only the migrator can perform approved DDL; runtime DDL/extension operations fail.
- [ ] No real credential is committed, logged, or embedded in an image.
- [ ] Tests/commands do not depend on a developer's existing volume.

**Evidence:** clean-start health/extension output and role-capability matrix.  
**Non-goals:** application containers, Redis, vector schema, or production database selection.

### ISSUE-008 — [W-01] Integrate MUI v9 with App Router SSR

- **Status:** `DONE`
- **Labels:** `type:task`, `area:web`, `area:ui`, `priority:p0`
- **Blocked by:** ISSUE-004
- **PR boundary:** one theme/SSR integration PR
- **Remote state:** GitHub issue #8 is closed as completed; its closure was observed on 2026-08-05.

**Outcome**

Provide one stable MUI v9 rendering and theme boundary for development and production.

**Work**

- [x] Add exact `@mui/material@9.2.0`, `@mui/icons-material@9.2.0`, `@mui/material-nextjs@9.1.1`, and approved Emotion dependencies; use the official `v16-appRouter` cache integration.
- [x] Establish `ThemeProvider`, theme tokens, fonts, and the chosen CSS-variable strategy in the root layout.
- [x] Add a local Client Component wrapper if MUI's `component` prop receives `next/link`, and keep URL-reading client controls behind layout-stable Suspense boundaries.
- [x] Add a minimal render/build regression test.

**Review / acceptance**

- [x] Development, server render, hydration, navigation, and production build show no style-order/hydration warning or flash caused by configuration.
- [x] Theme tokens apply consistently and support responsive/accessibility work.
- [x] No second component system or scattered global magic styling is introduced.

**Evidence:** on 2026-08-05, exact MUI/Emotion and required Web render-test pins were installed in the root lockfile. The root layout uses the official `v16-appRouter` cache provider, one theme/CSS baseline boundary, MUI CSS variables, and self-hosted Roboto. The Server Component page consumes theme spacing and palette tokens while retaining the default palette. Frozen install, the Web Vitest render regression, root lint/typecheck/test/build, production SSR style placement (three Emotion style elements in `head`, none in `body`), and two repeated client-navigation cycles passed with stable style counts and no relevant browser console errors. No MUI-to-`next/link` or URL-reading client control exists yet, so the conditional wrapper/Suspense requirement was satisfied by inspection without speculative code.

**Non-goals:** final branding, navigation, or auth forms.

### ISSUE-009 — [B-04] Implement PasswordPolicy and PasswordHasher

- **Status:** `TODO`
- **Labels:** `type:security`, `area:api`, `area:auth`, `priority:p0`
- **Blocked by:** ISSUE-005 and decision D-08
- **PR boundary:** one isolated password-security PR

**Outcome**

Create independently testable password-creation policy and Argon2id hashing boundaries without coupling login to future creation rules.

**Work**

- [ ] Centralize the 8–20 ASCII allowed set, category rules, and stable failure codes.
- [ ] Add a pinned, licensed, checksummed local whole-password blocklist with provenance, update cadence, and fail-closed creation behavior.
- [ ] Wrap and benchmark Argon2id hash/verify, bound concurrent cost, and document rehash/future-policy behavior.

**Review / acceptance**

- [ ] Tests cover 7/8/20/21, each missing category, allowed characters, printable-ASCII complement, whitespace, Unicode, unchanged paste input, and common passwords.
- [ ] Same input yields distinct salted hashes; correct/incorrect verification works; parameters meet the current approved OWASP floor and measured runtime budget.
- [ ] Login compatibility is explicitly preserved: current creation composition rules are not applied during hash verification.
- [ ] Candidate passwords, plaintext, and hashes never reach logs or remote password-check services.

**Evidence:** benchmark record, blocklist provenance/checksum, unit tests, and redaction test.  
**Non-goals:** sign-up/login endpoints, remote breach lookup, or a database pepper.

### ISSUE-010 — [B-09] Standardize API errors and request correlation

- **Status:** `TODO`
- **Labels:** `type:task`, `area:api`, `area:observability`, `priority:p0`
- **Blocked by:** ISSUE-005
- **PR boundary:** one transport/error-contract PR completed before sign-up/login

**Outcome**

Freeze a safe machine-readable API error/success envelope and correlated diagnostics before Web integration.

**Work**

- [ ] Define stable codes, `fieldErrors` arrays, safe English fallbacks, safe User serialization, and public/internal error separation.
- [ ] Add global exception handling, request/correlation ID, structured log redaction, JSON content-type/body-size handling, and no-store policy.
- [ ] Document the contract used by Web without requiring prose parsing.

**Review / acceptance**

- [ ] Multiple field failures are stable and actionable; unknown errors expose no stack, SQL, internal exception, or secret.
- [ ] Password input is never echoed and safe User serialization cannot include `password_hash`.
- [ ] Request IDs correlate response and internal log records without leaking private data.
- [ ] Auth/private cache headers and unsupported content/body behavior are directly testable.

**Evidence:** contract examples and positive/negative filter, redaction, correlation, and cache-header tests.  
**Non-goals:** business-specific endpoint implementation or Swagger generation.

### ISSUE-011 — [F-06] Add GitHub Actions pull-request CI

- **Status:** `TODO`
- **Labels:** `type:task`, `area:ci`, `area:security`, `priority:p0`
- **Blocked by:** ISSUE-006, ISSUE-007
- **PR boundary:** one CI workflow PR

**Outcome**

Make a stable least-privilege `ci-required` result the authoritative merge gate for trusted and forked pull requests.

**Work**

- [ ] Add workflows for `pull_request`, trusted `main` pushes, and `merge_group` when merge queue is enabled.
- [ ] On the selected versioned Ubuntu runner, use the frozen pnpm lockfile and Turbo to run formatting, lint, typecheck, tests, builds, and documentation policy checks.
- [ ] Start an ephemeral pinned PostgreSQL/pgvector service and isolate trusted/untrusted caches.
- [ ] Pin third-party Actions to full SHAs, use read-only top-level permissions, job-scoped escalation, explicit timeouts, concurrency cancellation, and an always-reported aggregate result.

**Review / acceptance**

- [ ] A deliberately failed job blocks `ci-required`; path-skipped work never leaves the required result pending.
- [ ] Fork PRs run without secrets; no untrusted code executes through `pull_request_target` or writes artifacts/caches later trusted by release jobs.
- [ ] Cache cannot bypass frozen-lockfile, generated-artifact, migration, or documentation drift checks.
- [ ] No production credential or real provider API is reachable from PR jobs.

**Evidence:** workflow permission/event review, fork simulation, failure/path-filter tests, Action SHA register, and CI run links.  
**Non-goals:** deployment, self-hosted runners, Alpine-based routine CI, or remote Turbo cache.

### ISSUE-012 — [F-07] Add local hooks and commit conventions

- **Status:** `TODO`
- **Labels:** `type:task`, `area:developer-experience`, `area:quality`, `priority:p1`
- **Blocked by:** ISSUE-003, ISSUE-006
- **PR boundary:** one hooks/conventions PR

**Outcome**

Provide fast local feedback while keeping CI—not bypassable hooks—the merge authority.

**Work**

- [ ] Configure root Husky installation, lint-staged Prettier/ESLint checks in `pre-commit`, and commitlint Conventional Commits in `commit-msg`.
- [ ] Validate squash PR titles in CI.
- [ ] Document normal use, partial staging behavior, and the fact that `--no-verify` is caught by authoritative CI/title checks.

**Review / acceptance**

- [ ] Valid staged changes/messages pass and failures are actionable.
- [ ] Partially staged files are not corrupted or expanded unexpectedly.
- [ ] Hooks contain no network, database, build, or full-suite work and complete within the agreed fast-feedback budget.
- [ ] A normal root install activates hooks without a global package dependency.

**Evidence:** clean-install hook test, partial-staging test, valid/invalid message examples, and CI title-check result.  
**Non-goals:** preventing all local bypasses or moving security gates out of CI.

### ISSUE-013 — [B-01] Add validated API configuration and TypeORM

- **Status:** `TODO`
- **Labels:** `type:task`, `area:api`, `area:database`, `priority:p0`
- **Blocked by:** ISSUE-005, ISSUE-007
- **PR boundary:** one configuration/database-foundation PR

**Outcome**

Create fail-fast API configuration, explicit TypeORM connection lifecycle, and separate migration/runtime responsibilities.

**Work**

- [ ] Validate port, runtime/migration database URLs, proxy trust, CORS/trusted origins, request limits, and JWT/cookie inputs at startup.
- [ ] Install exact `typeorm@1.1.0`, `@nestjs/typeorm@11.0.3`, and the approved PostgreSQL driver pins; target at least ES2023 and use `DataSource`/`DataSourceOptions` plus instance repositories only.
- [ ] Add DatabaseModule/ConfigModule boundaries, dependency-aware readiness, graceful shutdown, and an explicit migration command/job. Keep TypeORM 1's fail-closed `invalidWhereValuesBehavior`; use `IsNull()` for intentional null matching.
- [ ] Disable production `synchronize` and automatic application-start migrations.

**Review / acceptance**

- [ ] Missing, malformed, weak, or contradictory critical configuration fails before serving traffic with no secret echo.
- [ ] Liveness is process-only; readiness fails and recovers with PostgreSQL availability.
- [ ] Runtime connects with the least-privilege role and cannot perform DDL; migrator ownership is explicit.
- [ ] Dependency resolution proves the selected Nest adapter/TypeORM/PostgreSQL versions have no ignored peer conflict; removed TypeORM 0.3 APIs and string-based `select`/`relations` syntax are absent.
- [ ] Tests inject isolated configuration and close connections without hanging.

**Evidence:** configuration matrix, startup negative tests, readiness recovery test, role check, and graceful-shutdown transcript.  
**Non-goals:** User schema, automatic production migration, or vector columns.

### ISSUE-014 — [W-02] Create route groups and the application shell

- **Status:** `TODO`
- **Labels:** `type:feature`, `area:web`, `area:i18n`, `priority:p0`
- **Blocked by:** ISSUE-008
- **PR boundary:** one Web shell PR

**Outcome**

Establish public auth routes, protected-app route structure, empty route targets, and an English-first localization boundary.

**Work**

- [ ] Create `(auth)` and `(app)` route groups with Login, Sign Up, Dashboard, Flight Info, and User targets.
- [ ] Exclude application Navigation from auth pages and share one App Shell across protected targets.
- [ ] Add stable message keys, English catalog, locale-aware formatters, and intentional loading/error/not-found boundaries.

**Review / acceptance**

- [ ] Route-group names never appear in URLs; direct navigation and refresh work for every target.
- [ ] `html lang` and default locale are English and all user-visible shell copy comes from the catalog.
- [ ] Loading/error/not-found boundaries are scoped and recoverable.
- [ ] Adding another catalog would not require restructuring components or route ownership.

**Evidence:** route matrix, direct-refresh test, message-key completeness test, and desktop/narrow shell evidence.  
**Non-goals:** real session protection, final page content, or a language switcher.

### ISSUE-015 — [W-04] Create form-validation and API-access boundaries

- **Status:** `TODO`
- **Labels:** `type:task`, `area:web`, `area:auth`, `priority:p0`
- **Blocked by:** ISSUE-008, ISSUE-010 and decisions D-08/D-16
- **PR boundary:** one form/API foundation PR

**Outcome**

Give auth pages one accessible form/schema boundary and one typed, code-driven API adapter without exposing internal origins.

**Work**

- [ ] Select and document the form/schema approach.
- [ ] Centralize relative browser `/api/v1`, server-only internal API origin, credentials, timeout, parsing, and stable error-code mapping.
- [ ] Mirror password-policy intent through structured constraints and a checklist rather than scattered regexes; preserve paste/autofill.

**Review / acceptance**

- [ ] Components do not concatenate URLs or parse server prose.
- [ ] Server-only origins and configuration cannot enter a client bundle.
- [ ] Client feedback covers length, uppercase, lowercase, digit, and `$#@%`, while the server remains authoritative.
- [ ] Network, timeout, invalid response, global error, and multiple field-code paths remain distinguishable and accessible.
- [ ] All user-visible copy comes from message keys.

**Evidence:** adapter/schema tests, bundle/config exposure check, checklist tests, and error-mapping matrix.  
**Non-goals:** complete Sign Up/Login screens or generated OpenAPI client.

### ISSUE-016 — [F-08] Establish GitHub governance and security automation

- **Status:** `TODO`
- **Labels:** `type:governance`, `area:github`, `area:security`, `priority:p0`
- **Blocked by:** ISSUE-011, ISSUE-012 and decisions D-20/D-21/D-23/D-24
- **PR boundary:** one repository-files PR plus one auditable settings change set

**Outcome**

Protect the public repository with auditable governance without creating an impossible self-approval gate.

**Work**

- [ ] Add `CODEOWNERS` for `@Donny-Guo`, contribution/security guidance, PR/issue templates, and pnpm/Actions Dependabot; verify and maintain the standard MIT `LICENSE` with `Copyright (c) 2026 Donny-Guo`.
- [ ] Configure `main` for PR-only squash/linear history, resolved conversations, stable required CI, and no force push/deletion; keep bootstrap approval requirements satisfiable, configure no general required-check bypass, and require one non-author owned-path approval whenever eligible reviewers are available.
- [ ] Verify and enable applicable dependency review, CodeQL/code scanning, secret scanning, and push protection.
- [ ] Run the approved manual, non-required, three-PR advisory AI-review evaluation without a concurrent overlapping reviewer.

**Review / acceptance**

- [ ] Direct changes and required-check bypass are blocked; merging requires a green, self-reviewed pull request.
- [ ] `CODEOWNERS` covers workflows, auth/security, migrations, and agent/tools without requiring impossible self-approval.
- [ ] The MIT license is recognized with the approved notice; contribution/security paths are clear.
- [ ] Security features are enabled or any unavailable capability has an owner, equivalent control, and recorded risk.
- [ ] AI review remains advisory, stays within the documented evaluation scope, and cannot satisfy approval; useful findings, false positives, misses, and latency are recorded.

**Evidence:** repository-files PR, exported/screenshotted rules/security settings, bypass test, license detection, and AI-review evaluation record.

**Non-goals:** production deployment, automatic or merge-gating AI review, overlapping review bots, or a permanent zero-human-review policy.

### ISSUE-017 — [B-02] Create the `users` migration

- **Status:** `TODO`
- **Labels:** `type:task`, `area:database`, `area:auth`, `priority:p0`
- **Blocked by:** ISSUE-013 and decisions D-07/D-11/D-17/D-18
- **PR boundary:** migration-only PR with its integration tests

**Outcome**

Create the first race-safe, least-privilege `users` schema without speculative account fields.

**Work**

- [ ] Create UUID `id`, canonical ASCII `email` up to 254 characters, hidden `password_hash`, and UTC `created_at`/`updated_at`.
- [ ] Enforce trimmed/lowercase canonical email and uniqueness in PostgreSQL.
- [ ] Run the forward migration through the migrator role and document forward-repair/down behavior.

**Review / acceptance**

- [ ] Migration succeeds from an empty database and schema exactly matches Section 7 of `PLANS.md`.
- [ ] Direct noncanonical writes and concurrent duplicate canonical emails are database-rejected.
- [ ] Runtime DDL fails; extension work is not performed by the migration.
- [ ] No verification, status, role, vector, or refresh-token column is introduced.
- [ ] Repair/down guidance accounts for destructive rollback risk.

**Evidence:** clean migration output, schema snapshot/query, concurrency/constraint tests, and role-denial test.  
**Non-goals:** ORM auto-sync, seed users, or later account lifecycle fields.

### ISSUE-018 — [B-05] Create the access-JWT session boundary

- **Status:** `TODO`
- **Labels:** `type:security`, `area:api`, `area:auth`, `priority:p0`
- **Blocked by:** ISSUE-013 and decisions D-03/D-09/D-14/D-15/D-16
- **PR boundary:** one security-boundary PR

**Outcome**

Create reusable token issuance/verification, cookie, provenance, and private-cache controls for first-slice browser sessions.

**Work**

- [ ] Implement allowlisted `HS256`, required claims, 15-minute TTL, secret validation, JWT guard, and shared TokenIssuer.
- [ ] Implement exact production/local set/delete cookie profiles.
- [ ] Enforce JSON/body limits, exact trusted Origin with same-origin Referer fallback, missing/`null` rejection, Fetch Metadata defense in depth, and `no-store`.

**Review / acceptance**

- [ ] Unexpected algorithm, signature, `iss`, `aud`, claim, expiry, or clock-tolerance cases fail safely.
- [ ] Weak/missing secret fails startup; secrets never enter logs, source, response bodies, or client storage.
- [ ] Set/delete attributes match for both profiles and the browser cannot read the token.
- [ ] Untrusted/missing provenance, unsupported media type, and oversized bodies fail before mutation.
- [ ] Auth/private responses cannot be cached.

**Evidence:** JWT matrix, cookie parity tests, provenance/content/body negative tests, startup-secret test, and cache/redaction evidence.  
**Non-goals:** refresh tokens, Redis revocation, mobile auth, or broader CORS topology.

### ISSUE-019 — [W-03] Implement extensible Navigation

- **Status:** `TODO`
- **Labels:** `type:feature`, `area:web`, `area:ui`, `priority:p1`
- **Blocked by:** ISSUE-014
- **PR boundary:** one navigation PR

**Outcome**

Deliver semantic, responsive navigation for Dashboard, Flight Info, and User through a typed extensible configuration.

**Work**

- [ ] Use MUI AppBar/Toolbar and a Drawer/Menu appropriate for narrow screens.
- [ ] Render semantic links from typed configuration and localized message keys.
- [ ] Support active-route state and future permission/feature-flag filtering.

**Review / acceptance**

- [ ] Mouse, keyboard, touch, focus order, and browser refresh/direct-route behavior work.
- [ ] The current route is programmatically and visually identifiable without relying only on color.
- [ ] Narrow layouts do not overflow or trap focus; Drawer/Menu open/close behavior is announced and escapable.
- [ ] Filtering configuration cannot be mistaken for API authorization.

**Evidence:** component tests, keyboard/manual accessibility record, and desktop/narrow screenshots.  
**Non-goals:** RBAC enforcement or flight/user business content.

### ISSUE-020 — [B-03] Implement the UsersModule persistence boundary

- **Status:** `TODO`
- **Labels:** `type:task`, `area:api`, `area:database`, `area:auth`, `priority:p0`
- **Blocked by:** ISSUE-017
- **PR boundary:** one UsersModule persistence PR

**Outcome**

Provide narrow User persistence operations with a hard separation between safe public data and internal credential lookup.

**Work**

- [ ] Add intentional entity/repository/service capabilities for create and lookup by canonical email.
- [ ] Make ordinary selects exclude `password_hash`; expose credential material only through one internal auth-specific operation.
- [ ] Map unique conflicts to a stable domain result.

**Review / acceptance**

- [ ] No controller or ordinary query can serialize/select `password_hash` by default.
- [ ] Create and canonical-email lookup work against real PostgreSQL.
- [ ] Concurrent uniqueness conflicts map deterministically without check-then-create race assumptions.
- [ ] Module exports are minimal and do not leak ORM entities as API responses.

**Evidence:** PostgreSQL integration tests, serialization/selection negative tests, and concurrent conflict test.  
**Non-goals:** sign-up orchestration, password hashing, or profile management.

### ISSUE-021 — [B-06] Implement sign-up and automatic login API

- **Status:** `TODO`
- **Labels:** `type:feature`, `area:api`, `area:auth`, `priority:p0`
- **Blocked by:** ISSUE-009, ISSUE-010, ISSUE-018, ISSUE-020
- **PR boundary:** one sign-up endpoint PR

**Outcome**

Deliver authoritative registration that creates one User and immediately establishes the approved browser session.

**Work**

- [ ] Add DTO/global validation, canonical email normalization, PasswordPolicy/blocklist checks, hashing, and transactional User creation.
- [ ] Map field, common-password, unknown-field, and unique-conflict outcomes to the frozen contract.
- [ ] Reuse TokenIssuer and return only the safe User plus stable `messageCode`.

**Review / acceptance**

- [ ] Valid input returns `201`, one row with a hash, and the exact HttpOnly session cookie.
- [ ] Empty, malformed, length/category/character/common-password, media-type, body-size, and unknown-field cases return safe actionable `400`.
- [ ] Duplicate canonical email returns `409`; exactly one of two concurrent registrations succeeds.
- [ ] Response, logs, traces, screenshots, and errors contain no password, hash, or token.

**Evidence:** endpoint contract/integration tests, concurrent registration test, database row inspection, and redaction check.  
**Non-goals:** email verification, refresh token, role, or public rate limiting.

### ISSUE-022 — [B-07] Implement login API

- **Status:** `TODO`
- **Labels:** `type:feature`, `area:api`, `area:auth`, `priority:p0`
- **Blocked by:** ISSUE-009, ISSUE-010, ISSUE-018, ISSUE-020
- **PR boundary:** one login endpoint PR

**Outcome**

Authenticate existing users without account enumeration or accidental lockout after password-policy evolution.

**Work**

- [ ] Validate transport shape and the 1,024-byte password transport cap; canonicalize email only.
- [ ] Verify the exact submitted password against the stored hash without applying creation composition rules.
- [ ] Run one fixed dummy Argon2id verification for unknown accounts and return one `INVALID_CREDENTIALS` contract for both failure causes.
- [ ] Set the approved access cookie on success.

**Review / acceptance**

- [ ] Valid credentials return `200`, safe User data, and the exact cookie.
- [ ] Unknown email and wrong password execute the intended expensive path and return structurally identical `401` responses; tests do not assert brittle timing equality.
- [ ] Missing/invalid transport input returns `400`; oversized input does not enter hash work.
- [ ] A stored password remains usable after a simulated creation-policy change.
- [ ] No sensitive value is exposed or persisted client-side.

**Evidence:** endpoint tests, dummy-path spy/evidence, old-policy compatibility test, cookie test, and log scan.  
**Non-goals:** active revocation, password reset, or revealing why credentials failed.

### ISSUE-023 — [B-08] Add current-user, logout, and authorization protection

- **Status:** `TODO`
- **Labels:** `type:feature`, `area:api`, `area:auth`, `priority:p0`
- **Blocked by:** ISSUE-010, ISSUE-018, ISSUE-020
- **PR boundary:** one session-read/logout/guard PR

**Outcome**

Provide the API authority needed to restore, protect, and end first-slice sessions.

**Work**

- [ ] Add `GET /api/v1/auth/me`, idempotent `POST /api/v1/auth/logout`, reusable JWT guard, exact cookie deletion, and no-store private responses.
- [ ] Return only the safe User contract.
- [ ] Document the accepted lack of active server revocation in this slice.

**Review / acceptance**

- [ ] Valid tokens return safe User data; missing, invalid, wrong-claim, and expired tokens return `401`.
- [ ] Logout is idempotent and clears the exact cookie tuple.
- [ ] NestJS guard remains the final authorization boundary regardless of Web routing.
- [ ] Private content and `Set-Cookie` responses are never cacheable.

**Evidence:** guard/endpoint integration tests, cookie deletion parity, cache headers, and safe-serialization check.  
**Non-goals:** refresh-token storage, Redis, device sessions, or logout-driven active revocation.

### ISSUE-024 — [B-10] Add comprehensive API automation

- **Status:** `TODO`
- **Labels:** `type:test`, `area:api`, `area:database`, `area:security`, `priority:p0`
- **Blocked by:** ISSUE-021, ISSUE-022, ISSUE-023
- **PR boundary:** one API test-completion PR; production fixes remain in their owning issue when practical

**Outcome**

Create an isolated, repeatable API suite that proves the complete contract and security boundaries.

**Work**

- [ ] Complete unit coverage for DTOs, normalization, PasswordPolicy/Argon2id, JWT, provenance, error mapping, and redaction.
- [ ] Complete real-PostgreSQL repository/migration/role tests.
- [ ] Complete sign-up/login/me/logout API integration/E2E scenarios from `PLANS.md`.

**Review / acceptance**

- [ ] Coverage includes all 7/8/20/21, category, character, blocklist, email, unknown-field, media-type, body-size, duplicate/concurrency, cookie, Origin/Referer, no-store, JWT, session, dummy-hash, wrong-password, policy-evolution, database-role, and leakage cases.
- [ ] Tests are order independent, use isolated data, and need no real third-party API or developer volume.
- [ ] Failure artifacts and test logs are free of passwords, hashes, tokens, and connection secrets.
- [ ] Each security control has at least one direct negative test rather than only line coverage.

**Evidence:** CI test report, scenario-to-test traceability matrix, and sanitized failure artifacts.  
**Non-goals:** browser UI automation or an arbitrary coverage percentage as a substitute for behavior.

### ISSUE-025 — [W-05] Restore sessions, log out, and protect Web routes

- **Status:** `TODO`
- **Labels:** `type:feature`, `area:web`, `area:auth`, `priority:p0`
- **Blocked by:** ISSUE-014, ISSUE-023
- **PR boundary:** one Web session/protection PR

**Outcome**

Protect the `(app)` route group server-side, restore private sessions safely, and distinguish authentication failure from API outage.

**Work**

- [ ] In the protected layout, call `/auth/me` through the server-only internal origin, forward the incoming cookie explicitly, and force no-store behavior.
- [ ] Redirect a real `401` to Login, render a recoverable API-outage state, sanitize same-origin relative return paths, and prevent loops/private-content flash.
- [ ] Add logout that clears client User state after the API clears the cookie.

**Review / acceptance**

- [ ] Unauthenticated direct/refresh access never renders private content.
- [ ] Invalid/expired credentials return to Login without loops; an outage is not mislabeled as `401`.
- [ ] Open/protocol-relative/cross-origin return URLs are rejected.
- [ ] Browser code cannot read the token and no private response is cached.
- [ ] Logout clears the exact cookie and local user state.

**Evidence:** server-route tests, redirect matrix, outage test, cache evidence, and browser storage inspection.  
**Non-goals:** NestJS authorization replacement or refresh-token behavior.

### ISSUE-026 — [W-06] Implement the Sign Up page

- **Status:** `TODO`
- **Labels:** `type:feature`, `area:web`, `area:auth`, `area:accessibility`, `priority:p0`
- **Blocked by:** ISSUE-015, ISSUE-021, ISSUE-025
- **PR boundary:** one Sign Up page PR

**Outcome**

Deliver an accessible English Sign Up experience with real API feedback and automatic entry to Dashboard.

**Work**

- [ ] Build MUI email/password fields, labels, visibility control, requirements checklist, loading/disabled states, duplicate-submit prevention, field errors, and form alert.
- [ ] Map local validation and stable server codes, including blocklist and duplicate email.
- [ ] Support keyboard submission, paste, autofill/password managers, focus management, and announced errors/success.

**Review / acceptance**

- [ ] Empty/invalid email and every password requirement receive specific immediate feedback without relying only on color.
- [ ] Server blocklist/`409`/network/outage responses are distinguishable and actionable.
- [ ] Successful `201` waits for the cookie response and enters Dashboard exactly once.
- [ ] Password/token never enters URL, analytics, logs, persistent state, or screenshot evidence.
- [ ] Narrow and desktop layouts meet the agreed WCAG 2.2 AA-oriented checks.

**Evidence:** component tests, keyboard/screen-reader-oriented manual record, automated accessibility result, and responsive screenshots.  
**Non-goals:** email verification, profile fields, or a language switcher.

### ISSUE-027 — [W-07] Implement the Login page

- **Status:** `TODO`
- **Labels:** `type:feature`, `area:web`, `area:auth`, `area:accessibility`, `priority:p0`
- **Blocked by:** ISSUE-015, ISSUE-022, ISSUE-025
- **PR boundary:** one Login page PR

**Outcome**

Deliver an accessible English Login experience that preserves generic credential failure and password-policy compatibility.

**Work**

- [ ] Build MUI email/password fields and complete idle/loading/success/validation/credential/outage states.
- [ ] Map `INVALID_CREDENTIALS` to one message for both failure causes.
- [ ] Validate email/transport shape only; do not apply sign-up composition rules to login.
- [ ] Prevent duplicate requests and support keyboard, paste, and autofill.

**Review / acceptance**

- [ ] Empty/invalid email feedback is local and accessible.
- [ ] Unknown email and wrong password are visually and structurally indistinguishable.
- [ ] A test password that violates a later creation rule remains submit-able.
- [ ] Successful login enters Dashboard once; outage and `401` behavior are distinct.
- [ ] Password/token never reaches URL, logs, analytics, or persistent client state.

**Evidence:** component/request-state tests, credential-equivalence test, compatibility test, accessibility result, and responsive screenshots.  
**Non-goals:** forgot password, MFA, or account-status messages.

### ISSUE-028 — [W-08] Add Web component and accessibility automation

- **Status:** `TODO`
- **Labels:** `type:test`, `area:web`, `area:accessibility`, `priority:p0`
- **Blocked by:** ISSUE-019, ISSUE-026, ISSUE-027
- **PR boundary:** one Web test-completion PR

**Outcome**

Prove Web behavior, responsive navigation, message completeness, and accessible form interaction without overfitting implementation details.

**Work**

- [ ] Test form states, checklist transitions, API-code mapping, duplicate-submit prevention, Navigation states, and locale-message completeness.
- [ ] Add automated accessibility checks and documented keyboard/focus manual checks.
- [ ] Cover representative desktop and narrow layouts.

**Review / acceptance**

- [ ] Tests query semantic roles/names and observable behavior rather than internal component structure.
- [ ] No serious automated accessibility violation remains; exceptions have owner and justification.
- [ ] Errors are associated, findable, announced, and not color-only; focus is not lost or trapped.
- [ ] Navigation remains usable with keyboard, touch, and narrow viewport.

**Evidence:** Web test report, accessibility output, keyboard checklist, and responsive snapshots.  
**Non-goals:** claiming full WCAG conformance from automation alone.

### ISSUE-029 — [I-01] Integrate the registration path

- **Status:** `TODO`
- **Labels:** `type:integration`, `area:web`, `area:api`, `area:database`, `priority:p0`
- **Blocked by:** ISSUE-021, ISSUE-026
- **PR boundary:** one registration-integration PR/configuration change

**Outcome**

Verify real Web → same-origin Gateway → API → PostgreSQL registration behavior and trust boundaries.

**Work**

- [ ] Exercise proxy trust, exact Origin/Referer, media/body limits, environment routing, error codes, email normalization, password boundaries, cookie, and cache headers.
- [ ] Cover success, validation/category/character/blocklist, duplicate email, provenance failure, and API outage.
- [ ] Inspect persistence and browser-visible state.

**Review / acceptance**

- [ ] Valid registration creates one hashed row, sets an unreadable cookie, and enters Dashboard.
- [ ] All negative paths match the frozen contract and create no partial row.
- [ ] Gateway never caches private or `Set-Cookie` responses and cannot weaken provenance checks.
- [ ] Database has no plaintext password and Web cannot read JWT.

**Evidence:** integration transcript/tests, database inspection, browser storage/cookie evidence, and gateway cache-header result.  
**Non-goals:** public internet exposure or provider integration.

### ISSUE-030 — [I-02] Integrate the login and session path

- **Status:** `TODO`
- **Labels:** `type:integration`, `area:web`, `area:api`, `area:auth`, `priority:p0`
- **Blocked by:** ISSUE-022, ISSUE-025, ISSUE-027
- **PR boundary:** one login/session-integration PR

**Outcome**

Verify real login, restore, expiry, logout, error, cache, and policy-evolution behavior across Web and API.

**Work**

- [ ] Exercise valid/wrong/unknown credentials, dummy-hash path, cookie set/delete parity, no-store restore, expiry, redirect, outage, and logout.
- [ ] Simulate a creation-policy change and retry a previously stored credential.
- [ ] Validate same-origin return paths and gateway behavior.

**Review / acceptance**

- [ ] Success enters Dashboard; refresh restores the session without a write or shared cache.
- [ ] Both invalid-credential causes remain externally identical.
- [ ] Expiry returns to Login without loops/private flash; outage is a recoverable non-`401` state.
- [ ] Logout clears the cookie tuple and client state.
- [ ] Existing stored credentials bypass new creation-policy checks during login.

**Evidence:** cross-layer integration tests, redirect/outage matrix, cookie/cache proof, dummy-path proof, and policy-change regression.  
**Non-goals:** refresh rotation or active token revocation.

### ISSUE-031 — [E2E-01] Automate the critical browser journey

- **Status:** `TODO`
- **Labels:** `type:test`, `area:e2e`, `area:auth`, `priority:p0`
- **Blocked by:** ISSUE-019, ISSUE-029, ISSUE-030
- **PR boundary:** one critical-path browser automation PR

**Outcome**

Protect the main user journey with repeatable, isolated browser automation suitable for CI.

**Work**

- [ ] Automate Sign Up → automatic Dashboard → Dashboard/Flight Info/User navigation → refresh restore → logout → Login.
- [ ] Cover duplicate registration, password-policy failures, wrong credentials, and unauthenticated protected access.
- [ ] Isolate database state and sanitize screenshots, videos, traces, and logs.

**Review / acceptance**

- [ ] Tests pass repeatedly in CI without ordering, retries masking defects, production data, or real external providers.
- [ ] Locators use accessible roles/names and assertions verify user-observable state.
- [ ] Failure artifacts contain no entered password, cookie/token value, or connection secret.
- [ ] Each critical transition fails clearly when its underlying contract is intentionally broken.

**Evidence:** repeated CI runs, test-to-journey map, and sanitized failure-artifact inspection.  
**Non-goals:** exhaustive browser/device coverage or public load testing.

### ISSUE-032 — [Q-01] Run the full quality and security review

- **Status:** `TODO`
- **Labels:** `type:quality-gate`, `area:security`, `priority:p0`
- **Blocked by:** ISSUE-016, ISSUE-024, ISSUE-028, ISSUE-031 and all transitive first-slice work
- **PR boundary:** evidence/review issue; fixes remain focused PRs linked back here

**Outcome**

Determine whether the local auth vertical slice is fit for handoff without implying public-release readiness.

**Work**

- [ ] Run every local/CI format, lint, type, unit, integration, component, E2E, and production-build gate.
- [ ] Audit dependencies, Action pins, workflow permissions/events/cache trust, required checks, rules, ownership, proxy/CORS/origin, cookies/cache, database privileges, logs/responses, environment files, password dataset/policy, accessibility, and English catalog.
- [ ] Record risks, owners, remediation issues, and any accepted limitations.

**Review / acceptance**

- [ ] All authoritative checks pass and required results cannot remain pending after path skips.
- [ ] No skipped test, mutable workflow dependency, hard-coded secret, unexplained TODO, or unresolved high-severity supported scan finding remains.
- [ ] Security/privacy/accessibility findings have evidence and owners.
- [ ] Review explicitly states that this authorizes local handoff only; D-19/R-14 still block public exposure.

**Evidence:** signed checklist, CI/security scan links, risk register, and remediation issue links.  
**Non-goals:** production approval or waiving a failed gate for schedule.

### ISSUE-033 — [H-01] Synchronize documentation and hand off the slice

- **Status:** `TODO`
- **Labels:** `type:docs`, `area:documentation`, `priority:p0`
- **Blocked by:** ISSUE-032
- **PR boundary:** one documentation/status closeout PR

**Outcome**

Leave one current, reproducible description of the implemented local slice for a new engineer and future sessions.

**Work**

- [ ] Update actual versions, structure, commands, environment variables, migrations, contracts, tests, risks, and status in authoritative English documentation.
- [ ] Synchronize every existing `_ZH.md` follower, including task/decision/issue IDs and dependencies.
- [ ] Remove or explain stale statements/residue and keep the public-release gate visibly closed.

**Review / acceptance**

- [ ] A clean-checkout developer can start and verify the system using English docs alone.
- [ ] Documentation matches code, migrations, runtime behavior, and GitHub checks.
- [ ] Local links, English-primary checks, stable ID/status parity, and follower structure pass.
- [ ] No implementation artifact is claimed without evidence and no temporary handoff residue remains.

**Evidence:** clean-start transcript, documentation validation output, synchronized status diff, and residual-risk list.  
**Non-goals:** public deployment or silently closing later backlog.

## 6. Post-MVP issue specifications

These drafts remain outside the first-slice implementation authority. Before starting an entry marked `Epic`, create and link outcome-sized child issues with their own tests, rollback boundaries, and acceptance evidence.

### ISSUE-034 — [R-01] Establish Swagger/OpenAPI and a generated client

- **Status:** `TODO (later)`
- **Labels:** `type:feature`, `area:api`, `area:web`, `area:contract`, `scope:post-mvp`
- **Blocked by:** ISSUE-033
- **PR boundary:** contract foundation followed by generated-client adoption; split if the diff cannot be reviewed coherently

**Outcome**

Make OpenAPI the reproducible REST contract source and remove manually duplicated Web response models.

**Work**

- [ ] Document current schemas, cookie authentication, error codes, response headers, and safe examples.
- [ ] Generate `packages/api-client` deterministically and add CI drift detection.
- [ ] Define review/version/migration policy for breaking changes and generation-tool upgrades.

**Review / acceptance**

- [ ] Generated output is reproducible from a clean checkout and never hand-edited.
- [ ] Web uses the generated contract for migrated endpoints; duplicate manual models are removed.
- [ ] Auth cookies, `no-store`, errors, and sensitive-field exclusions are accurately represented.
- [ ] CI fails on contract/generated drift and breaking changes include migration guidance.

**Evidence:** generation command/output hash, drift negative test, contract test, and Web adoption proof.  
**Non-goals:** changing endpoint semantics merely to suit a generator.

### ISSUE-035 — [R-02] Add public-exposure authentication controls

- **Status:** `TODO (later)`
- **Labels:** `type:epic`, `area:security`, `area:api`, `area:redis`, `scope:post-mvp`
- **Blocked by:** ISSUE-033; ISSUE-034 is the recommended contract prerequisite
- **PR boundary:** Epic; split rate limiting, headers/proxy, audit, outage behavior, and runbook into child issues

**Outcome**

Close the mandatory abuse-resistance and operational gaps before any public/shared authentication endpoint exists.

**Work**

- [ ] Add Redis-backed distributed limits for auth and future mail endpoints with approved dimensions, thresholds, override, privacy-safe identifiers, and operator runbook.
- [ ] Add safe audit events, security headers, explicit proxy-trust validation, and documented abuse response.
- [ ] Define and test fail-open/fail-closed behavior for Redis/network outages across replicas.

**Review / acceptance**

- [ ] Limits work across replicas and cannot be bypassed with spoofed forwarding headers or simple key variation.
- [ ] Audit/log data contains no credential, token, or unnecessary personal data and has retention/access ownership.
- [ ] Headers, proxy topology, override controls, and degraded behavior have real integration tests and operational evidence.
- [ ] The Epic and all mandatory children close before R-14.

**Evidence:** distributed integration/load test, spoofing test, outage exercise, header scan, audit sample, and runbook drill.  
**Non-goals:** declaring the entire product production-ready or using in-memory limits in production.

### ISSUE-036 — [R-03] Add refresh-token rotation and revocation

- **Status:** `TODO (later)`
- **Labels:** `type:epic`, `area:security`, `area:auth`, `area:database`, `area:redis`, `scope:post-mvp`
- **Blocked by:** ISSUE-033, ISSUE-035 and approved session/device semantics; ISSUE-034 recommended
- **PR boundary:** Epic with design, persistence, API, Web, and security-test children

**Outcome**

Support longer sessions that can be rotated, detected on replay, and revoked without weakening cookie/CSRF controls.

**Work**

- [ ] Approve session/device/family semantics, hashed refresh records, TTLs, key rotation, reuse detection, family revocation, and Redis/database responsibility.
- [ ] Implement rotation concurrency, logout/security-event revocation, cookie transport, and degraded-state behavior.
- [ ] Add migration, cleanup, operator, and incident runbooks.

**Review / acceptance**

- [ ] Refresh secrets are never stored recoverably or exposed to JavaScript/logs.
- [ ] Replaying an old refresh token revokes the intended family; concurrent legitimate refresh behavior is deterministic.
- [ ] Logout/security events revoke sessions and key/Redis/database outages have tested safe behavior.
- [ ] Cookie, Origin/CSRF, TTL, cleanup, migration, and rollback evidence agree with the approved design.

**Evidence:** approved design, threat model, migration tests, replay/concurrency suite, outage exercise, and revocation demonstration.

**Non-goals:** OAuth/social login or silently changing the access-token contract.

### ISSUE-037 — [R-04] Add mail foundation and email verification

- **Status:** `TODO (later)`
- **Labels:** `type:epic`, `area:auth`, `area:mail`, `area:database`, `scope:post-mvp`
- **Blocked by:** ISSUE-034, ISSUE-035 and approved provider/domain/bounce/template design
- **PR boundary:** Epic with provider foundation, schema/token, API, templates, and E2E children

**Outcome**

Verify email ownership through privacy-safe, observable, single-use delivery without leaking account existence.

**Work**

- [ ] Decide unverified-user permissions, provider/local capture, sender domain, bounce handling, templates, retention, and delivery observability.
- [ ] Add `email_verified_at`, hashed random one-time token, TTL, resend throttle, verify/resend APIs, audit events, and migration.
- [ ] Automate registration-to-verification and failure paths.

**Review / acceptance**

- [ ] Raw tokens are not recoverable from storage or logs; expired, replayed, and forged tokens fail safely.
- [ ] Resend and public responses do not expose account existence and are rate-limited across replicas.
- [ ] Delivery/bounce failures are observable and actionable without logging sensitive content.
- [ ] Migration/backfill, template accessibility/localization boundary, and full automation pass.

**Evidence:** threat model, migration/token tests, mail-capture E2E, enumeration comparison, delivery dashboard, and runbook.  
**Non-goals:** marketing email or password reset.

### ISSUE-038 — [R-05] Add forgot/reset password

- **Status:** `TODO (later)`
- **Labels:** `type:feature`, `area:auth`, `area:mail`, `area:security`, `scope:post-mvp`
- **Blocked by:** ISSUE-035, ISSUE-036, ISSUE-037
- **PR boundary:** split request and reset completion if needed; both close this issue

**Outcome**

Allow secure password recovery without account enumeration, reusable tokens, or surviving compromised sessions.

**Work**

- [ ] Add generic request responses, hashed random single-use short-TTL reset tokens, rate limits, notification mail, audit, and secure password replacement.
- [ ] Apply the then-current PasswordPolicy and revoke prior sessions after success.
- [ ] Define delivery failure, concurrency, replay, and operator behavior.

**Review / acceptance**

- [ ] Unknown/existing-account request responses match externally.
- [ ] Token is not logged or recoverable and cannot be replayed after use/expiry.
- [ ] New password follows current policy; old password and prior sessions stop working.
- [ ] Rate-limit, delivery, audit, concurrency, and abuse cases have automated coverage.

**Evidence:** enumeration/replay tests, mail E2E, session-revocation proof, audit sample, and rate-limit test.  
**Non-goals:** support-agent password assignment or security-question recovery.

### ISSUE-039 — [R-06] Establish account lifecycle status

- **Status:** `TODO (later)`
- **Labels:** `type:feature`, `area:domain`, `area:auth`, `area:data-governance`, `scope:post-mvp`
- **Blocked by:** ISSUE-033 and approved business/operations semantics
- **PR boundary:** design/domain/migration first; behavior may be child issues

**Outcome**

Introduce only lifecycle states backed by explicit business transitions, authorization, retention, recovery, and operations.

**Work**

- [ ] Decide whether `active`, `suspended`, `deactivated`, and `deleted` are truly distinct and necessary.
- [ ] Define transition authority, login/session effect, data retention/deletion, recovery, audit, migration/backfill, and repair.
- [ ] Implement a typed domain service and guards rather than free-form conditionals.

**Review / acceptance**

- [ ] No ambiguous/free-form state exists; every state and transition has one documented meaning and owner.
- [ ] Unauthorized transitions and bypassed login/session paths are denied and tested.
- [ ] Audit, retention, recovery, default/backfill, repair, and compatibility behavior agree.
- [ ] UI copy does not reveal sensitive suspension/security detail.

**Evidence:** approved design/state diagram, permission matrix, migration tests, transition suite, audit samples, and operations runbook.

**Non-goals:** RBAC without an approved restricted operation or irreversible hard deletion by default.

### ISSUE-040 — [R-07] Establish RBAC and authorization

- **Status:** `TODO (later)`
- **Labels:** `type:epic`, `area:authorization`, `area:api`, `area:web`, `scope:post-mvp`
- **Blocked by:** ISSUE-033, one approved restricted operation/use case; ISSUE-039 only when status-dependent
- **PR boundary:** Epic with matrix/schema, API enforcement, administration, UI, and test children

**Outcome**

Enforce a deny-by-default permission model derived from real operations rather than speculative role names.

**Work**

- [ ] Approve a permission matrix and role/permission/assignment schema with administration and audit boundaries.
- [ ] Implement NestJS authorization at the business/API boundary and optional Web navigation filtering.
- [ ] Add migration, least-privilege administration, escalation, stale-session, and change-propagation behavior.

**Review / acceptance**

- [ ] API independently denies unauthorized and privilege-escalation attempts; hidden navigation is never treated as security.
- [ ] Permission matrix, schema, guards/policies, management endpoints, and tests agree.
- [ ] Role/permission changes are authorized, audited, and reflected with approved session/cache semantics.
- [ ] No default wildcard or owner bypass exists.

**Evidence:** permission matrix, threat model, migration tests, negative authorization suite, audit samples, and UI/API comparison.  
**Non-goals:** creating roles without a real restricted operation.

### ISSUE-041 — [R-08] Add Simplified Chinese product localization

- **Status:** `TODO (later)`
- **Labels:** `type:feature`, `area:web`, `area:i18n`, `area:accessibility`, `scope:post-mvp`
- **Blocked by:** ISSUE-014, ISSUE-033
- **PR boundary:** one locale framework/preference change plus reviewed catalog content

**Outcome**

Add `zh-CN` without duplicating component logic or breaking routing, formatting, accessibility, or narrow layouts.

**Work**

- [ ] Decide locale URL/persistence based on SEO and preference requirements.
- [ ] Add switcher, `zh-CN` catalog, fallback, date/time/number/currency formatting, and translation QA workflow.
- [ ] Enforce missing/extra key parity in CI.

**Review / acceptance**

- [ ] English and `zh-CN` catalogs are complete and component code does not branch on copied prose.
- [ ] Preference survives refresh and server/client locale output does not hydrate differently.
- [ ] Dates/numbers/currency and `lang` attributes are locale-correct.
- [ ] Keyboard/screen-reader behavior and narrow layouts tolerate both languages.

**Evidence:** key-parity test, locale persistence/SSR test, bilingual screenshots, and translation/accessibility review.  
**Non-goals:** additional locales or automated translation without human QA.

### ISSUE-042 — [R-10] Complete privacy, data-governance, and threat modeling

- **Status:** `TODO (later)`
- **Labels:** `type:epic`, `area:security`, `area:privacy`, `area:governance`, `scope:post-mvp`
- **Blocked by:** ISSUE-033; revisit for every provider or new sensitive data class
- **PR boundary:** Epic with inventory, threat model, provider review, lifecycle, and incident/runbook children

**Outcome**

Create an approved data and trust-boundary baseline before external travel/model providers or public exposure.

**Work**

- [ ] Inventory personal, travel, payment-adjacent, log/trace, prompt, tool, and provider data flows.
- [ ] Define purpose/consent, minimization, retention/deletion/export, regional/vendor constraints, access, redaction, and incident handling.
- [ ] Threat-model prompt injection, tool authorization, cross-user/tenant isolation, provider data use, and abuse cases.

**Review / acceptance**

- [ ] Every sensitive field has a purpose, owner, source, destination, retention, access, and deletion/export path.
- [ ] Trust boundaries and provider contractual/configuration posture are explicitly approved.
- [ ] High-risk abuse cases have tested mitigations or executable runbooks.
- [ ] Logs/traces/evaluations use minimized or synthetic data and deletion behavior is demonstrated.

**Evidence:** data-flow diagrams, inventory, threat model, provider review, retention/deletion test, and incident tabletop.  
**Non-goals:** legal guarantees by engineering documentation alone.

### ISSUE-043 — [R-09] Containerize and establish GitHub delivery/operations

- **Status:** `TODO (later)`
- **Labels:** `type:epic`, `area:infrastructure`, `area:delivery`, `area:operations`, `priority:p0`, `scope:post-mvp`
- **Blocked by:** ISSUE-033 and approved platform, region, registry, environments, domain/TLS, ownership, RPO/RTO/SLO inputs
- **PR boundary:** Epic; mandatory children for image benchmark, images, trusted build/publish, staging, production gate, migrations, observability, backup/restore, and rollback

**Outcome**

Build reproducible non-root Web/API images once and promote the same verified digests through safe, observable environments.

**Work**

- [ ] Benchmark pinned LTS Debian slim and Alpine candidates across `glibc`/`musl`, native addons, Next artifacts, architectures, update latency, cold/warm build, size, startup, scans, and smoke behavior.
- [ ] Produce minimal multi-stage images with filtered artifacts, frozen installs, safe caches, read-only runtime posture, health/shutdown behavior, and no build tools/secrets.
- [ ] From trusted commits, scan, SBOM, attest, publish immutable digests, and promote the same digest through protected environments using scoped OIDC and explicit migration jobs.
- [ ] Establish smoke, rollback, backup/restore exercises, logs/redaction, dashboards, SLO/alerts, concurrency, approvals, and on-call runbooks.

**Review / acceptance**

- [ ] Base-image selection uses measured compatibility/value, never size alone.
- [ ] Images are reproducible, digest-pinned, non-root, architecture-tested, and free of development dependencies, caches, toolchains, and secrets.
- [ ] PR code cannot access deployment credentials/production; OIDC is ref/environment scoped.
- [ ] Staging/production run the same approved digest; Web/API independently deploy and roll back.
- [ ] Restore meets approved RPO/RTO; health, shutdown, migration ownership, SLO, alerts, approval, and concurrency controls are exercised.

**Evidence:** child-issue closure, benchmark and selection rationale, image inventory/scans/SBOM/attestation, OIDC policy, deployment/rollback logs, restore report, dashboards, and runbook drills.

**Non-goals:** choosing a platform before inputs are approved or storing production data in application containers.

### ISSUE-044 — [R-11] Design and validate vector retrieval

- **Status:** `TODO (later)`
- **Labels:** `type:epic`, `area:agent`, `area:database`, `area:retrieval`, `scope:post-mvp`
- **Blocked by:** ISSUE-042 and approved use case, corpus, embedding model/version, privacy class, and evaluation metric
- **PR boundary:** design/evaluation first; schema/ingestion/query children only after approval

**Outcome**

Prove retrieval quality, privacy, lifecycle, and cost before adding any vector schema or index.

**Work**

- [ ] Record and approve the vector design in `PLANS.md`, covering extension provisioning, schema ownership, chunking, metadata/tenant isolation, dimension, distance, index, filters, versioning/re-embedding, and deletion.
- [ ] Build an offline representative evaluation for recall/quality, latency, and cost.
- [ ] Design migration, ingestion, delete, re-embed, and rollback paths.

**Review / acceptance**

- [ ] No vector table/column/index precedes the approved design and evaluation.
- [ ] Representative quality/latency/cost thresholds pass with reproducible model/corpus versions.
- [ ] Cross-user/tenant and sensitive-data isolation have direct negative tests.
- [ ] Delete/re-embed and schema/index changes are migration-driven and observable.

**Evidence:** approved plan, versioned evaluation dataset/results, isolation tests, migration plan, and cost record.

**Non-goals:** vector use solely because pgvector is installed.

### ISSUE-045 — [R-12] Implement the first travel-agent vertical slice

- **Status:** `TODO (later)`
- **Labels:** `type:epic`, `area:agent`, `area:api`, `area:web`, `priority:p1`, `scope:post-mvp`
- **Blocked by:** ISSUE-042 plus approved travel use case/provider/tool/streaming/human-approval/evaluation inputs; ISSUE-044 only if retrieval is required
- **PR boundary:** Epic with graph, each tool adapter, streaming/API, Web consumption, safety, and evaluation children

**Outcome**

Deliver one measurable travel-agent use case through a backend-only LangGraph boundary without giving the browser model credentials or tool authority.

**Work**

- [ ] Create the real NestJS `AgentModule`, typed state/graph/node routing, tool ports, and authenticated streaming contract.
- [ ] Add strict tool schemas, authorization, cancellation, timeouts, bounded retries, idempotency/compensation, cost limits, and provider degradation behavior.
- [ ] Add Web progress/result consumption, privacy-safe tracing with user/thread/run/correlation IDs, and explicit human approval for risky side effects.

**Review / acceptance**

- [ ] Browser has no model key or direct privileged tool access; NestJS authorization is final.
- [ ] Prompt-injection/tool-output validation, cross-user isolation, retry/idempotency, cancellation, timeout, side-effect, and cost-limit tests pass.
- [ ] Deterministic graph tests, recorded/mock provider contracts, and independent evaluations meet approved thresholds.
- [ ] Persistence/recovery/streaming semantics and triggers for extracting `apps/agent` are documented.

**Evidence:** closed child issues, architecture/sequence diagrams, test/evaluation report, trace/redaction sample, safety review, and cost/degradation exercise.  
**Non-goals:** a generic autonomous platform, unbounded tools, or process-memory-only production recovery.

### ISSUE-046 — [R-13] Reassess the password policy from evidence

- **Status:** `TODO (later)`
- **Labels:** `type:research`, `area:auth`, `area:security`, `area:ux`, `scope:post-mvp`
- **Blocked by:** ISSUE-033 and approved usage/support evidence or a new compliance/MFA requirement
- **PR boundary:** decision/contract first; implementation only after approval

**Outcome**

Decide whether to relax the initial 8–20 composition policy without exposing password data or breaking existing login.

**Work**

- [ ] Review privacy-safe abandonment/support evidence and applicable current guidance.
- [ ] Compare longer maxima, broader characters, passphrases, and removing composition rules while retaining a blocklist and Argon2id.
- [ ] Update the single policy, UI/API contract, messages, tests, and synchronized documentation if change is approved.

**Review / acceptance**

- [ ] Evidence contains no password or reversible derivative and supports one documented decision.
- [ ] Sign-up/reset/change behavior and messages match the approved policy.
- [ ] Login compatibility proves existing hashes/users remain valid.
- [ ] Validation-only changes introduce no unnecessary User-table/data migration.

**Evidence:** privacy-reviewed analysis, decision record, boundary tests, compatibility test, and synchronized contract docs.  
**Non-goals:** silently forcing existing users to rotate or inferring old-password compliance from hashes.

### ISSUE-047 — [R-14] Review and authorize public exposure

- **Status:** `BLOCKED (later)`
- **Labels:** `type:release-gate`, `area:security`, `area:operations`, `priority:p0`, `scope:public-release`
- **Blocked by:** ISSUE-032, ISSUE-033, ISSUE-035, ISSUE-042, ISSUE-043 and every feature included in the intended release
- **PR boundary:** evidence/sign-off gate; fixes use separate issues and PRs

**Outcome**

Make public exposure an explicit evidence-backed owner decision, never an accidental consequence of local completion.

**Work**

- [ ] Freeze release scope and run the release threat model, external-surface/config/secret scan, load/abuse tests, accessibility review, backup/restore review, observability/incident drill, and rollback rehearsal.
- [ ] Verify every environment, migration, provider, privacy, security, SLO, ownership, and on-call prerequisite.
- [ ] Obtain explicit public-release authorization from the owner only after all blocking evidence passes.

**Review / acceptance**

- [ ] Every release criterion has current evidence and an accountable owner.
- [ ] No open high-severity finding, failed restore/rollback, unknown secret source, or unowned alert remains.
- [ ] Production approval, OIDC, concurrency, migration, smoke, rollback, and incident paths are rehearsed.
- [ ] `@Donny-Guo` explicitly approves public exposure; local handoff or a green feature PR cannot satisfy this gate.

**Evidence:** signed release checklist, scan/load/accessibility reports, restore/rollback/incident drill records, dependency closure, and explicit authorization.  
**Non-goals:** schedule-based waiver or treating AI review as release approval.
