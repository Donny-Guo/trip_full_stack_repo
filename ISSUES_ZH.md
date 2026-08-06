# 本地认证演示的合并 GitHub Issue（中文）

本文件是权威英文 [`ISSUES.md`](./ISSUES.md) 的简体中文跟随翻译。若两者冲突，以英文版为准并修正本文件。

状态：**Owner 已授权的 Issue 合并于 2026-08-05 完成远程操作；ISSUE-007 与 ISSUE-009/MVP-01 已完成；ISSUE-010/MVP-02 已在本地实现并验证，但仍开放，等待 PR CI、Review、Merge 与远程关闭**\
计划日期：2026-07-30\
合并日期：2026-08-05\
范围来源：[`PLANS.md`](./PLANS.md)\
仓库 Owner：`@Donny-Guo`

## 1. 目的与权威性

Owner 将受时间限制的本地认证演示压缩为基础设施之后的两个执行 Issue。本清单为仓库提供唯一的现役 Issue 答案。详细架构、安全决策、Task 级要求与后续 Backlog 仍保留在 `PLANS.md` 中，但它们不是额外的开放 GitHub Issue。

权威顺序：

1. `AGENTS.md` 定义全仓工程与安全规则。
2. `PLANS.md` 定义已确认决策、详细要求与后续 Backlog。
3. 本文件定义开放 GitHub Issue 的包装、处置、依赖与验收证据。

2026-08-05，Owner 明确授权改写 GitHub #9、#10，并关闭 #11 至 #27，同时保持 #7 不变。远程整理已经完成。2026-08-06，Owner 另行授权收窄 #10，把 Dashboard Product Detail 移入文档 Backlog，并同步本地文档；该远程更新也已完成。两次授权均不允许在没有新 Owner 明确请求时执行其他 Issue 创建、编辑、重开或关闭操作。

本切片中的 MVP 质量表示，保留的认证路径继续具备真实 PostgreSQL 持久化、密码哈希、Cookie 会话、数据库唯一性与安全 API 失败所需的持久控制。完整的发布前加固仍然延后，应用尚未获准公开暴露或生产部署。

## 2. 当前远程状态与顺序

|  顺序 | GitHub Issue                                                                                                    | 状态                | 处置                                                   |
| ----: | --------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------ |
|   1-6 | [#1-#6](https://github.com/Donny-Guo/trip_full_stack_repo/issues?q=is%3Aissue+number%3A1..6)                    | 已关闭              | 已完成的历史基础与授权工作                             |
|     7 | [#7 — 本地 PostgreSQL/pgvector 基础设施](https://github.com/Donny-Guo/trip_full_stack_repo/issues/7)            | 已关闭              | 已完成本地数据库基础设施                               |
|     8 | [#8 — MUI v9 App Router SSR](https://github.com/Donny-Guo/trip_full_stack_repo/issues/8)                        | 已关闭              | 已完成 Web UI 基础                                     |
|     9 | [#9 — MVP-01 认证 API](https://github.com/Donny-Guo/trip_full_stack_repo/issues/9)                              | 已关闭              | 已于 2026-08-06 完成并合并                             |
|    10 | [#10 — MVP-02 本地演示与质量门](https://github.com/Donny-Guo/trip_full_stack_repo/issues/10)                    | 开放                | 实现已在本地验证；仍待 PR CI、Review、Merge 与远程关闭 |
| 11-27 | [历史 Issue](https://github.com/Donny-Guo/trip_full_stack_repo/issues?q=is%3Aissue+is%3Aclosed+number%3A11..27) | 按 not planned 关闭 | 被 #9/#10 取代或移入文档 Backlog；关闭不代表完成       |

安全执行顺序：

```text
ISSUE-007 (DONE) -> ISSUE-009 / MVP-01 (DONE) -> ISSUE-010 / MVP-02 (LOCAL PASS；REMOTE OPEN)
```

已关闭 #2 的正文记录 D-25 之前的版本 Baseline。当前 Next.js 16.2.12、MUI 9.2.0 与 TypeORM 1.1.0 以 D-25 和 `docs/toolchain.md` 为准。

## 3. 统一 Ready 与 Review 规则

只有前置项完成、`PLANS.md` 决策仍有效，并且所需本地服务、环境值与测试路径可通过获准的非 Secret 配置使用时，开放 Issue 才可开始。

完成要求：

- 交付一个可 Review 的 Outcome，不夹带无关依赖升级或投机性架构。
- 根目录及受影响 Package 的 Format、Lint、严格 Typecheck、Test 与 Production Build 通过。
- Repository、Migration 与 Auth Integration Test 使用真实 PostgreSQL。
- 每项 Security Control 至少有直接 Negative Test，而非只依赖 Line Coverage。
- 不含 Secret、明文密码、Hash、JWT、敏感日志、Skipped Test 或无法解释的 TODO。
- Contract、Migration、Environment Example、README、`PLANS.md`、本清单与已有中文跟随版同步。
- 提供与变更风险相称的 Security、Privacy、Accessibility、Failure、Cache 与 Rollback Evidence。

一个合并 Issue 可以包含分层 Commit。如果单个 PR 无法安全 Review，可以用多个聚焦 PR 关闭同一个 Issue；Issue 合并不得强迫形成危险的大 Diff。

## 4. ISSUE-007 — 本地 PostgreSQL 与 pgvector 基础设施

- **GitHub：** [#7](https://github.com/Donny-Guo/trip_full_stack_repo/issues/7)
- **状态：** `DONE`
- **Plan Task：** `F-05`
- **远程状态：** 2026-08-05 按 completed 关闭

已合并实现提供 Digest-pinned PostgreSQL 18.4/pgvector 0.8.5 基础设施、仅 Loopback 的 Compose Access、Health Check、具名 Volume、分离的 Provisioner/Migrator/Runtime Role、高权限 Extension Bootstrap 与 Least-privilege Verification。Migration-shaped Transactional DDL Probe 以 Migrator 成功并 Rollback；直接 TCP/SCRAM Runtime Access 成功，而 Runtime DDL/Extension 操作失败。实际 NestJS/TypeORM Connection/Readiness 仍归 ISSUE-009/B-01，首个真实 Application Migration 仍归 ISSUE-009/B-02。

## 5. ISSUE-009 / MVP-01 — 构建 PostgreSQL-backed 认证 API

- **GitHub：** [#9](https://github.com/Donny-Guo/trip_full_stack_repo/issues/9)
- **状态：** `DONE`
- **前置：** ISSUE-007 已为 `DONE`
- **远程状态：** 实现合并后于 2026-08-06 按 completed 关闭
- **合并：** 原 #9、#10、#13、#17、#18 与 #20-#24 的 Task Scope
- **PR Boundary：** 一个 Outcome-focused Backend PR，按配置/数据、安全边界、Endpoint 与 Test 分层 Commit；仅在 Reviewability 要求时拆为多个 PR

### Outcome

交付由 Docker Compose PostgreSQL 支撑并经过测试的 NestJS 认证 API，使用显式 Migration、安全 Persistence、Argon2id、短期 HttpOnly JWT Cookie，以及本地演示所需的最小 Request-security Boundary。

### Work

- [x] 添加 Fail-fast API 配置、TypeORM 1.1 DataSource、依赖感知 Readiness、显式 Migration Command 与 Runtime/Migrator 分离。
- [x] 创建 `users` Migration：UUID、Canonical Unique Email、默认不选择的 `password_hash` 与 UTC Timestamp。
- [x] 实现窄范围 Users Repository/Service，不返回 ORM Entity 或 Credential Field。
- [x] 实现 Email Normalization、已确认 PasswordPolicy、Argon2id、Dummy Hash 与敏感值 Redaction。本 MVP 不添加本地 Blocklist 或远程密码查询。
- [x] 添加稳定 API/Field Code、Request ID、全局输入校验、JSON/Body Limit、No-store Header 与 Unsafe Method 的精确可信 Origin/Referer 检查。
- [x] 实现已确认的 HS256 Access-JWT Claim/Validation、共享签发、本地/生产 Cookie Profile 与精确 Cookie 删除。
- [x] 实现 `POST /api/v1/auth/sign-up`、`POST /api/v1/auth/login`、`GET /api/v1/auth/me`、`POST /api/v1/auth/logout` 与复用 NestJS JWT Guard。
- [x] 为核心成功路径和最高价值失败边界添加聚焦 Unit 与真实 PostgreSQL Integration Test；同步 README、API 文档、环境示例及中英文权威文档。

### Acceptance

- [x] 空数据库通过显式命令迁移；应用启动从不执行 Synchronize 或 Migration。
- [x] Runtime Role 只能执行所需 Application DML，无法执行 DDL 或 Extension Management；TypeORM 不安装 Extension。
- [x] 注册创建一个真实 User，返回 `201` 并设置已确认的 15 分钟 HttpOnly JWT Cookie。
- [x] PostgreSQL 强制 Canonical Duplicate 并映射为 `409`；一项聚焦并发注册测试证明仅一个请求成功。
- [x] 有效登录成功；未知邮箱和错误密码返回相同 `401 INVALID_CREDENTIALS` Contract，并以一项聚焦测试证明 Dummy-hash Path。
- [x] `/auth/me` 只返回安全 User Field；Logout Idempotent 且精确清除 Cookie Tuple。
- [x] 聚焦 JWT 测试拒绝篡改 Signature、过期、非法 Algorithm 与非法必需 Claim。
- [x] 聚焦 Request 测试在 Mutation 前拒绝未知字段、超大 Body、不支持的 Media Type 以及缺失/不可信 Provenance。
- [x] 公共 Response Body 与正常 Application Log 不出现密码、Hash、JWT、Cookie 或连接 Secret。
- [x] API Format、Lint、Typecheck、聚焦 Unit/Integration Test 与 Production Build 通过。
- [x] README、API Runbook/Contract、环境示例及中英文 Issue/Plan 文档与真实实现一致。

**最小 Evidence：** Clean Migration `show/run/show`、聚焦 Unit 与真实 PostgreSQL Integration Report、API Format/Lint/Typecheck/Build 输出，以及不记录 Cookie/JWT 值的 Postman 或 curl 注册 -> `/auth/me` -> 退出 -> 登录 Smoke。

**明确延期：** Compromised/Common-password Blocklist 及 Asset；穷举 Password/JWT/Provenance/Database/Log Matrix；正式 Argon2 p95/Peak-memory Benchmark；Web 页面、Refresh Token、Redis、Email Verification、Password Reset、Role、公开 Rate Limiting、Swagger/OpenAPI、生产部署与公开暴露。

## 6. ISSUE-010 / MVP-02 — 交付本地注册/登录演示与开发质量门

- **GitHub：** [#10](https://github.com/Donny-Guo/trip_full_stack_repo/issues/10)
- **状态：** `TODO`
- **本地状态：** 实现与本地验证已于 2026-08-06 完成；仍待 PR CI、Review、Merge 与远程关闭
- **前置：** ISSUE-009 已为 `DONE`
- **合并：** 原 #11、#12、#14/#15 中演示必需范围与 #25-#27
- **PR Boundary：** 一个 Outcome-focused Web/Demo/Quality-gates PR，按 Web Boundary、Auth UI/Session、Hook/CI、Test 与文档分层 Commit；仅在 Reviewability 要求时拆为多个 PR

### Outcome

交付可复现的本地演示：用户可注册、进入刻意精简的受保护 Dashboard 目标、刷新后恢复 Session、退出并再次登录，同时具备本地 Hook 与确定性的 Pull-request 质量门。Dashboard 只证明 Auth Boundary，不是 Product Dashboard 交付物。Product Dashboard Requirement、Data、Content 与 Design 延期到文档化 W-09，并需单独授权。

### Work

- [x] 配置经验证的 Web Environment Boundary 与只代理 NestJS `/api/v1` 的窄范围同源 Proxy。
- [x] 使用现有 MUI v9 App Router SSR Foundation 创建最小 `/sign-up`、`/login` 与受保护 `/dashboard` Route。Dashboard 仅保留可访问的 Route Identity 与认证路径所需 Logout Control。
- [x] 构建可访问的 MUI Form，提供即时 Client Feedback、稳定 API Error Mapping、Submission State Protection、Keyboard、Paste 与 Autofill 支持。
- [x] 通过 Server-side `/auth/me`、显式 Cookie Forwarding、No-store、经过清理的同源 Return Path，以及区分 `401` 与 API Outage 来保护 Dashboard。
- [x] 实现 Logout 与 Session Restore，不在 Browser-accessible Persistent State 中保存 Token 或 Session ID。
- [x] 添加聚焦的 Vitest/Testing Library Coverage，以及基于真实 PostgreSQL 的 Sign-up、Restore、Logout、Login、Route Protection、Session-aware 404 与 API Outage Playwright Journey。
- [x] 添加 Husky、只处理 Staged File 的 lint-staged Pre-commit，以及 `commit-msg` Conventional Commit 校验。
- [x] 添加 Least-privilege、Immutable-SHA-pinned PR CI，覆盖 Frozen Install、Format、Lint、Typecheck、Unit/Integration、关键 E2E、Production Build 与稳定 Aggregate Result。
- [x] 记录 Environment Variable、Docker/Database Startup、Migration、应用启动、演示路径、验证命令与已知公开发布限制。

### Acceptance

- [ ] 从 Clean Checkout 按文档启动 PostgreSQL、执行 Migration 并在宿主机运行 Web/API。
- [x] 注册成功创建数据库 Row、接收 HttpOnly JWT Cookie，并且只进入 Dashboard 一次。
- [x] 刷新恢复认证 Session，不闪现或缓存 Private Content。
- [x] Logout 后 Dashboard 再次受保护；随后使用有效凭据可恢复访问。
- [x] Dashboard 除可访问的 Route Identity 与 Logout 外不要求 Product Content：不包含 Card、Metric、Trip/Itinerary Data、Product Navigation、Personalization 或精修 Product Design。
- [x] Duplicate Registration、Password-policy Failure、Invalid Credential、Provenance Failure 与 API Outage 按 Public Contract 产生安全、可访问且应区分的响应。
- [x] JWT 不出现在 Response Body、URL、Web Storage、Browser-readable Cookie 或 Persistent Client State；API Redaction Test 覆盖 Log。
- [ ] Pre-commit 只处理 Staged File，不执行 Network/Database/Full Build，并保留 Partial Staging。
- [ ] 根 Format、Lint、Typecheck、Test、关键 E2E 与 Production Build 在本地和 PR CI 中通过。
- [x] README、Environment Example、Plan/Issue 与中文跟随版和实现一致，并保持 Public-release Gate 关闭。

**本地 Evidence（2026-08-06）：** 隔离 Migration `show/run/show`；48 个 API Unit、12 个真实 PostgreSQL Integration、73 个 Web Unit/Component 与 6 条 Playwright Journey Test；Production Build；精确 HttpOnly Cookie 与空 Web Storage 检查；Accessibility Scan；Hook/Config Review；以及同步文档。关闭前仍需远程 PR CI 与 Owner 执行的 Partial-staging/Visual Handoff Evidence。

**Non-goals：** Dashboard Product Content/Visual Design、完整 Navigation、Flight Info/User 页面、Localization/Language Switcher、最终 Branding、生成 OpenAPI Client、完整 GitHub Governance/Security Setting、部署或公开暴露。

## 7. 历史 Issue 处置

按 not planned 关闭历史 Issue 只记录合并或延期，不是完成证据。

| 已关闭 Issue           | 处置                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------- |
| #11、#12               | 最小 PR CI 与本地 Hook 移入 ISSUE-010/MVP-02                                                             |
| #13、#17、#18、#20-#24 | 必需 API/Data/Security 工作移入 ISSUE-009/MVP-01                                                         |
| #14                    | 精简 Protected Auth Destination 移入 ISSUE-010；Product Dashboard、Extensible Shell 与 Localization 延期 |
| #15、#25-#27           | 必需 Web Auth/Session/Form 工作移入 ISSUE-010/MVP-02                                                     |
| #16                    | 完整 GitHub Governance 与 Security Administration 移入后续/Public-release Backlog                        |
| #19                    | Extensible Navigation 与 Flight Info/User 页面移入后续 Product Backlog                                   |

## 8. 文档 Backlog，不是开放 GitHub Issue

`PLANS.md` 仍是以下后续要求的详细来源。列出不代表实施授权或远程 Issue 创建授权。

- 完整 Localization Architecture、简体中文产品文案、Locale Persistence 与 Language Switcher。
- Product Dashboard Requirement、Data Source、Card/Metric、Trip/Itinerary Content、Personalization、Responsive Composition 与精修 Visual Design。
- Extensible Navigation、Flight Info/User 页面、Feature Flag 与未来 Permission Filtering。
- 完整 GitHub Governance/Security Administration：Ruleset、CODEOWNERS、Template、Dependabot、CodeQL、Secret Scanning、Push Protection、License Notice 对齐与 Advisory AI-review Evaluation。
- Swagger/OpenAPI 与 Generated Client。
- 公开暴露控制：Distributed Rate Limit、Security Header、Proxy-trust Validation、Privacy-safe Audit Event、Outage Behavior 与 Runbook。
- Refresh Rotation/Revocation、Redis、Mail、Email Verification、Password Reset、Account Lifecycle 与 RBAC。
- Production Image、Cloud/CD/OIDC、Observability、Backup/Restore、Rollback 与 Release Approval。
- Privacy/Threat Modeling、Vector Retrieval、LangGraph、Travel Provider、Agent Persistence 与 Evaluation。

在 `PLANS.md` 中全部 Mandatory Release Prerequisite 有证据且 Owner 明确授权公开暴露之前，Public-release Gate 保持 Blocked。
