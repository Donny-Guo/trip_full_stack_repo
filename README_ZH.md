# Trip Agent Full Stack（中文）

本文件是权威英文 [README.md](./README.md) 的简体中文跟随版。若两者冲突，以英文版为准并修正本文件。

这是一个面向生产边界设计的旅游 Agent Monorepo。仓库当前仅包含 Workspace 基础与最小 Next.js Web 应用；API、认证流程、数据库基础设施和 Agent 能力仍处于计划阶段。

## 当前状态

截至 2026-08-03：

- 已存在：pnpm/Turborepo 根、单一 Lockfile 和最小 Next.js 16 Web Scaffold。
- 本地已完成：`P-03`/`ISSUE-002`、`F-01`/`ISSUE-003`、`F-02`/`ISSUE-004`。
- 下一步：按依赖顺序创建 NestJS Scaffold（`F-03`/`ISSUE-005`），并推进现已解除阻塞的 MUI Foundation（`W-01`/`ISSUE-008`）。
- 尚未实现：MUI、API、认证、PostgreSQL 基础设施、CI/Hook 或业务功能。
- 生产部署和公开暴露尚未授权。

权威范围与状态见 [PLANS.md](./PLANS.md)。

## 首个切片

首个纵向切片将提供：

- Email/Password 注册与登录。
- 注册成功后通过同源 HttpOnly Cookie 中的 15 分钟 Access JWT 自动登录。
- Session 恢复、退出和受保护 Web Route。
- Dashboard、Flight Info 和 User 导航目标。
- PostgreSQL User Model、API 权威校验及自动化测试。

旅行供应商集成、LangGraph Workflow、向量检索、Refresh-token Rotation、Redis 和生产部署均为后续工作。

## 技术栈

| 领域 | 选择 | 状态 |
| --- | --- | --- |
| Workspace | pnpm 11.18.0 + Turborepo 2.10.8 | 已存在 |
| Web | Next.js 16.2.12 + React 19.2.8 | 最小 Scaffold 已存在 |
| UI | MUI v9 | 计划于 W-01 |
| API | NestJS REST + TypeScript | 计划于 F-03 |
| Data | PostgreSQL 18 + pgvector + TypeORM 1.1 | 计划于 F-05/B-01 |
| Agent | API 边界内的 TypeScript LangGraph | 后续 |
| Tests | Jest/Supertest、Vitest/React Testing Library、Playwright | 计划中 |

精确 Pin、兼容性证据与更新策略见 [docs/toolchain_ZH.md](./docs/toolchain_ZH.md)。

## 快速开始

要求：Node.js 24.18.0 与 pnpm 11.18.0。

```sh
pnpm install --frozen-lockfile
pnpm --filter web dev
```

打开 http://localhost:3000。当前页面仅展示最小 Web Scaffold。

在仓库根运行检查：

```sh
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

当前 Scaffold 阶段，`pnpm format` 与 `pnpm test` 会在没有 Package Task 的情况下完成；F-04 将加入共享 Tooling。F-03 与 F-05 完成前，没有需要启动的 API 或数据库服务。

## 仓库结构

```text
apps/web/              最小 Next.js 应用
docs/toolchain*.md     精确版本与兼容性证据
AGENTS*.md             Contributor 与 Agent 的仓库规则
PLANS*.md              决策、范围、状态与验收标准
ISSUES*.md             有序实施 Issue 规格
package.json           根命令与 Runtime 约束
pnpm-workspace.yaml    Workspace 与安装策略
turbo.json             跨 Package Task Graph
```

`apps/api`、`infra/docker` 与共享 Package 等目录仅在所属任务开始时创建。

## 架构边界

- Browser 仅通过同源 `/api/v1` 调用 API；Web 不直接访问 PostgreSQL、Model Provider 或高权限 Tool。
- NestJS 拥有业务规则、认证、授权与持久化。
- 数据库变更使用 Migration；生产 Schema Synchronization 始终关闭。
- LangGraph 与 Model Credential 仅位于后端，不提前创建空 Agent Module。
- 当前仓库仅为本地 Scaffold，认证和生产发布控制仍不得放宽。

## 文档入口

- [PLANS_ZH.md](./PLANS_ZH.md) — 权威英文计划的中文跟随版，包含决策、范围、任务状态与验收标准。
- [ISSUES_ZH.md](./ISSUES_ZH.md) — 实施级 Issue 规格与远程 Issue Registry 的中文跟随版。
- [docs/toolchain_ZH.md](./docs/toolchain_ZH.md) — 精确 Dependency Pin 与 Source Evidence 的中文跟随版。
- [AGENTS_ZH.md](./AGENTS_ZH.md) — 仓库工程与安全规则的中文跟随版。

README 有意只保留 Onboarding 信息；详细 Contract 与 Evidence 归入上述文档。无后缀英文文件是权威版本，`_ZH.md` 文件是简体中文跟随版。

## License

[MIT](./LICENSE)
