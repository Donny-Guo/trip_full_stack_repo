# Trip Agent Full Stack（中文）

本文件是权威英文 [`README.md`](./README.md) 的简体中文跟随翻译。若两者冲突，以英文版为准并修正本文件。

面向生产环境的旅游 Agent 全栈应用。项目计划使用 pnpm Monorepo 管理 Next.js Web、NestJS API、LangGraph Agent 编排以及共享工程配置，并以 PostgreSQL + pgvector 作为业务数据与向量检索基础。

> 当前状态：**规划中；D-01 至 D-24 已确认，且尚未授权实施**。远程 Issue [#1–#27](https://github.com/Donny-Guo/trip_full_stack_repo/issues) 已覆盖到 Sign Up/Login 页面为止的批准路径，但仓库仍未创建应用脚手架、自动化、Hook 或业务代码。仓库当前为 Public。权威状态见英文 [`PLANS.md`](./PLANS.md)。

首个纵向切片由多个可独立 Review 的变更集组成；它是里程碑和执行顺序，不承诺生产级基础、API、Web、集成与质量工作全部在一个自然日内完成。

## 产品范围

首个纵向切片聚焦账户入口和应用壳：

- 邮箱 + 密码注册。
- 邮箱 + 密码登录。
- 注册后自动登录；短期 Access JWT 使用同源 HttpOnly Cookie。
- 可扩展 Navigation Bar：Dashboard、Flight Info、User。
- PostgreSQL User 数据模型。
- NestJS 注册/登录 API、输入校验及稳定错误状态。

Agent、航班供应商接入、向量检索、Swagger、Refresh Token/轮换/撤销、Redis 等能力会保留清晰边界，但不在未确认的情况下提前实现。

## 技术方向

| 领域 | 规划选型 | 说明 |
| --- | --- | --- |
| Monorepo | pnpm workspace | 单一根锁文件，内部依赖使用 workspace protocol |
| 任务编排 | Turborepo | 负责跨包任务依赖和本地缓存；远程缓存待 CI 与敏感信息审计后启用 |
| Web | Next.js App Router + TypeScript | 默认 Server Component，需要交互时才下沉客户端边界 |
| UI | Material UI v6 | 统一 Theme、SSR 样式集成、响应式与可访问性 |
| Language | English first，i18n-ready | 首版英文；文案从第一天集中管理，后续至少增加简体中文 `zh-CN`；项目文档也以英文无后缀文件为权威 |
| API | NestJS REST + TypeScript | 领域模块化、DTO 校验、统一异常契约 |
| Agent | LangGraph.js | 初期位于 NestJS AgentModule，保留独立服务化边界 |
| Database | PostgreSQL + pgvector | 事务数据与向量数据同库起步 |
| ORM | TypeORM | 与 NestJS 集成成熟并原生映射 pgvector；生产禁用 schema sync |
| API contract | Swagger/OpenAPI（后续） | 由 OpenAPI 生成 Web 客户端，避免类型漂移 |
| Auth | Email/password + Access JWT | JWT 放入同源 HttpOnly Cookie；Refresh、轮换和 Redis 后续加入 |
| Cache/coordination | Redis（后续） | 缓存、限流、短生命周期协调；不作为主数据源 |
| Source/automation | GitHub + GitHub Actions | Pull Request CI、Repository Ruleset、安全自动化及后续 Environment-gated Delivery |
| Repository license | MIT | 由 `@Donny-Guo` 所有的 Public Open-source Repo；根 License Artifact 使用标准 MIT 正文与已批准 Notice |
| Local commit checks | Husky + lint-staged + commitlint | 快速 Staged-file 检查与 Conventional Commits；CI 仍是权威 |

正式创建脚手架时再锁定经过兼容性验证的精确版本，不使用 `latest` 漂移安装。

## 计划中的仓库结构

以下是目标结构，不代表这些文件现已存在：

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
│   │   │   ├── components/       # 真正跨 feature 的 UI
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   └── navigation/
│   │   │   ├── i18n/             # 消息 key、英文 catalog 与 locale 格式化边界
│   │   │   ├── lib/              # API client、环境配置等基础适配
│   │   │   └── theme/
│   │   └── tests/
│   └── api/
│       ├── src/
│       │   ├── common/            # 全局 filter/guard/interceptor；保持小而明确
│       │   ├── config/
│       │   ├── database/
│       │   │   └── migrations/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   └── agent/         # 首个已批准 Agent 用例开始时再创建
│       │   ├── app.module.ts
│       │   └── main.ts
│       └── test/
├── packages/
│   ├── api-client/                # OpenAPI 生成；启用 Swagger 后创建
│   ├── config-eslint/
│   ├── config-typescript/
│   └── test-utils/                # 有实际复用时再创建
├── infra/
│   └── docker/                    # 本地 PostgreSQL/pgvector；Redis 后续加入
├── docs/
│   ├── adr/
│   ├── agent/
│   └── api/
├── .github/
│   ├── workflows/                    # 首个切片加入 CI/安全；R-09 后加入部署
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
├── .husky/                           # pre-commit 与 commit-msg Hook
├── .editorconfig
├── .gitignore
├── .node-version                     # P-03 选择的精确 Node 版本线
├── .npmrc                            # pnpm/Install 策略；不得包含 Secret
├── AGENTS.md
├── AGENTS_ZH.md
├── CONTRIBUTING.md
├── ISSUES.md
├── ISSUES_ZH.md
├── LICENSE                            # MIT 正文；获得实施授权后在 F-08 创建
├── PLANS.md
├── PLANS_ZH.md
├── README.md
├── README_ZH.md
├── SECURITY.md
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json                     # 跨包任务图与本地缓存
```

### Web 内部边界

- `app/` 只负责路由、layout、loading/error boundary 与页面装配。
- `features/auth` 包含登录/注册表单、Schema、API 调用适配和相关测试。
- `features/navigation` 包含导航配置和响应式 App Bar。
- 全局 `components/` 只放跨多个 feature 的通用组件，避免成为杂物目录。
- 浏览器通过同源 `/api/v1` 入口访问 NestJS，不直接连接 PostgreSQL、Redis、LLM 或内部 Agent Runtime。

### API 内部边界

- `AuthModule` 负责凭据验证、密码哈希、首版 Access JWT 和未来完整 Token 生命周期。
- `UsersModule` 负责 User 领域与持久化，不向外暴露密码哈希。
- 未来的 `AgentModule` 负责 LangGraph 编排；认证切片不创建空模块。首个用例获批后，旅行供应商通过工具适配器进入，不耦合 Controller。
- `database/migrations` 是 Schema 历史的唯一权威，生产环境不使用自动同步。

## 首版 API 契约草案

基础前缀规划为 `/api/v1`：

| Method | Path | 成功 | 主要失败 |
| --- | --- | --- | --- |
| POST | `/auth/sign-up` | `201`，设置 Access Cookie 并返回安全 User 摘要，实现自动登录 | `400 VALIDATION_ERROR`、`409 EMAIL_ALREADY_EXISTS` |
| POST | `/auth/login` | `200`，设置 Access Cookie 并返回安全 User 摘要 | `400 VALIDATION_ERROR`、`401 INVALID_CREDENTIALS` |
| GET | `/auth/me` | `200`，返回当前安全 User 摘要 | `401 UNAUTHENTICATED` |
| POST | `/auth/logout` | 幂等 `204`，无论 Cookie 是否有效都清除 Access Cookie | 无业务响应体；仍执行 Origin/CSRF 检查 |

所有错误响应都包含稳定的机器可读 `code`、安全的英文回退 `message`、`requestId`，以及可选的 `fieldErrors: Record<string, string[]>` 稳定错误码数组。Web 通过 Catalog 映射错误码，不把 API 文案当成本地化契约。认证成功响应使用稳定 `messageCode`，且只返回 `id`、`email`、`createdAt`、`updatedAt` 安全字段。未知邮箱与密码错误对外统一映射为 `INVALID_CREDENTIALS`，降低账户枚举风险。

首版 Access JWT 使用 allowlist 中的 `HS256`、至少 256 bit 的部署密钥、15 分钟 TTL、User UUID `sub`、`iss=trip-api`、`aud=trip-web`、必需 issued-at/expiry 和最多 30 秒时钟容差。生产设置 `__Host-trip_access`，属性为 `HttpOnly`、`Secure`、`SameSite=Lax`、`Path=/`、无 `Domain`、`Max-Age=900`；本地 HTTP 使用不同名称 `trip_access_dev` 和相同生命周期。Token 不进入 Web Storage。Logout 使用相同属性发送 `Max-Age=0`，但在 Refresh Token 与服务端撤销加入前，无法提前撤销已泄露的 Access JWT。

不安全的认证请求只接受 JSON，并要求精确匹配受信 `Origin`，同源 `Referer` 仅作回退；缺失或 `null` 的浏览器来源会被拒绝。这是首个仅浏览器、同源切片已接受的 CSRF 基线。首个受保护业务写接口上线前，或拓扑扩大时更早，增加 synchronizer token 或 signed double-submit token。认证及用户私有响应使用 `Cache-Control: no-store`，Gateway 不得缓存 `Set-Cookie` 或私有响应。

## User 数据模型草案

| 字段 | 规划 | 约束 |
| --- | --- | --- |
| `id` | UUID | 主键 |
| `email` | varchar(254) | 规范小写 ASCII；数据库 CHECK + UNIQUE；非空 |
| `password_hash` | text | 非空、永不出现在 API 响应 |
| `created_at` | timestamptz | 非空、数据库默认值 |
| `updated_at` | timestamptz | 非空、由应用或数据库一致维护 |

首个迁移明确不加入 `email_verified_at`、账户 `status`、角色或完整用户资料。它们已进入后续递进路线，待验证流程、状态机和授权用例明确后通过前滚迁移加入，避免首版模型过度设计。

## 输入与错误体验

- MUI `TextField` 负责输入、错误态和帮助文本的呈现；实际校验由表单 Schema 执行。
- 邮箱：必填、去除外围空白、转为小写、最大 254 字符并校验 ASCII 邮箱结构；国际化邮箱是后续明确决策。服务端执行相同或更严格的校验。
- 首版密码策略已确认：8–20 个 ASCII 字符，只允许 `A-Z`、`a-z`、`0-9`、`$`、`#`、`@`、`%`，并且至少包含一个大写字母、一个小写字母、一个数字和一个 `$#@%` 字符。
- 密码不 trim；允许粘贴和密码管理器自动填充。界面一次性展示简洁规则清单，避免每次提交才暴露一条要求。
- 服务端仍对完整候选密码执行本地常见/已泄露密码阻止检查，并使用经目标环境基准测试的 Argon2id；浏览器端提示不能替代服务端校验。
- 规则集中在 `PasswordPolicy` 中。后续放宽长度或字符集只改验证、文案、契约和测试，不改 User 表；登录只验证已有哈希，不重新套用当前注册规则。
- 登录另设宽松的 1,024-byte 传输上限以限制解析与 Hash 资源；未知用户执行一次 dummy Argon2id 验证，使昂贵路径与密码错误可比，同时对外响应保持一致。
- 字段级错误就近显示；服务端业务错误显示在表单级 Alert，并保留用户邮箱输入。
- 注册成功提示必须基于真实 API 成功响应；成功设置 Cookie 后自动进入 Dashboard。
- 请求中显示 loading，防止重复提交；失败时恢复可操作状态。

## Navigation 草案

| Label | 建议路由 | 首版行为 |
| --- | --- | --- |
| Dashboard | `/dashboard` | 页面占位或最小内容，当前路由高亮 |
| Flight Info | `/flight-info` | 页面占位；航班数据接入不属于本次任务 |
| User | `/user` | 页面占位；预留账户菜单/权限扩展 |

桌面端使用 App Bar + 导航链接，窄屏折叠为 Drawer/Menu；导航项由配置驱动，以便后续加入权限、feature flag 和国际化。

## 语言策略

项目文档以英文为权威：无后缀的 `README.md`、`PLANS.md`、`ISSUES.md`、`AGENTS.md` 是 source of truth；匹配的 `_ZH.md` 是简体中文跟随版。英文发生实质变更时同步中文版本；若冲突，以英文为准。

首版用户界面使用英文，但不把英文文案硬编码在页面和组件中：Navigation、表单 label、校验消息、成功/失败提示统一使用稳定消息 key 和英文 message catalog。日期、时间、数字和货币通过 locale-aware formatter 输出。

首版不增加语言切换器、中文翻译或 locale URL。后续国际化任务会加入至少 `en` 与 `zh-CN` 两套 catalog、fallback、缺失 key 检查、语言持久化和切换器；是否采用 `/en/...`、`/zh-CN/...` 路径，等公开页面 SEO 与用户偏好需求明确后决定。

## 本地开发与容器化策略

是的，本计划采用“应用循序本地运行、基础设施容器化”的开发方式：

- 日常开发在宿主机通过 pnpm/Turborepo 启动 Next.js 和 NestJS，保留快速 HMR、断点调试与类型反馈。
- PostgreSQL + pgvector 使用固定镜像的 Docker Compose 服务、健康检查和开发持久卷；Redis 与本地邮件捕获服务等到对应功能阶段再加入。
- 本地数据库使用相互分离的 Provisioner、Migrator、Runtime 角色。镜像支持 pgvector 不代表数据库已启用扩展：高权限本地 Bootstrap 负责启用与验证，应用启动不得执行。
- 本地反向代理把 `/api/v1` 路由到 NestJS，尽量复现生产同源 Cookie 行为。
- CI 在 runner 中执行应用任务，并启动隔离的临时 PostgreSQL/pgvector 服务完成迁移和集成测试。
- 首个本地纵向切片稳定后，再为 Web/API 分别建立多阶段、非 root 应用镜像和全栈容器 smoke test。生产环境优先使用托管 PostgreSQL/Redis，应用容器保持无状态。

## GitHub 协作、Hook 与 CI/CD

首个切片包含仓库治理与 Continuous Integration，但不包含真实生产部署：

- Public 仓库由 `@Donny-Guo` 所有。MIT 是已确认的 Open-source License 选择；根 License Artifact 与应用实施分开治理。全部变更仍通过 Pull Request 进入 `main`，默认使用 Squash Merge 与线性历史；Ruleset 禁止删除和 Force Push，并要求对话已解决和稳定的聚合 CI Check。
- 标准根 MIT `LICENSE` 必须使用 `Copyright (c) 2026 Donny-Guo`；F-08 验证 GitHub 能正确识别它，并保持 Source-file Header 可选。
- Bootstrap 阶段的 Approval Requirement 必须可满足，且不得削弱 CI。`CODEOWNERS` 仍记录 Workflow、认证/安全、迁移和 Agent/Tool Ownership；存在合格 Reviewer 时，至少要求一个非作者 Approval 和 Owned-path Review。
- 根 Husky Hook 通过 lint-staged 对 Staged Files 执行格式化/lint，并通过 commitlint 校验 Commit Message。Hook 保持快速、兼容部分暂存，不执行网络、数据库、构建或全量测试。Hook 可被绕过，因此 CI 会重复合并约束，并校验用于 Squash Merge 的 Pull Request Title。
- GitHub Actions Pull Request CI 使用 Frozen pnpm Lockfile，执行格式检查、lint、类型检查、单元/集成测试、构建、文档策略校验，并在后续加入关键浏览器路径。集成 Job 使用临时 PostgreSQL + pgvector Service。
- Workflow 默认使用 GitHub-hosted 临时 Runner、最小权限、明确 Timeout/Concurrency 和固定完整 SHA 的第三方 Action，且不持有生产凭据。不可信 PR 代码不得通过 `pull_request_target` 执行，也不得把 Cache Artifact 传入可信发布 Job。
- Dependabot 覆盖 pnpm/npm 和 GitHub Actions。由于仓库是 Public，F-08 在实施时确认当前设置后启用 Dependency Review、CodeQL/Code Scanning、Secret Scanning 和 Push Protection。

### AI Review 策略

- 初始最多启用一个辅助 AI Reviewer。
- 只有 Pull Request 已 Ready for Review、确定性 CI 全绿且完成 Self-review 后，才手动请求 AI Review。不启用 Draft、每个 Pull Request 或每次 Push 的 Automatic Review。
- 用三个有代表性且承载风险的 Pull Request 评估它，优先认证、迁移或 Workflow 变更，并记录有效发现、False Positive、漏检和 Latency。首期跳过纯文档、纯生成物和常规依赖更新；只有出现影响风险的实质变更时才重新请求。
- AI-review Comment 永远不满足 Human Approval，也不阻止 Merge。不得启用重叠 AI Reviewer；只有单独完成 Permission、Data Handling、Retention 和 Reliability Review 后才可考虑替代品。
- AI Review 是纵深防御，不是认证、迁移、Workflow 或 Agent Tool 已安全的证据。Pull Request 作者必须处理实质性 Comment，并人工检查 Review Instruction 的变更；敏感边界在发布加固时仍可引入独立人类 Review。

### CI Runner 与 Container Image 策略

- 标准检查直接运行在有明确版本的 GitHub-hosted Ubuntu Runner 上，初期评估 `ubuntu-24.04` 而不是 `ubuntu-latest`；这样避免不必要的 Container Layer，并保留 PostgreSQL Service Container 支持。`ubuntu-slim` 只在确认其较低 CPU、较短 Timeout 和 Container 限制后用于短文档/Metadata Job。
- 不要把 Alpine 等同于更快 CI。Alpine 应用镜像更小，但使用 `musl` 而非 Debian `glibc`，缺少常见工具，并可能增加 Argon2id/Image Processing 等 Native Dependency 或多架构 Build 的复杂度。
- 后续 Web/API Runtime Image 先 Benchmark 固定 LTS 的 Debian Slim 候选；只有全部 Native Dependency 与 Smoke Test 通过后才与 Alpine 比较。记录 Cold/Warm Build Time、Compressed Size、Startup、Vulnerability Finding、Architecture Coverage 和安全更新时效；根据测量结果选择，而不是选择最小 Tag。
- 主要 Build 加速来自 Frozen Install、pnpm/Turbo Cache、合理 Job 并行、较小 Docker Context、稳定 Layer 顺序、Multi-stage Build、过滤后的 Monorepo Output，以及 `pnpm fetch` 或 BuildKit Cache Mount。可信 Release Build 不得复用不可信 Pull Request 可写的 Cache。

Continuous Deployment 仅在 R-09 批准 Hosting Target、Image Registry、运维控制和迁移/回滚策略后启用。目标模式是从可信 Commit 对 Web/API 镜像各构建一次，生成 SBOM/Provenance 证据，并把相同不可变 Digest 推进受保护的 `staging` 与 `production` GitHub Environments。Cloud Access 使用 OIDC，不使用长期 Key；生产要求合格 Reviewer 且禁用 Self-review，部署串行化，并包含 Smoke Verification 和回滚至先前已验证 Digest。Pull Request 不能使用生产 Secret 部署。

## 部署拓扑

Next.js 与 NestJS 独立部署，但浏览器使用同一公开 origin：

```text
https://trip.example.com/*       → Next.js
https://trip.example.com/api/v1/* → Gateway/Ingress → NestJS
                                              └── Agent Runtime（未来可拆）
```

这样保留独立扩缩容和发布能力，同时简化 Cookie、CORS 和浏览器认证。未来移动端或合作伙伴可使用独立 API 域名，但需要单独的认证与 CORS 策略。开发环境通过代理模拟同源入口，不把 Next.js Proxy/Middleware 当成最终授权边界。

## Agent 边界

- 首个获批 Agent 实现使用 TypeScript LangGraph，并放在 NestJS `AgentModule` 内；认证切片不创建空模块。
- 图、模型密钥和有副作用的旅行工具只在后端执行，并避免依赖 Controller，以便未来迁移到独立 `apps/agent`。
- 出现长任务、后台恢复、高并发流式或独立扩容需求时，再通过 ADR 拆出 Agent 服务。
- Web 后续可以接入 LangGraph React/SDK 展示 token、节点和工具进度，但仍通过 NestJS 鉴权入口访问，不在浏览器运行 Agent。

## 生产级基线

- 安全：Argon2id、固定版本的本地常见/已泄露密码数据集、带 dummy-hash 路径的统一凭据错误、精确 Cookie/CSRF/缓存控制、独立公开发布安全门、敏感字段默认排除。
- 数据：迁移驱动、唯一约束兜底、UTC 时间、真实 PostgreSQL 集成测试。
- 契约：统一错误结构；启用 Swagger 后自动生成客户端并检查漂移。
- 可观测性：结构化日志、request/correlation ID、健康检查；Agent 增加 run/thread 标识。
- 质量：lint、严格类型检查、单元测试、集成测试、端到端测试和生产构建作为 CI 门禁。
- 交付：受保护 Pull Request、Workflow Ownership、不可变 Action 引用、依赖/安全扫描、Artifact Provenance、Environment Approval、OIDC 与 Same-digest Promotion。
- 可访问性：键盘导航、清晰 label、错误播报、焦点管理、足够对比度和响应式布局。

## 文档入口

- [`AGENTS.md`](./AGENTS.md)：英文权威仓库规则、安全边界和完成定义。
- [`PLANS.md`](./PLANS.md)：英文权威任务拆解、依赖、决策和验收标准。
- [`ISSUES.md`](./ISSUES.md)：从 `PLANS.md` 派生、按实施顺序排列的 Issue 草案，包含依赖、Pull Request Boundary、审核标准与所需证据。
- [`README_ZH.md`](./README_ZH.md)、[`AGENTS_ZH.md`](./AGENTS_ZH.md)、[`PLANS_ZH.md`](./PLANS_ZH.md)、[`ISSUES_ZH.md`](./ISSUES_ZH.md)：简体中文跟随版本。

## 参考依据

规划基线参考各项目官方文档：

- [pnpm Workspace](https://pnpm.io/workspaces)
- [pnpm Continuous Integration](https://pnpm.io/continuous-integration)
- [GitHub Actions Secure Use](https://docs.github.com/en/actions/reference/security/secure-use)
- [GitHub Repository Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [GitHub Deployment Environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)
- [GitHub Artifact Attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations)
- [GitHub-hosted Runners](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)
- [GitHub Repository Licensing](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)
- [Husky Get Started](https://typicode.github.io/husky/get-started.html)
- [lint-staged](https://github.com/lint-staged/lint-staged)
- [Node.js Docker Image Variants](https://github.com/nodejs/docker-node#image-variants)
- [pnpm with Docker](https://pnpm.io/docker)
- [Docker Build-cache Optimization](https://docs.docker.com/build/cache/optimize/)
- [Next.js App Router 与项目组织](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js App Router 国际化指南](https://nextjs.org/docs/app/guides/internationalization)
- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication)
- [Next.js Self-hosting 与缓存行为](https://nextjs.org/docs/app/guides/self-hosting)
- [Material UI 与 Next.js 集成](https://mui.com/material-ui/integrations/nextjs/)
- [NestJS Validation](https://docs.nestjs.com/techniques/validation)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [LangGraph.js Overview](https://docs.langchain.com/oss/javascript/langgraph/overview)
- [pgvector](https://github.com/pgvector/pgvector)
- [PostgreSQL `CREATE EXTENSION`](https://www.postgresql.org/docs/17/sql-createextension.html)
- [TypeORM Vector Columns](https://typeorm.io/docs/entity/entities/#vector-columns)
- [Turborepo](https://vercel.com/docs/monorepos/turborepo)
- [NIST SP 800-63B-4：Authenticator Management](https://pages.nist.gov/800-63-4/sp800-63b.html#passwordver)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
