# AGENTS_ZH.md

本文件是权威英文 [`AGENTS.md`](./AGENTS.md) 的简体中文跟随翻译。若两者冲突，以英文版为准并修正本文件。

本文件定义 AI Agent 和工程贡献者在本仓库中的工作约束。适用于仓库根目录及全部子目录；若子目录未来出现更具体的 `AGENTS.md`，以离目标文件最近的规则为准。

## 1. 项目目标

构建一个面向生产环境的旅游 Agent 全栈应用：

- Monorepo，使用 pnpm workspace 管理依赖，Turborepo 管理任务图与本地缓存。
- Web：Next.js App Router、TypeScript、Material UI v6。
- API：NestJS、TypeScript、REST。
- Agent：TypeScript 版 LangGraph，初期集成在 API 内，并保持可独立部署的边界。
- 数据：PostgreSQL；向量能力由 pgvector 提供。
- 首个认证切片：短期 Access JWT + 同源 HttpOnly Cookie；后续增加 Refresh Token、Redis、撤销与轮换。
- 后续能力：Swagger/OpenAPI、Redis、可观测性和 Agent 持久化。

当前仓库处于规划阶段。D-01 至 D-24 已确认，但用户尚未授权实施。在用户另行明确要求开始实施前，不得创建脚手架、业务源文件、依赖、锁文件、License Artifact、数据库迁移、GitHub 自动化、Hook 或基础设施配置。

2026-07-30，用户只授权远程创建 `ISSUE-001` 至 `ISSUE-027` 及其限定范围的 Issue Metadata。这些 Issue 现已存在，但 `P-02`/`ISSUE-001` 仍为 Blocked；创建 Issue 不产生实施权限。仓库当前为 Public；没有另行明确请求时不得改变其 Visibility。

## 2. 指令与事实优先级

发生冲突时按以下顺序处理：

1. 用户当前明确要求。
2. 对应英文 `AGENTS.md` 和更深层目录中的 `AGENTS.md`。
3. 已批准的 `PLANS.md` 与架构决策记录（ADR）。
4. 从 `PLANS.md` 派生、用于实施包装的 `ISSUES.md`；它可以增加审核细节或更严格的顺序，但不能覆盖计划。
5. `README.md` 和其他项目文档。

对于已实现系统的事实，当前代码、迁移、测试和已验证运行行为是证据。发现它们与文档不一致时，不得静默猜测；说明差异，并在同一变更中更新相关权威文档或请求决策。

文档语言规则：

- 无语言后缀的 `README.md`、`PLANS.md`、`ISSUES.md`、`AGENTS.md` 等是英文权威版本。
- 对应 `_ZH.md` 是简体中文跟随翻译，必须明确指向英文权威版本。
- 英文文档有实质变更时，同一变更内同步已有中文版本；决策 ID、任务 ID、状态、范围、路径、命令与验收标准必须一致。
- 中英文冲突时以英文为准，并修复中文版本，不能长期维护两套解释。
- 代码标识、API、Schema、ADR、运维文档及首版产品界面文案默认使用英文，除非后续本地化任务另有规定。
- Public Repository 内容可以把 `@Donny-Guo` 标识为 Repository Owner、Assignee、`CODEOWNERS` Identity 或 Copyright Name。不得记录 Account Plan/Tier、Eligibility/Subscription Status、Billing/Usage Allowance、Maintainer-count Profile 或其他私人账户 Metadata。

## 3. 计划中的仓库边界

```text
.github/
  workflows/             # 首个切片加入 PR CI/安全；R-09 批准后才加入部署
  CODEOWNERS
  dependabot.yml
  PULL_REQUEST_TEMPLATE.md
  ISSUE_TEMPLATE/
.husky/                  # 实施开始后加入根 pre-commit 与 commit-msg Hook
apps/
  web/                  # Next.js Web 应用
  api/                  # NestJS API；仅在 Agent 工作启动后加入 Agent 边界
packages/
  api-client/           # 根据 OpenAPI 生成的前端客户端；不手工维护生成文件
  config-eslint/        # 共享 ESLint 配置
  config-typescript/    # 共享 TypeScript 配置
  test-utils/           # 跨应用测试辅助；有真实复用后再创建
infra/
  docker/               # 本地依赖服务及镜像相关配置
docs/
  adr/                  # 重要且难以逆转的架构决策
  api/                  # API 约定与错误码说明
  agent/                # Agent 图、工具契约、评测与安全说明
AGENTS.md
AGENTS_ZH.md
CONTRIBUTING.md
ISSUES.md               # 从 PLANS.md 派生的有序 Issue 草案
ISSUES_ZH.md
LICENSE                  # 标准 MIT 正文；变更需要 Owner 明确授权
PLANS.md
PLANS_ZH.md
README.md
README_ZH.md
SECURITY.md
```

边界规则：

- `apps/web` 不得直接访问数据库、Redis 或模型供应商。
- `apps/api` 是业务规则、身份验证和数据访问的权威入口。
- Web 与 API 不通过相对路径互相导入源码。
- 跨应用契约优先来自 OpenAPI 生成物；不得维护两份容易漂移的请求/响应类型。
- 只有出现两个以上真实消费者时才抽取共享包，禁止提前建立无用途的 `common`、`utils` 大包。
- 认证切片不得创建空的 `AgentModule`、向量表或生成式 API Client；每个边界都随第一个真实用例创建。
- LangGraph 节点不得直接依赖 HTTP Controller；通过 Agent 模块内的端口/服务调用业务能力。

## 4. 工程工作流

每项变更应遵循以下顺序：

1. 阅读根目录及目标目录中的规则与计划。
2. 检查工作区状态，保留用户已有的未提交修改。
3. 确认任务的验收标准、依赖和非目标。
4. 先完成最小纵向切片，再扩展抽象。
5. 运行与风险相称的静态检查、测试和构建。
6. 同步契约、迁移、文档和环境变量示例。
7. 汇报修改文件、验证结果、遗留风险与待决策项。

未被明确授权时，不得：

- 升级或替换框架、包管理器、ORM、认证方案或部署平台。
- 写入真实密钥，提交 `.env`，或记录密码、Token、模型提示词中的敏感数据。
- 使用破坏性数据库操作、重写 Git 历史或覆盖用户修改。
- 将“临时”Mock、硬编码用户或绕过认证的逻辑带入生产路径。

### GitHub 协作与自动化

- GitHub 是源码与自动化平台。`main` 的变更必须经过 Pull Request；默认使用 Squash Merge 和线性历史。
- Public 仓库由 `@Donny-Guo` 所有。MIT 是已确认的 License 选择；根 License Artifact 只能通过已授权的仓库治理变更创建。Bootstrap 期间强制 Pull Request、已解决对话和稳定 CI Check。Approval Setting 必须可满足，且绝不允许通用绕过 Required Check。
- `CODEOWNERS` 将 `.github/workflows/`、认证/安全边界、数据库迁移和 Agent/Tool 代码分配给 `@Donny-Guo`。存在合格 Reviewer 时，至少要求一个非作者 Approval，并启用 Owned-path Approval。
- 初始最多启用一个辅助 AI Reviewer。只有在 Pull Request 已 Ready、确定性 CI 通过且完成 Self-review 后才手动请求 Review；不自动 Review Draft、每个 Pull Request 或每次 Push。只有出现影响风险的实质变更时才重新请求。用三个代表性 Pull Request 评估它，并在调整 Policy 前记录有效发现、False Positive、漏检与 Latency。AI-review Comment 永远不能满足 Human Approval，也不是 Merge-required；确定性 CI 才是权威。
- Evaluation 期间不启用重叠 AI Reviewer。只有当前 Reviewer 不可用或实测价值不足时，才可在单独审查 Permission、Data Handling、Retention、Availability 和 Cost 后考虑一个替代品。AI/Agent Instruction 可在 Pull Request Branch 中被修改，因此相关变更必须人工检查。
- 根 Git Hook 使用 Husky。`pre-commit` 仅对 Staged Files 执行 lint-staged 格式化与 lint；`commit-msg` 使用 commitlint 校验 Conventional Commits。Hook 必须兼容部分暂存，且不得执行网络、数据库、完整构建或全量测试。
- 本地 Hook 可绕过，只用于快速反馈，不能作为合并或安全权威。CI 必须重复所有必需约束，并校验 Pull Request Title，因为 Squash Merge 会把它写入 `main` 历史。
- Pull Request CI 默认使用 GitHub-hosted 临时 Runner 并监听 `pull_request`；可信的合并后校验监听 `main` Push；启用 Merge Queue 时再加入 `merge_group`。不得通过 `pull_request_target` 执行不可信 PR 代码，不得把仓库或 Environment Secret 暴露给 Fork 代码，也不得让不可信 Cache 进入可信发布 Job。
- 第三方 GitHub Action 必须固定完整 Commit SHA，并保留可读版本注释。工作流顶层 `GITHUB_TOKEN` 权限默认只读，额外权限按 Job 最小授予；设置明确 Timeout 与 Concurrency Cancellation。
- Required Check 名称必须稳定，并提供始终上报的聚合结果，包括 Path Filter 跳过 Job 的情况。CI 配置变更按生产代码同等严格 Review。
- Dependabot 同时管理 pnpm/npm 与 GitHub Actions。对于当前 Public Repo，启用 Dependency Review、CodeQL/Code Scanning、Secret Scanning 和 Push Protection；F-08 实施时再次验证当前可用性，并记录任何不可用控制。
- Self-hosted Runner、Turbo Remote Cache、依赖自动合并和高权限 GitHub App 需要单独完成威胁模型与信任边界 Review。

## 5. 依赖与版本策略

- 只使用 pnpm；根目录锁文件是唯一依赖锁文件。
- 使用 Turborepo 编排 lint、typecheck、test、build 等跨包任务；初期仅启用本地缓存，远程缓存必须经过环境变量与敏感日志审计后另行批准。
- 使用 workspace protocol 引用内部包。
- Node.js、pnpm 及关键框架版本必须在根配置中固定，并由 CI 校验。
- 第三方 Action 使用不可变的完整 SHA；Dependabot 只负责提出 pnpm/npm 与工作流依赖更新，合并前仍需 Review。
- 新增运行时依赖前说明用途；标准库或已有依赖可以解决时不引入新包。
- 版本升级独立提交，附迁移影响和回滚说明，不与功能开发混杂。
- 不使用未经批准的 preview/canary 功能进入生产路径。

## 6. TypeScript 与代码组织

- 开启严格类型检查；禁止无理由使用 `any`、非空断言和宽泛类型转换。
- 对外部输入执行运行时校验；TypeScript 类型不能替代输入校验。
- 文件和模块按业务能力组织，而不是建立横跨全项目的 controller/service/helper 杂物层。
- 控制器、页面和组件保持薄；业务规则放入可独立测试的 service/use-case。
- 使用明确的领域名称。布尔值使用 `is`、`has`、`can` 等前缀。
- 对外导出保持最小化；避免循环依赖和跨模块深层导入。
- 注释解释原因、约束或风险，不复述代码。

## 7. Web 规则（Next.js + MUI v6）

- 使用 App Router 和 `src/`；路由文件放在 `src/app`，业务能力放在 `src/features`。
- 默认使用 Server Component；仅在需要浏览器 API、交互状态或客户端表单时添加 Client Component。
- MUI 是首选组件库；使用主题 token 和 `sx`/封装组件，避免散落的魔法颜色与尺寸。
- 按 MUI 官方方式配置 App Router 的 SSR 样式缓存，避免水合不一致和样式闪烁。
- 表单使用 MUI `TextField` 等呈现，但校验规则由表单/Schema 层负责；不得误认为 MUI 自带业务校验。
- 客户端校验用于即时反馈，服务端必须重复校验并作为最终权威。
- 错误信息应可访问：字段与帮助文本关联、提交错误可聚焦/播报、不能只用颜色表示状态。
- Navigation 使用语义化链接，支持键盘、当前路由状态、移动端和未来权限过滤。
- API 基础地址来自经过校验的环境配置；组件不得散落拼接 URL。
- 浏览器请求使用相对同源 `/api/v1`；Server Component 使用仅服务端可见的内部 API Origin，需要时显式转发入站 Cookie，且该 Origin 不得进入客户端 Bundle。
- 浏览器认证使用同源 HttpOnly Cookie，不得把 Access JWT、Refresh Token 或 Session ID 放入 `localStorage`/`sessionStorage`。
- 在服务端 Layout 中通过显式 no-store 的 `/auth/me` 调用保护 `(app)` 路由组，渲染私有内容前完成认证。只接受已清洗的同源返回路径，区分 `401` 与 API 故障，并避免登录重定向循环。
- 首版界面语言为英文，但所有用户可见文案、校验信息和导航标签必须通过集中消息 key 获取，不得散落硬编码；首个后续 locale 至少包含简体中文 `zh-CN`。
- 日期、时间、数字和货币使用 locale-aware formatter；不得通过字符串拼接制造只能服务英文的展示格式。
- 首版只建立可本地化边界，不提前实现语言切换器或 locale 路由；这些能力按 `PLANS.md` 的后续任务引入。

## 8. API 规则（NestJS）

- 按领域模块组织，例如 `AuthModule`、`UsersModule`、`AgentModule`；避免全局万能模块。
- Controller 只负责传输层，Service/Use Case 负责业务逻辑，Repository 负责持久化。
- 所有外部 DTO 使用具体 class 和全局 ValidationPipe；计划配置 `whitelist`、`forbidNonWhitelisted`、`transform`。
- 使用统一成功/错误契约及稳定的机器可读错误码；HTTP 状态码必须符合语义。
- 不把 ORM Entity、密码哈希、内部异常或堆栈暴露给客户端。
- 配置在启动时进行 Schema 校验；缺失关键配置应快速失败。
- API 路径使用版本前缀（计划为 `/api/v1`）。
- JSON 接口只接受 JSON，拒绝不支持的媒体类型与未知字段，并设置明确的请求体大小限制；校验响应和日志不得回显密码输入。
- 认证与用户私有响应必须设置 `Cache-Control: no-store`；Gateway/CDN 不得缓存包含 `Set-Cookie` 或私有用户数据的响应。
- Swagger/OpenAPI 成为 REST 契约来源后，契约变更必须同步生成客户端并通过漂移检查。
- 健康检查区分存活与依赖感知的就绪状态；启用优雅关闭；日志使用结构化格式并携带请求关联 ID。

## 9. 身份认证与安全

- 邮箱入库前去除首尾空白并按已确认策略转为小写；PostgreSQL 同时约束规范存储形式与唯一性。首个切片只接受 ASCII 邮箱；国际化本地部分和域名需另行明确策略。
- 首版密码策略已确定：8–20 个 ASCII 字符，只允许 `A-Z`、`a-z`、`0-9`、`$`、`#`、`@`、`%`，并且至少包含一个大写字母、一个小写字母、一个数字和一个 `$#@%` 字符。密码绝不 trim 或改写。
- 允许粘贴和密码管理器自动填充；提交前使用简洁的规则清单，失败后提供可操作的字段错误。
- 规则集中在一个可测试的 `PasswordPolicy` 边界，不能在组件和 Controller 中复制多份正则。Web 只镜像规则意图，服务端是最终权威。
- 登录不得重新执行当前注册密码规则，只能对用户原样提交的值做哈希验证；因此后续放宽或调整策略不会锁死已有用户。
- 后续放宽长度或字符集只需修改策略、界面文案、契约与边界测试，不需要 User 表迁移。更严格的新策略默认只作用于新密码或重置密码，除非另行批准强制重新设置流程。
- 注册时对完整候选密码执行固定版本、本地、具备许可证与 checksum 的常见/已泄露密码阻止检查；记录来源、更新周期以及密码创建时的 fail-closed 行为。不得把候选密码或其派生 Hash 发送给远程查询服务。
- 密码只保存 Argon2id 的加盐强哈希。参数至少满足采用时的 OWASP 基线，并在目标运行环境基准测试后固定；禁止明文、可逆加密或日志记录。可选 pepper 必须存放在数据库之外的密钥系统中。
- 注册接口必须处理并发下的唯一约束冲突，不能仅依赖“先查询再插入”。
- 登录对外默认返回统一的“邮箱或密码错误”，避免账户枚举；内部可记录不含敏感值的失败原因。
- 未知账户路径必须对一个固定的 dummy Argon2id Hash 执行一次验证，使其与密码错误路径具有可比的昂贵计算；测试只证明 dummy 路径执行和对外结构一致，不断言脆弱的精确耗时。登录另设宽松的传输上限，与密码创建规则无关，用于限制资源消耗。
- 响应永不返回 `passwordHash`；查询默认也不加载敏感字段。
- 首个切片使用 allowlist 中的 `HS256` 签发 Access JWT，密钥由部署密钥系统提供且至少 256 bit；有效期 15 分钟；`sub` 为 User UUID，`iss=trip-api`，`aud=trip-web`，`iat`/`exp` 必需，时钟容差最多 30 秒。公开发布前必须具备密钥轮换与旧密钥重叠期 Runbook。
- 生产 Cookie 名为 `__Host-trip_access`，属性为 `HttpOnly`、`Secure`、`SameSite=Lax`、`Path=/`、无 `Domain`、`Max-Age=900`；本地 HTTP 只在开发配置中使用显式不同的 `trip_access_dev`、`Secure=false` 和相同 900 秒生命周期。退出时使用完全相同的名称、Path 与安全属性，并发送 `Max-Age=0`。
- 注册和登录复用同一 Token 签发边界；注册成功后立即签发 Access JWT，实现真实自动登录。
- 对首个仅浏览器、同源认证切片，所有不安全方法只接受 JSON，并要求精确匹配受信 `Origin`；可使用有效的同源 `Referer` 回退，缺失或 `null` 来源一律拒绝。存在 Fetch Metadata 时作为纵深防御，且 `GET` 不得改变状态。在这一狭窄拓扑下，`__Host-`/SameSite/Origin 控制是已接受的 CSRF 基线；首个与认证无关的受保护写业务接口上线前，或拓扑扩大时更早，必须增加 synchronizer token 或 signed double-submit token。
- 首版提供当前用户查询和退出端点；退出清 Cookie。Refresh Token、轮换、服务端撤销与 Redis 后续实现，因此被盗 Access JWT 在到期前无法主动撤销，TTL 必须保持较短。
- JWT 必须校验签名、算法、`iss`、`aud`、`exp` 等声明；密钥来自受控配置，不写入仓库。
- 所有认证与 `/auth/me` 响应使用 `Cache-Control: no-store`；共享缓存不得存储带 `Set-Cookie` 或已认证内容的响应。
- 任何公开或共享环境发布前，认证端点必须具备基于 Redis 的分布式限流、安全响应头、隐私安全的审计事件、Proxy Trust 校验和经过测试的故障行为。完成本地切片不代表获准公开发布。
- CORS 使用明确来源白名单；生产环境不使用 `*` 搭配凭据。

## 10. 数据库规则（PostgreSQL + pgvector）

- ORM 已确定为 TypeORM；只使用可审查 migration，生产环境始终关闭 `synchronize`。
- 所有 Schema 变更通过可审查、可前滚的迁移完成；生产环境禁止 ORM 自动同步 Schema。
- 表名、列名和索引遵循统一命名约定；时间统一存储为 UTC 时区时间。
- User 主键使用 UUID；物理表名为 `users`；邮箱 trim + 小写规范化后唯一；包含 `created_at`、`updated_at`。
- 规范邮箱为 trim 后的小写 ASCII，最长 254 字符；数据库使用 CHECK 保证规范存储形式并建立唯一约束。应用层预检查只改善体验，不是并发安全边界。
- 首个迁移不加入邮箱验证、账户状态或角色字段；这些能力只有在后续用例、状态语义和授权模型明确后，才通过前滚迁移加入。
- 迁移需考虑锁、数据回填、回滚/修复路径和零停机兼容窗口。
- 必须区分“镜像包含 pgvector”与数据库已执行 `CREATE EXTENSION vector`。扩展由高权限基础设施/Provisioning 角色启用，应用启动和 Runtime 角色都不得执行；本地 Bootstrap 为环境可重复性启用并验证扩展，生产只在已批准的向量迁移前启用。
- 数据库角色分离：Provisioner 可管理扩展与角色，Migrator 只执行批准的 DDL，Runtime 应用角色只获得所需 DML。迁移由明确的部署 Job 执行，不在每次应用启动时隐式运行。
- 创建向量列前，通过 ADR 一并确定向量维度、距离函数、索引类型、Embedding 模型/版本与重新 Embedding 策略。
- 不因“未来会用”就在今天创建向量表或索引；先定义检索数据、规模和质量指标。
- Repository 集成测试使用真实 PostgreSQL，不用行为不同的内存数据库冒充。

## 11. Agent 与工具规则（LangGraph）

- 初始方案使用 TypeScript `@langchain/langgraph`，放在 `apps/api/src/modules/agent`；独立服务化必须先有 ADR。
- Agent 图、模型和有权限的工具只在后端运行。Web 后续可使用 LangGraph React/SDK 消费流式事件，但不得执行图、持有模型密钥或绕过 NestJS 鉴权入口直连内部 Agent。
- 图的 State、节点输入输出、路由条件和结束条件必须显式类型化。
- 工具定义使用严格输入 Schema、超时、取消、重试上限和稳定错误类型。
- 有副作用的工具必须幂等，或具备幂等键与补偿策略；不得无界重试。
- 外部旅行供应商响应视为不可信输入，经过校验和规范化后才能进入领域层。
- 将系统指令、用户内容和工具结果分层，防范提示词注入和工具越权。
- 每次运行携带 `userId`、`threadId`、`runId` 和 correlation ID；日志与 trace 不记录密钥和完整隐私数据。
- 持久化、流式输出、人工介入和长任务恢复在实现前明确语义；不能仅依赖进程内内存。
- Agent 发布需要确定性单元测试、录制/Mock 的工具契约测试及独立评测集；不得只凭手工聊天验收。

## 12. 部署入口规则

- Next.js 与 NestJS 保持独立构建、部署、扩容和回滚。
- 默认本地开发内循环在宿主机通过 pnpm/Turborepo 运行 Next.js 与 NestJS，以保留快速 HMR、调试和类型反馈；PostgreSQL + pgvector 等有状态基础设施通过固定版本的容器编排运行，Redis 和邮件捕获服务在对应阶段再加入。
- CI 在 runner 上执行应用任务，并为集成测试启动隔离、临时的 PostgreSQL/pgvector 服务；测试不能依赖开发者的持久卷。
- 常规 CI 使用带明确版本的标准 GitHub-hosted Ubuntu Runner；不得仅为了让 CI 看似更小，就把普通 Node.js 检查塞入 Alpine 应用容器。轻量 Runner 只可在确认 CPU、Timeout 和能力限制后用于短文档/Metadata Job。
- 首个纵向切片在本地稳定后，再为 Web/API 增加独立的多阶段、非 root OCI 镜像与全栈容器 smoke test。生产优先使用托管 PostgreSQL/Redis，不把状态数据与应用容器生命周期绑定。
- Image Base 选型必须有证据。先从固定 LTS 的 Debian Slim 候选开始，因为 Native Dependency 与 `glibc` 兼容性更可预期；只有 `musl`、Native Addon、多架构、安全更新时效、Build Time、Startup 和 Smoke Test 证明有净收益时才接受 Alpine。仅体积较小不能通过验收。
- 通过较小 Build Context、稳定 Layer 顺序、Multi-stage Output、过滤后的 Monorepo Artifact、Frozen Install、`pnpm fetch` 或 BuildKit Cache Mount，以及严格的可信/不可信 Cache 隔离优化构建。Release 的 Base/Service Image 固定 Digest。
- R-09 未批准部署目标、Registry、Environment、迁移策略、可观测性和回滚证据前，Continuous Deployment 保持禁用。启用后，每个镜像仅由可信 Commit 构建一次，并通过受保护的 `staging`、`production` GitHub Environments 推进同一不可变 Digest。
- 部署 Job 使用 OIDC 联邦身份，不使用长期 Cloud Credential。生产要求合格 Reviewer 且禁用 Self-review，限制可部署 Branch/Tag，串行化每个 Environment 的部署；迁移使用独立受控 Job，并提供 Provenance/SBOM、Smoke Check 和回滚至先前已验证 Digest 的能力。
- 浏览器生产入口保持同源：页面使用 `https://<host>/`，API 使用同一 host 下的 `/api/v1`，由 Gateway/Ingress/Reverse Proxy 路由至 NestJS。
- 不使用 Next.js Proxy/Middleware 代替服务端授权；NestJS Guard 是受保护 API 的最终安全边界。
- 若未来为移动端或合作伙伴开放独立 API 域名，应单独设计 CORS、Token 传输、限流和客户端身份，不得扩大浏览器 Cookie 的 Domain。
- 本地开发应通过显式代理模拟同源行为；若保留 API 直连端口，只允许明确的开发 origin。
- 仅把 `/api/v1/*` 路由至 NestJS。使用转发的 IP/协议来决定 Secure Cookie、重定向、日志或限流前，必须精确配置可信 Proxy Hop。

## 13. 测试与质量门

功能至少覆盖：

- 单元测试：校验 Schema、领域规则、Service、错误映射、Agent 路由。
- 集成测试：NestJS + 真实 PostgreSQL、迁移、Repository、认证接口。
- 组件测试：表单状态、可访问性、API 错误映射、Navigation 响应式行为。
- 端到端测试：注册自动登录、重复注册、会话恢复、退出、重新登录、错误凭据、受保护路由和导航主路径。
- 安全契约测试：Cookie 设置/删除属性一致、精确 Origin/Referer 策略、JSON-only/请求体限制、no-store Header、Gateway 私有响应行为、JWT Claims/到期、dummy-hash 登录路径和敏感值脱敏。

合并前计划要求文档策略校验、Dependency Review、lint、类型检查、单元/集成测试、生产构建和适用的 E2E 全部通过；可用时加入 CodeQL 和 Secret Scanning 门禁。测试不得依赖执行顺序、真实第三方 API 或共享生产数据。Pre-commit 通过不能替代 CI 结果。

## 14. 文档与决策记录

以下变化必须更新文档：

- 主文档使用英文；已有 `_ZH.md` 必须在同一变更内跟随同步，中英文冲突时英文为准。
- 环境变量、端口、启动方式和本地依赖变化更新 `README.md` 与 `.env.example`。
- API 契约和错误码变化更新 OpenAPI 与 `docs/api`。
- 数据模型变化附迁移说明。
- 跨服务边界、ORM、认证存储、Agent 运行方式、部署拓扑等重要决定新增 ADR。
- 计划状态和范围变化更新 `PLANS.md`，不得用已过期的计划误导下一次实现。
- 实施顺序、依赖、Issue Scope、Pull Request Boundary 或 Acceptance Evidence 变化时更新 `ISSUES.md`，并保持其从 `PLANS.md` 派生。
- CI 必须比较英文文档与现有 `_ZH` 跟随版中的决策/任务/Issue ID 和状态，校验本地 Markdown 链接，并在权威英文文档中出现非技术值所必需的汉字时失败。

## 15. 完成定义

只有同时满足以下条件才可称为完成：

- 验收标准全部有证据。
- 对应测试已添加并通过。
- lint、类型检查和构建通过。
- GitHub Required Checks 已成功上报；必需 Review 和 Owned-file Approval 已完成；全部对话已解决。
- 安全、隐私、可访问性和失败路径已检查。
- 自动化有变更时，已 Review Workflow Dependency、权限、Secret 暴露、Cache 信任和 Release Provenance。
- API、迁移、环境变量和文档保持一致。
- 英文权威文档已更新；已有中文跟随版已同步，或明确标记 pending 及原因。
- 没有隐藏的 TODO、硬编码密钥、跳过测试或未说明的范围外修改。
