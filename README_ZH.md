# Trip Agent Full Stack（中文）

本文件是权威英文 [README.md](./README.md) 的简体中文跟随版。若两者冲突，以英文版为准并修正本文件。

这是一个面向生产边界设计的旅游 Agent Monorepo。仓库当前包含 Workspace 基础、共享 TypeScript/ESLint/Prettier 工程配置、最小 Next.js Web 应用、最小 NestJS API 应用，以及简单的 MUI SSR/Theme Foundation；认证流程、数据库基础设施和 Agent 能力仍处于计划阶段。

## 当前状态

截至 2026-08-05：

- 已存在：pnpm/Turborepo 根、单一 Lockfile、统一根 Prettier Policy、共享严格 TypeScript 与类型感知 ESLint Package、带 MUI v9 SSR/Theme Integration 的最小 Next.js 16 Web Scaffold，以及带 Process Liveness 的最小 NestJS 11 API Scaffold。
- 本地已完成：`P-03`/`ISSUE-002`、`F-01` 至 `F-04`/`ISSUE-003` 至 `ISSUE-006`，以及 `W-01`/`ISSUE-008`。
- 当前顺序：Owner 正在实施 `ISSUE-007`，之后依次为合并后的 `ISSUE-009`/`MVP-01` 与 `ISSUE-010`/`MVP-02`。GitHub #11-#27 因被取代或延期而关闭，不是实施完成证据。
- 尚未实现：认证、PostgreSQL 基础设施、CI/Hook 或业务功能。
- 生产部署和公开暴露尚未授权。

权威范围与状态见 [PLANS.md](./PLANS.md)。

## 首个切片

限时本地演示将提供：

- Email/Password 注册与登录。
- 注册成功后通过同源 HttpOnly Cookie 中的 15 分钟 Access JWT 自动登录。
- Session 恢复、退出和受保护 Web Route。
- 用于证明 Session Restore 与 Route Protection 的受保护 Dashboard。
- PostgreSQL User Model、API 权威校验及自动化测试。
- 快速本地 Husky/lint-staged/commitlint Hook 与最小确定性 Pull-request CI。

Extensible Navigation、Flight Info/User 页面、Localization、完整 GitHub Governance/Security Administration、旅行供应商集成、LangGraph Workflow、向量检索、Refresh-token Rotation、Redis 和生产部署均为文档化后续工作。

## 技术栈

| 领域      | 选择                                                     | 状态                                                                  |
| --------- | -------------------------------------------------------- | --------------------------------------------------------------------- |
| Workspace | pnpm 11.18.0 + Turborepo 2.10.8                          | 已存在，并包含共享 TypeScript/ESLint/Prettier Policy                  |
| Web       | Next.js 16.2.12 + React 19.2.8                           | 已有带 MUI SSR/Theme Foundation 的最小 Scaffold                       |
| UI        | MUI Material/Icons 9.2.0                                 | SSR/CSS-variable Foundation 已存在                                    |
| API       | NestJS 11.1.28 REST + TypeScript                         | 最小 Scaffold 已存在                                                  |
| Data      | PostgreSQL 18 + pgvector + TypeORM 1.1                   | 计划于 F-05/B-01                                                      |
| Agent     | API 边界内的 TypeScript LangGraph                        | 后续                                                                  |
| Tests     | Jest/Supertest、Vitest/React Testing Library、Playwright | API Check 与一项 Web Render Regression 已存在；Browser E2E 仍在计划中 |

精确 Pin、兼容性证据与更新策略见 [docs/toolchain_ZH.md](./docs/toolchain_ZH.md)。

## 快速开始

要求：Node.js 24.18.0 与 pnpm 11.18.0。

```sh
pnpm install --frozen-lockfile
pnpm --filter web dev
```

打开 http://localhost:3000。当前页面展示最小 MUI SSR/Theme Proof，不包含 Product Navigation 或 Custom Branding。

在另一个 Terminal 启动 API：

```sh
pnpm --filter api dev
```

只检查进程的 Liveness Endpoint 为 http://localhost:3001/api/v1/health/live。

在仓库根运行检查：

```sh
pnpm format
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm format` 按根 Prettier Policy 格式化文件，`pnpm format:check` 则以不修改文件的方式验证该 Policy。`pnpm test` 会运行 API Unit/HTTP Check 与 Web Render Regression。F-05 前不需要数据库服务。

## 仓库结构

```text
apps/web/                   带 MUI Theme/Render Regression 的最小 Next.js 应用
apps/api/                   最小 NestJS 应用与 Liveness Endpoint
packages/config-eslint/     共享类型感知 ESLint 配置
packages/config-typescript/ 共享严格 TypeScript 配置
docs/toolchain*.md          精确版本与兼容性证据
AGENTS*.md                  Contributor 与 Agent 的仓库规则
PLANS*.md                   决策、范围、状态与验收标准
ISSUES*.md                  两个合并执行 Issue、远程处置与文档 Backlog 路由
package.json                根命令与 Runtime 约束
pnpm-workspace.yaml         Workspace 与安装策略
turbo.json                  跨 Package Task Graph
```

`infra/docker` 等目录仅在所属任务开始时创建。

## 架构边界

- Browser 仅通过同源 `/api/v1` 调用 API；Web 不直接访问 PostgreSQL、Model Provider 或高权限 Tool。
- NestJS 拥有业务规则、认证、授权与持久化。
- 数据库变更使用 Migration；生产 Schema Synchronization 始终关闭。
- LangGraph 与 Model Credential 仅位于后端，不提前创建空 Agent Module。
- 当前仓库仅为本地 Scaffold，认证和生产发布控制仍不得放宽。

## 文档入口

- [PLANS_ZH.md](./PLANS_ZH.md) — 权威英文计划的中文跟随版，包含决策、范围、任务状态与验收标准。
- [ISSUES_ZH.md](./ISSUES_ZH.md) — 两个合并执行规格、远程处置表与文档 Backlog 路由的中文跟随版。
- [docs/toolchain_ZH.md](./docs/toolchain_ZH.md) — 精确 Dependency Pin 与 Source Evidence 的中文跟随版。
- [AGENTS_ZH.md](./AGENTS_ZH.md) — 仓库工程与安全规则的中文跟随版。

README 有意只保留 Onboarding 信息；详细 Contract 与 Evidence 归入上述文档。无后缀英文文件是权威版本，`_ZH.md` 文件是简体中文跟随版。

## License

[MIT](./LICENSE)
