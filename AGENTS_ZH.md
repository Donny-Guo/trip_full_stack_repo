# AGENTS_ZH.md

本文件约束仓库根目录及全部子目录中的 AI Agent 与贡献者；目标路径存在更近的 `AGENTS.md` 时，以更近者为准。权威英文版：[`AGENTS.md`](./AGENTS.md)。中英文冲突时修正本文件。

## 1. 项目目标、状态与授权范围

构建面向生产的旅游 Agent 应用：pnpm/Turborepo Monorepo；Web 使用 Next.js 16 App Router、TypeScript、MUI v9；API 使用 NestJS、TypeScript、REST；TypeScript LangGraph 初期位于 API 内并保留可抽离边界；使用 TypeORM 1.1；PostgreSQL 18 提供数据存储，pgvector 留待后续向量工作。首个认证切片使用 15 分钟 Access JWT 与同源 HttpOnly Cookie。Refresh/轮换/撤销、Redis、Swagger/OpenAPI、可观测性、Agent 持久化及旅行供应商集成均在后续阶段。

D-01 至 D-25 已确认。2026-08-02，Owner 授权计划内首个本地认证切片，`P-02`/`ISSUE-001` 因此关闭。授权覆盖计划内代码/脚手架、依赖与根锁文件、Hook、MIT License 治理、首切片 GitHub CI/治理、迁移、本地 PostgreSQL/pgvector 基础设施及同步文档/状态更新。`P-03`/`ISSUE-002`、`F-01`/`ISSUE-003` 与 `F-02`/`ISSUE-004` 已在本地完成；继续按依赖顺序推进 `F-03`/`ISSUE-005` 及现已解除阻塞的 Web 工作，不得超出该切片。

2026-08-03，Owner 通过 D-25 明确取代此前的 Web/ORM 版本约束：使用当前稳定的 Next.js 16、MUI v9 与 TypeORM 版本线，同时保留 PostgreSQL 18 和已选测试系列。经 Review 的精确基线为 Next.js 16.2.12、MUI Material/Icons 9.2.0、`@mui/material-nextjs` 9.1.1，以及 TypeORM 1.1.0。将这些视为明确约束：使用精确 Stable Pin，不得静默替换其他 Major 或 Prerelease，并将版本升级与 Feature Work 隔离。已安装 Dependency 立即迁移；尚未进入所属实施任务的 Dependency 在该任务开始时采用新 Pin。每季度、公开暴露前，以及出现严重且无补丁的安全或兼容性阻断时重新 Review Support/Compatibility。再次变更 Major 仍需 Owner 明确批准。

该授权不包含 Post-MVP、生产部署、启用 CD、Cloud Resource、公开暴露、仓库 Visibility 变更、远程创建 `ISSUE-028` 及之后的 Issue，或远程更新/关闭任何 GitHub Issue。Owner 于 2026-07-30 另行授权远程创建 `ISSUE-001` 至 `ISSUE-027` 及其限定 Metadata；这些 Public Repository Issue 已存在。其他远程 Issue 操作都需单独明确请求。

## 2. 权威顺序、事实与文档

冲突时依次遵循：

1. 用户当前明确要求。
2. 本文件对应的英文 `AGENTS.md` 与更近的 `AGENTS.md`。
3. 已批准的 `PLANS.md`。
4. 从 `PLANS.md` 派生的 `ISSUES.md`；它可增加审核细节或更严格顺序，但不能覆盖计划。
5. `README.md` 和其他文档。

当前代码、迁移、测试及经验证的运行行为是已实现系统事实的证据。证据与文档不一致时，必须报告差异，并在同一变更中更新权威文档或请求决策；不得猜测或保留过时描述。

- 无后缀项目文档是英文权威版本；已有 `_ZH.md` 是简体中文跟随版，并须指向英文来源。
- 英文有实质变更时，同一变更内更新已有跟随版；决策/任务/Issue ID、状态、范围、路径、命令和验收标准必须一致。冲突时英文优先并修复中文。
- 代码标识、API、Schema、Runbook、Commit-facing 技术语言及首版 UI 文案默认使用英文，除非后续本地化任务另有规定。
- Public 内容可将 `@Donny-Guo` 标为 Owner、Assignee、`CODEOWNERS` Identity 或 Copyright Name；绝不记录私人 Account Plan/Tier、Eligibility/Subscription Status、Billing/Usage Allowance、Maintainer-count Profile 或类似 Metadata。

## 3. 仓库与架构边界

计划路径为 `.github/{workflows,CODEOWNERS,dependabot.yml,PULL_REQUEST_TEMPLATE.md,ISSUE_TEMPLATE/}`、`.husky/`、`apps/{web,api}`、`packages/{api-client,config-eslint,config-typescript,test-utils}`、`infra/docker`、`docs/{api,agent}`、`docs/toolchain*.md`，以及根 `AGENTS*`、`PLANS*`、`ISSUES*`、`README*`、`CONTRIBUTING.md`、`SECURITY.md`、`LICENSE`。Workflow 先实现 PR CI/安全；部署等待 R-09。`test-utils` 仅在真实跨应用复用后创建。生成的 `api-client` 文件绝不手工维护。`LICENSE` 保持标准 MIT 正文，修改需 Owner 明确授权。

- `apps/web` 不得直接访问 PostgreSQL、Redis、Model Provider 或高权限 Agent Tool；`apps/api` 是业务规则、认证/授权和数据访问的权威入口。
- Web 与 API 不通过相对路径互相导入源码。OpenAPI 生成物可用后，跨应用契约从其产生；不得手工维护会漂移的重复请求/响应 Model。
- 只有至少两个真实消费者时才抽取共享包；禁止投机性 `common`/`utils` 杂物包。
- 认证切片不得创建空 `AgentModule`、向量表或生成式 API Client；边界随首个真实用例创建。
- LangGraph Node 不依赖 HTTP Controller；通过 Agent 所有的 Port/Service 调用业务能力。

## 4. 工作流与远程操作控制

每项变更都应：阅读适用规则/计划；检查 Worktree 并保留无关修改；确认验收标准、依赖与非目标；交付最小可用纵向切片；运行与风险相称的检查；同步契约、迁移、环境示例和文档；最后报告文件、证据、遗留风险与待决策项。

未经明确授权，不得替换/升级框架、包管理器、ORM、认证方案或部署平台；写入真实 Secret 或提交 `.env`；记录密码、Token、Model Prompt 或私人 Tool Result；执行破坏性数据库操作或重写历史；覆盖用户修改；或在生产路径放置临时 Mock、硬编码用户或认证绕过。

### 由用户控制的远程操作

- 每次 `git push` 前必须报告 Remote、Branch 和 Commit，并等待 Owner 在当前对话明确确认；早先或宽泛授权不能替代该 Gate。
- 绝不通过 Browser/UI 认证或登录 GitHub，也不得发起交互式 GitHub 认证。
- 绝不通过 Browser、CLI、API、Connector 或 App 创建、提交、更新、关闭或合并 Pull Request。所需 PR 内容只写入被 Ignore、不 Commit、不 Push 的本地 `PR_ISSUE_<nnn>.md`；由 Owner 提交。
- 不得配置或保留 GitHub API、App/Connector 或 Browser Session 写权限。发现后必须停止远程操作并请 Owner 移除/限制。用户要求时可做 Read-only 检查；Push 仍需上述 Gate。
- 仓库指令只能约束行为，不能撤销 Tool、Session、Account 或 Connector 能力。实际移除必须由 Owner/Admin 在对应平台或账号控制面完成；不得声称仓库规则已经完成硬禁用。

### GitHub 协作与自动化

- `main` 变更必须经 PR；默认 Squash Merge 和线性历史。Bootstrap 保护要求 PR、已解决对话、稳定 CI Check、可满足的 Approval Setting，且不得通用绕过 Required Check。
- Public Repo 属于 `@Donny-Guo`，MIT 已确认。根 `LICENSE` Notice 与 D-23 冲突；F-08 通过可审核治理变更对齐并验证前必须保留现状。
- `CODEOWNERS` 将 Workflow、认证/安全边界、Migration 和 Agent/Tool 代码分配给 `@Donny-Guo`。存在合格 Reviewer 时，要求一个非作者 Approval 及 Owned-path Approval。
- 初期最多一个辅助 AI Reviewer。仅在 PR Ready、确定性 CI 通过且完成 Self-review 后手动请求；不得自动 Review Draft、每个 PR 或每次 Push。只有影响风险的实质变更才重新请求。用三个代表性 PR 记录有效发现、False Positive、漏检和 Latency 后再调整 Policy。AI Comment 不满足 Human Approval，也不阻塞 Merge；确定性 CI 才是权威。
- 不重叠启用 AI Reviewer。仅当当前 Reviewer 不可用或实测价值不足时，完成单独的 Permission/Data Handling/Retention/Availability/Cost Review 后才考虑一个替代品。AI/Agent Instruction 变更必须人工检查。
- 根 Husky Hook：`pre-commit` 仅对 Staged File 运行 lint-staged 格式化/lint；`commit-msg` 用 commitlint 校验 Conventional Commits。Hook 兼容部分暂存，禁止网络、数据库、完整 Build 或全量 Test。Hook 可绕过，不是合并/安全权威；CI 重复必需约束并校验 Squash Merge 使用的 PR Title。
- PR CI 使用 GitHub-hosted 临时 Runner 并监听 `pull_request`；可信合并后检查监听 `main` Push；启用 Merge Queue 后才加 `merge_group`。不得以 `pull_request_target` 执行不可信 PR 代码、向 Fork 暴露 Repo/Environment Secret，或让不可信 Cache 进入可信 Release Job。
- 第三方 Action 固定完整不可变 SHA 并附可读版本注释。顶层 `GITHUB_TOKEN` 默认 Read-only，额外权限按 Job 最小授予；设置明确 Timeout 与 Concurrency Cancellation。
- Required Check 名称保持稳定，并提供始终上报的聚合结果，包括 Path Filter 跳过场景。CI 变更按生产代码标准 Review。
- Dependabot 覆盖 pnpm/npm 和 Action。对当前 Public Repo 启用 Dependency Review、CodeQL/Code Scanning、Secret Scanning、Push Protection；F-08 验证当时可用性并记录缺口。
- Self-hosted Runner、Turbo Remote Cache、依赖自动合并和高权限 GitHub App 需单独做威胁模型与信任边界 Review。

## 5. 依赖、TypeScript 与组织

- 只用 pnpm 和唯一根锁文件。Turborepo 编排跨包 `lint`、`typecheck`、`test`、`build`；初期只用本地 Cache。Remote Cache 需单独审查环境变量和敏感日志。
- 内部包使用 Workspace Protocol。根配置固定 Node.js、pnpm 和关键框架版本，并由 CI 校验。说明每个 Runtime Dependency；标准库或现有包可用时不引入新包。
- Version Upgrade 与 Feature 分开，并记录迁移/回滚影响。未经批准的 Preview/Canary 功能不得进入生产路径。
- 开启 TypeScript Strict；避免无理由 `any`、非空断言和宽泛 Cast；所有外部输入都做 Runtime Validation。
- 按业务能力组织。Controller/Page/Component 保持薄，业务规则可独立测试。使用明确领域名称和有意义的 Boolean Prefix；最小化 Export、循环依赖和跨边界 Deep Import。注释解释原因、约束或风险。

## 6. Web：Next.js 16 与 MUI v9

- 使用 App Router；Route 放在 `src/app`，Capability 放在 `src/features`。默认 Server Component，仅浏览器 API、交互状态或客户端表单使用 Client Component。
- 将 Next.js Request-time API 与 Route `params`/`searchParams` 视为异步值；显式 `await`，并在有助于安全时使用生成的 Route-aware Helper。同源 Proxy 窄边界使用 `proxy.ts`，不使用已移除的 `middleware.ts` Convention。
- Turbopack 是 Development 与 Production 的默认 Bundler。采用自定义 webpack 路径或其他 Bundler 例外前，必须记录兼容性证据。
- MUI 是默认组件库。使用 Theme Token 和审慎封装/`sx`；配置官方 App Router SSR Cache；避免 Hydration/样式闪烁及散落的魔法值。
- 通过 `@mui/material-nextjs/v16-appRouter` 的 `AppRouterCacheProvider` 集成 MUI。将 `next/link` 传给 MUI 的 `component` Prop 时使用本地 Client Component Adapter；Next.js 要求时，将读取 URL 的 Client Control 放在 `Suspense` 后。
- Form/Schema 层拥有校验规则，MUI Field 负责展示。Client Validation 提供即时反馈，API 重复校验并作为权威。关联字段/帮助文本，提交错误可聚焦或播报，不能只用颜色。
- Navigation 使用语义链接，支持键盘、Active Route、移动布局、未来 Permission Filtering 和 Feature Flag。
- API Base URL 来自已校验环境配置；Component 不拼接 URL。Browser 调用相对同源 `/api/v1`；Server Component 使用 Server-only 内部 API Origin，需要时显式转发入站 Cookie，且不得将 Origin 打入 Client Bundle。
- 认证使用同源 HttpOnly Cookie；Access/Refresh Token 和 Session ID 不得进入 Web Storage。
- Server Layout 在渲染私有内容前，以 No-store `/auth/me` 保护 `(app)`。清洗同源 Return Path，区分 `401` 与 API 故障，并避免 Redirect Loop。
- 首版 UI 为英文，文案、校验和 Navigation 均来自集中 Catalog 的稳定 Key。日期/时间/数字/货币使用 Locale-aware Formatter。此切片只建 I18n-ready 边界，不建 Locale Router/Switcher；首个后续 Locale 至少包含 `zh-CN`。

## 7. API：NestJS

- 按 `AuthModule`、`UsersModule`、后续 `AgentModule` 等领域组织，禁止万能 Module。Controller 管 Transport，Service/Use Case 管业务规则，Repository 管持久化。
- 外部 DTO 使用具体 Class；按计划配置全局 `ValidationPipe` 的 `whitelist`、`forbidNonWhitelisted`、`transform`。
- 使用稳定成功/错误契约、机器可读 Code 和语义正确的 HTTP Status。不得返回 ORM Entity、Password Hash、内部异常、SQL Detail 或 Stack。
- 启动时校验配置，关键值缺失即 Fail Fast。Route 使用 `/api/v1` 版本前缀。
- JSON Endpoint 只收 JSON，拒绝不支持的 Media Type/未知字段，并设置明确 Body Limit。Validation 与 Log 不回显密码。
- 认证和用户私有响应设置 `Cache-Control: no-store`；Gateway/CDN 不缓存带 `Set-Cookie` 或私人用户数据的响应。
- Swagger/OpenAPI 成为 REST 权威来源后，契约变更须重新生成 Client 并通过 Drift Check。
- 区分 Liveness 与依赖感知 Readiness，启用 Graceful Shutdown，Structured Log 携带 Request/Correlation ID。

## 8. 认证与安全

- 邮箱去除首尾空白、转为小写 ASCII、最长 254 字符，并由 PostgreSQL 强制规范存储与唯一性。国际化本地部分/域名需后续明确 Policy。
- 创建密码只接受 8–20 个 ASCII 字符，范围为 `A-Z`、`a-z`、`0-9`、`$#@%`，且至少各含一个大写、小写、数字和 `$#@%`。绝不 Trim/改写密码。允许 Paste/Autofill；提交前显示简明清单，失败后给出具体字段错误。
- 规则集中在一个可测试 `PasswordPolicy` 边界，通过意图共享；Web 不导入 Nest Runtime DTO，Component/Controller 不复制 Regex。Login 不重用当前创建密码的组成规则，而是原样验证已有用户提交值。
- 后续放宽长度/字符集时修改 Policy、UI Copy、Contract 和边界测试，不迁移 User Table。更严格规则仅作用于新建/重置密码，除非另行批准 Re-enrollment Plan。
- 使用固定版本、有 License、带 Checksum 的本地 Server-side Blocklist 拒绝常见/已泄露完整密码；记录来源、更新周期与创建密码时的 Fail-closed 行为。绝不向远程服务发送候选密码或派生 Hash。
- 只存 Salted Argon2id Hash。参数达到当时 OWASP 下限并在目标 Runtime Benchmark。禁止明文/可逆加密及日志记录密码/Hash。Pepper 如有，放在 PostgreSQL 外的 Managed Secret。
- 并发重复注册以数据库唯一约束为边界；Precheck 只改善 UX。
- 未知邮箱和错误密码统一返回 `INVALID_CREDENTIALS`。未知账户路径对固定 Dummy Argon2id Hash 验证一次。测试只断言 Dummy 路径执行和公开 Shape 一致，不断言精确耗时。Login 另设与创建策略无关的宽松 Transport Cap。
- 响应不返回 `passwordHash`；普通 Query 默认不 Select。
- 首切片 Access JWT 仅使用 Allowlist `HS256` 与部署提供的至少 256-bit Secret。TTL 15 分钟；`sub` 为 User UUID；`iss=trip-api`；`aud=trip-web`；必须有 `iat`/`exp`；Clock Tolerance 最多 30 秒。校验 Signature、Algorithm、Issuer、Audience、Expiry 及必需 Claim。Secret 不入 Repo；公开发布前准备 Rotation/Previous-key Overlap Runbook。
- 生产 Cookie：`__Host-trip_access`、`HttpOnly`、`Secure`、`SameSite=Lax`、`Path=/`、无 `Domain`、`Max-Age=900`。仅本地 HTTP 开发使用明显不同的 `trip_access_dev`、`Secure=false`、相同 TTL。Logout 使用完全一致的 Name/Path/Security Tuple 并发送 `Max-Age=0`。
- Sign-up 与 Login 复用 Token Issuance 边界；Sign-up 成功建立真实 Session 并 Redirect Dashboard。
- 首个 Browser-only 同源切片中，所有 Unsafe Method 只收 JSON 并要求精确 Trusted `Origin`；仅以有效同源 `Referer` 回退，缺失/`null` Provenance 一律拒绝。Fetch Metadata 仅作纵深防御，`GET` 绝不改状态。`__Host-`/SameSite/Origin 是窄拓扑下已接受的 CSRF 基线；首个无关认证的受保护业务写操作前，或拓扑扩大时更早，加入 Synchronizer Token 或 Signed Double-submit Token。
- 提供 `/auth/me` 和 Logout；Logout 清 Cookie。Refresh、Rotation、Revocation、Redis 后续实现，因此被盗 Access Token 在短期过期前仍有效。
- 所有认证及 `/auth/me` 响应 No-store；Shared Cache 不存储 `Set-Cookie` 或已认证内容。
- 任何 Public/Shared Release 前，加入 Redis-backed Distributed Rate Limit、Security Header、安全 Audit Event、Proxy-trust Validation 和已测试 Outage Behavior。本地切片完成不等于发布授权。CORS 使用明确 Allowlist；生产凭据请求绝不搭配 Wildcard Origin。

## 9. PostgreSQL 与 pgvector

- TypeORM 已批准。所有 Schema 变更使用可审核、Forward-compatible Migration；生产 `synchronize` 始终关闭。表/列/索引命名一致，时间使用 UTC `timestamptz`。
- TypeORM 1 代码以 ES2023 为目标，使用 `DataSource` 与绑定实例的 Repository，并要求 `@nestjs/typeorm` 11.0.1 或更高版本。不得使用已移除的 Global/Deprecated API；意外的 `null`/`undefined` Where Value 必须报错，仅在明确查询 SQL `NULL` 时使用 `IsNull()`。
- `users` 使用 UUID ID、规范且唯一的 Email、`created_at`、`updated_at`。数据库用 Check 和 Unique Constraint 强制 Trim 后小写 ASCII Email（最长 254）；应用 Precheck 不提供 Race Safety。
- 首次 Migration 不加入 Email Verification、Account Status 或 Role；仅在 Workflow/Authorization Semantics 获批后通过 Forward Migration 添加。
- Migration 需考虑 Lock、Backfill、Repair/Rollback Path 和 Zero-downtime Compatibility Window。
- 区分 pgvector-capable Image 与已启用的 `vector` Extension。高权限 Provisioner 管理 Extension/Role；应用启动与 Runtime Role 绝不执行 `CREATE EXTENSION`。本地 Bootstrap 启用并验证；生产仅在已批准 Vector Migration 前启用。
- 分离 Provisioner、Migrator、Runtime Role：Migrator 执行批准 DDL；Runtime 只获必需 DML。Migration 由明确 Deployment Job 执行，绝不随应用启动隐式运行。
- Vector Column 前，在 `PLANS.md` 中记录并批准 Dimension、Distance Function、Index Type、Embedding Model/Version 和 Re-embedding Strategy。不得创建未使用的 Vector Table/Index。
- Repository Integration Test 使用真实 PostgreSQL，不用 In-memory Substitute。

## 10. LangGraph Agent 与工具

- TypeScript `@langchain/langgraph` 初期位于 `apps/api/src/modules/agent`；抽离需先批准 `PLANS.md` 变更。Graph、Model Credential、高权限 Tool 仅后端运行；Web 后续可消费 Stream，但不得运行 Graph、持有 Model Key 或绕过 NestJS Auth。
- 显式类型化 Graph State、Node Input/Output、Routing、Termination。Tool 使用严格 Input Schema、Timeout、Cancellation、Bounded Retry 和稳定 Error。
- 有副作用 Tool 必须 Idempotent，或使用 Idempotency Key 与 Compensation；禁止无界 Retry。Provider Response 作为不可信输入，校验/规范化后才能进入 Domain。
- 分离 System Instruction、User Content、Tool Result。每次运行携带 `userId`、`threadId`、`runId`、Correlation ID；Log/Trace 不含 Secret 或完整私人数据。
- 实现前定义 Persistence、Streaming、Human-in-the-loop 和 Recovery；不能只依赖进程内内存。
- Release 需要确定性 Unit Test、Recorded/Mocked Tool-contract Test 及独立 Evaluation Set；手工聊天不足以验收。

## 11. 本地开发、CI 与部署

- Next.js 与 NestJS 可独立 Build、Deploy、Scale、Rollback。默认内循环在宿主机通过 pnpm/Turbo 运行；PostgreSQL/pgvector 使用固定版本 Container。Redis/Mail Capture 仅在需要时加入。
- CI 在 Runner 上运行应用任务，并使用隔离、临时 PostgreSQL/pgvector；测试不依赖开发者 Volume。使用版本明确的标准 GitHub-hosted Ubuntu Runner。轻量 Runner 仅在验证 CPU/Timeout/Feature 后承载短 Docs/Metadata Job；不得只为表面更小而把普通 Node Check 放入 Alpine。
- 首个本地纵向切片稳定后，再加入独立 Multi-stage Non-root OCI Image 和全栈 Container Smoke Test。生产优先 Managed Data Service，不将状态绑定到应用 Container 生命周期。
- Base Image 以证据选型，从 Pinned LTS Debian Slim 开始。仅当 musl、Native Addon、多架构、安全更新延迟、Build/Start Time 和 Smoke Test 证明净收益时采用 Alpine；体积小本身不够。
- 使用小 Build Context、稳定 Layer、Multi-stage Output、Filtered Monorepo Artifact、Frozen Install、`pnpm fetch` 或 BuildKit Cache Mount，并严格隔离可信/不可信 Cache。Release Base/Service Image 固定 Digest。
- R-09 批准 Target、Registry、Environment、Migration Policy、Observability 和 Rollback Evidence 前，CD 保持关闭。之后每个 Image 仅从 Trusted Commit Build 一次，同一 Digest 通过受保护 `staging`/`production` Environment 推进。
- Deployment 使用 OIDC，不用长期 Cloud Credential。Production 要求合格且不可 Self-review 的 Reviewer、Branch/Tag Restriction、Serialized Deployment、独立受控 Migration Job、Provenance/SBOM、Smoke Check 及回滚至已验证 Digest。
- Browser 生产入口保持同源：`https://<host>/` 和 `/api/v1` 经 Gateway/Ingress/Reverse Proxy 路由至 NestJS。Next.js Proxy/Middleware 不替代 NestJS Guard。
- 未来 Mobile/Partner Domain 需单独设计 CORS、Token Transport、Rate Limit、Client Identity；不得扩大 Browser Cookie Domain。
- 使用明确本地同源 Proxy，API 直连端口只允许批准的 Development Origin。只将 `/api/v1/*` 路由至 NestJS。依赖 Forwarded IP/Protocol 处理 Cookie、Redirect、Log 或 Limit 前，先配置 Trusted Proxy Hop。

## 12. 测试、文档与完成标准

最低覆盖：

- Unit：Validation Schema、`PasswordPolicy`、Domain Rule、Service、Error Mapping、Agent Routing。
- Integration：NestJS + 真实 PostgreSQL、Migration、Repository、Auth Endpoint。
- Component：Form State、Accessible Error、API Error Mapping、Responsive Navigation。
- E2E：Sign-up Auto-login、重复注册、Session Restore、Logout/Login、Invalid Credential、Protected Route、主 Navigation。
- Security Contract：Cookie Set/Delete 一致性、精确 Origin/Referer、JSON/Body Limit、No-store、Gateway Private-response Behavior、JWT Claim/Expiry、Dummy-hash Path、Sensitive-value Redaction。

合并前通过文档 Policy Check、Dependency Review、lint、typecheck、Unit/Integration Test、Production Build、适用 E2E，以及可用的 CodeQL/Secret-scanning Gate。测试不依赖顺序、真实第三方 API 或共享 Production Data；Hook 不替代 CI。

文档职责：

- Environment Variable、Port、Command 或本地依赖变化时更新 `README.md`/`.env.example`；Contract/Error Code 更新 OpenAPI/`docs/api`；Data Model 变化附 Migration Note。
- Service Boundary、ORM、Auth Storage、Agent Placement、Deployment Topology 等重要决策记录在 `PLANS.md`，并同步受影响的实施文档。
- Scope/Status 更新 `PLANS.md`；Order、Dependency、Issue Scope、PR Boundary 或 Acceptance Evidence 更新派生的 `ISSUES.md`。
- CI 比较英文文档与已有跟随版的 ID/Status，校验本地 Markdown Link，并拒绝权威英文文档中非技术值所必需的汉字。

完成意味着：所有验收标准有证据；相关测试及 lint/typecheck/build 通过；Required GitHub Check、Review、Owned-file Approval 和 Conversation 完成；安全/隐私/可访问性/失败路径已审查；Automation Review 覆盖 Dependency、Permission、Secret Exposure、Cache Trust、Provenance；Contract/Migration/Environment/Docs 一致；Follower 已同步或明确 Pending 原因；不存在隐藏 TODO、硬编码 Secret、Skipped Test 或未解释的范围外修改。
