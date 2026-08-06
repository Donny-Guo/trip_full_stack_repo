# Trip Agent Full Stack（中文）

本文件是权威英文 [README.md](./README.md) 的简体中文跟随版。若两者冲突，以英文版为准并修正本文件。

这是一个面向生产边界设计的旅游 Agent Monorepo。当前 Branch 包含 Workspace 基础、Next.js/MUI Web Scaffold，以及已合并的 ISSUE-009 NestJS ESM 认证 API；该 API 由 TypeORM 与本地 PostgreSQL/pgvector 支撑，并使用分离数据库 Role。Web 认证页面与 Agent 能力属于后续工作。

## 当前状态

截至 2026-08-06：

- 当前 Worktree 已存在：pnpm/Turborepo 根、共享工程配置、Next.js 16/MUI v9 Web Scaffold，以及带 Liveness/Readiness、TypeORM 1.1、显式 `users` Migration、Argon2id、注册/登录、`/auth/me`、退出与 15 分钟 HttpOnly JWT Cookie 的 NestJS 11 ESM API。
- 本地已完成：`P-03`/`ISSUE-002`、`F-01` 至 `F-05`/`ISSUE-003` 至 `ISSUE-007`，以及 `W-01`/`ISSUE-008`。
- 当前顺序：`ISSUE-009`/`MVP-01` 已合并并按 completed 关闭；下一步实施 `ISSUE-010`/`MVP-02`。GitHub #11-#27 因被取代或延期而关闭，不是实施完成证据。
- 尚未实现：Web 认证页面/受保护 Dashboard、CI/Hook、Agent 能力或旅行领域业务功能。
- 生产部署和公开暴露尚未授权。

权威范围与状态见 [PLANS.md](./PLANS.md)。

## 首个切片

限时本地演示将提供：

- Email/Password 注册与登录。
- 注册成功后通过同源 HttpOnly Cookie 中的 15 分钟 Access JWT 自动登录。
- Session 恢复、退出和受保护 Web Route。
- 刻意精简的受保护 Dashboard，用于证明 Session Restore、Logout 与 Route Protection；只要求可访问的 Route Identity 与 Logout Control。
- PostgreSQL User Model、API 权威校验及自动化测试。
- 快速本地 Husky/lint-staged/commitlint Hook 与最小确定性 Pull-request CI。

Dashboard Product Content/Design、Extensible Navigation、Flight Info/User 页面、Localization、完整 GitHub Governance/Security Administration、旅行供应商集成、LangGraph Workflow、向量检索、Refresh-token Rotation、Redis 和生产部署均为文档化后续工作。

## 技术栈

| 领域      | 选择                                                     | 状态                                                                  |
| --------- | -------------------------------------------------------- | --------------------------------------------------------------------- |
| Workspace | pnpm 11.18.0 + Turborepo 2.10.8                          | 已存在，并包含共享 TypeScript/ESLint/Prettier Policy                  |
| Web       | Next.js 16.2.12 + React 19.2.8                           | 已有带 MUI SSR/Theme Foundation 的最小 Scaffold                       |
| UI        | MUI Material/Icons 9.2.0                                 | SSR/CSS-variable Foundation 已存在                                    |
| API       | NestJS 11.1.28 REST + TypeScript                         | 已提供合并后的 ESM 认证 API                                           |
| Data      | PostgreSQL 18 + pgvector + TypeORM 1.1                   | 已有显式 Migration 及分离 Runtime/Migrator Connection                 |
| Agent     | API 边界内的 TypeScript LangGraph                        | 后续                                                                  |
| Tests     | Jest/Supertest、Vitest/React Testing Library、Playwright | API Check 与一项 Web Render Regression 已存在；Browser E2E 仍在计划中 |

精确 Pin、兼容性证据与更新策略见 [docs/toolchain_ZH.md](./docs/toolchain_ZH.md)。

## 快速开始

要求：Node.js 24.18.0、pnpm 11.18.0，以及带 Compose 的 Docker。

```sh
pnpm install --frozen-lockfile
pnpm --filter web dev
```

打开 http://localhost:3000。当前页面展示最小 MUI SSR/Theme Proof，不包含 Product Navigation 或 Custom Branding。

启动本地 PostgreSQL。若 `.env` 不存在，请从 `.env.example` 创建，但不要覆盖已有文件。将每个空 Password 填为不同的 64 字符小写 Hex 开发值（例如运行三次 `openssl rand -hex 32`），并保持该文件被忽略且 Mode 为 `0600`。

```sh
test -e .env || cp .env.example .env
chmod 600 .env
docker compose --env-file .env -f infra/docker/compose.yaml up --detach --wait postgres
docker compose --env-file .env -f infra/docker/compose.yaml ps
docker compose --env-file .env -f infra/docker/compose.yaml exec --no-tty postgres \
  /opt/trip-db/verify/capabilities.sh
```

停止数据库 Container，同时保留具名开发 Volume：

```sh
docker compose --env-file .env -f infra/docker/compose.yaml down
```

Provisioner 仅用于 Bootstrap，Migrator 拥有批准的 Application DDL，NestJS 只以 `trip_runtime` 连接。TypeORM 已禁用自动 Synchronization、启动 Migration 与 Extension Installation。

从 `apps/api/.env.migration.example` 与 `apps/api/.env.runtime.example` 创建被忽略的 API 配置，只填对应 Role Credential 与生成的认证值，并把两个文件都设为 `0600`。逐字段说明见[认证 API Runbook](./docs/api/authentication_ZH.md)。

显式运行 Migration，然后启动 API：

```sh
pnpm --filter api migration:show
pnpm --filter api migration:run
pnpm --filter api migration:show
pnpm --filter api dev
```

API 的 Process Liveness 位于 http://localhost:3001/api/v1/health/live，PostgreSQL-aware Readiness 位于 http://localhost:3001/api/v1/health/ready。

在仓库根运行检查：

```sh
pnpm format
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm format` 按根 Prettier Policy 格式化文件，`pnpm format:check` 以不修改文件的方式验证。API Integration Test 需要 PostgreSQL。从 `apps/api/test/config/*.example` 创建被忽略的 Test 配置后，以下命令会创建全新隔离数据库、执行 Migration `show/run/show`、运行 Integration Suite，并只删除 Test Project 与 Volume：

```sh
pnpm --filter api test:integration:local
```

普通 `pnpm test` 假定所需 Service 与 Migration 已可用。

## 仓库结构

```text
apps/web/                   带 MUI Theme/Render Regression 的最小 Next.js 应用
apps/api/                   NestJS ESM 认证 API、Migration 与 Test
packages/config-eslint/     共享类型感知 ESLint 配置
packages/config-typescript/ 共享严格 TypeScript 配置
infra/docker/               本地 PostgreSQL/pgvector Compose、Bootstrap 与 Verification
docs/toolchain*.md          精确版本与兼容性证据
docs/api/                   认证 Contract 与本地 Runbook
AGENTS*.md                  Contributor 与 Agent 的仓库规则
PLANS*.md                   决策、范围、状态与验收标准
ISSUES*.md                  两个合并执行 Issue、远程处置与文档 Backlog 路由
package.json                根命令与 Runtime 约束
pnpm-workspace.yaml         Workspace 与安装策略
turbo.json                  跨 Package Task Graph
```

Application Container、Redis 与生产数据库选择仍不存在。

## 架构边界

- Browser 仅通过同源 `/api/v1` 调用 API；Web 不直接访问 PostgreSQL、Model Provider 或高权限 Tool。
- NestJS 拥有业务规则、认证、授权与持久化。
- 数据库变更使用 Migration；生产 Schema Synchronization 始终关闭。
- LangGraph 与 Model Credential 仅位于后端，不提前创建空 Agent Module。
- 本地认证 MVP 不代表已获准生产部署或公开暴露。

## 文档入口

- [PLANS_ZH.md](./PLANS_ZH.md) — 权威英文计划的中文跟随版，包含决策、范围、任务状态与验收标准。
- [ISSUES_ZH.md](./ISSUES_ZH.md) — 两个合并执行规格、远程处置表与文档 Backlog 路由的中文跟随版。
- [docs/toolchain_ZH.md](./docs/toolchain_ZH.md) — 精确 Dependency Pin 与 Source Evidence 的中文跟随版。
- [docs/api/authentication_ZH.md](./docs/api/authentication_ZH.md) — 认证 Endpoint、Error、环境设置、Migration、Test 与手动 Smoke 的中文跟随版。
- [AGENTS_ZH.md](./AGENTS_ZH.md) — 仓库工程与安全规则的中文跟随版。

README 有意只保留 Onboarding 信息；详细 Contract 与 Evidence 归入上述文档。无后缀英文文件是权威版本，`_ZH.md` 文件是简体中文跟随版。

## License

[MIT](./LICENSE)
