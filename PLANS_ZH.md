# 开发计划：Monorepo 基础 + 注册登录纵向切片（中文）

本文件是权威英文 [`PLANS.md`](./PLANS.md) 的简体中文跟随翻译。若两者冲突，以英文版为准并修正本文件。

状态：**D-01 至 D-25 已确认；首切片已于 2026-08-02 授权实施；P-03、F-01 至 F-04 与 W-01 已在本地完成，当前依赖已满足的工作还包括 ISSUE-007、ISSUE-009 与 ISSUE-010**\
计划日期：2026-07-30  
实施授权日期：2026-08-02\
范围来源：用户提供的“创建项目目录、Sign Up/Login、Navigation、User 表和 Auth API”  
授权历史：最初规划轮次只产出文档。2026-07-30 的请求单独授权远程创建 `ISSUE-001` 至 `ISSUE-027`，以及相应 Labels、Milestone、Assignee 和原生依赖。2026-08-02，Owner 明确授权计划内的首个本地认证切片，包括代码与脚手架、依赖与根锁文件、Hook、MIT License 治理、首切片 GitHub CI/治理配置、迁移、本地 PostgreSQL/pgvector 基础设施，以及同步文档/状态更新。2026-08-03，Owner 明确授权 D-25 及隔离的 Next.js/MUI/TypeORM Baseline Change。

授权排除项：Post-MVP 工作、生产部署、启用 CD、Cloud Resource、公开暴露、仓库 Visibility 变更、远程创建 `ISSUE-028` 及之后的 Issue，以及远程更新/关闭任何 GitHub Issue 仍需另行明确授权。

当前仓库状态：`Donny-Guo/trip_full_stack_repo` 为 Public。根 pnpm/Turborepo Workspace、唯一 pnpm Lockfile、Editor/Ignore 约定、仅本地缓存的 Task Graph，以及最小且可独立构建的 `apps/web` 与 `apps/api` Scaffold 已存在。统一的根 Prettier 3.9.6 Policy 与标准化 Root Check 已启用；两个应用都消费窄范围的共享严格 TypeScript 与类型感知 ESLint Package。Web Scaffold 使用 Next.js 16.2.12、React 19.2.8、精确的 MUI v9 App Router SSR/CSS-variable Theme Foundation，以及一项 Vitest/React Testing Library Render Regression。API Scaffold 使用 NestJS 11.1.28、严格 ES2023 TypeScript、Jest/Supertest Test Entry、只检查进程的 `GET /api/v1/health/live` 及 Graceful Shutdown Hook。Next.js、Node、Jest 与 Vitest 的应用特定关注点仍保留在各应用本地。TypeORM、CI 自动化、Hook、迁移、基础设施配置、认证与业务代码尚不存在。一份已跟踪的根 MIT `LICENSE` 早于本次授权存在，其当前 Notice 待 F-08 与 D-23 对齐。

## 1. 首个实施切片目标

完成一个可测试的最小纵向切片：开发者能在 pnpm Monorepo 中于宿主机启动 Web/API，并通过容器启动本地 PostgreSQL + pgvector；用户能注册、收到真实 API 成功反馈、使用同一组凭据登录，并在应用壳中看到可扩展 Navigation。

“生产级”在本计划中意味着首个切片具备正确边界、输入校验、安全密码存储、数据库迁移、稳定错误契约和自动化测试，而不是一次性实现所有后续平台能力。

该切片是由多个可独立 Review 的变更集组成的里程碑。“首个切片”表示执行顺序，不是一个自然日内完成全部工作的承诺。

## 2. 首个切片完成后的用户路径

1. 未登录用户打开 Sign Up 页面。
2. 前端通过可访问的规则清单和字段反馈，即时提示空值、邮箱格式、密码长度、缺失字符类别和不允许字符。
3. 合法表单提交至 NestJS；服务端再次校验。
4. API 在事务/唯一约束保护下创建 User，只保存密码哈希。
5. API 在 `201` 响应中设置短期 Access JWT HttpOnly Cookie，页面显示成功反馈并自动进入 Dashboard。
6. 页面通过 `/auth/me` 恢复登录态；未认证用户不能进入受保护的应用路由。
7. 用户退出后 Cookie 被清除，可在 Login 页面使用同一组凭据重新登录。
8. 登录失败统一返回稳定错误码；成功重新设置 Cookie 并进入 Dashboard。
9. Navigation 可前往 Dashboard、Flight Info、User。

## 3. 范围

### 首个切片必须交付

- pnpm workspace 根结构及 `apps/web`、`apps/api` 项目目录。
- Next.js 16 App Router + TypeScript + MUI v9 基础集成。
- NestJS 模块化 API 基础、配置校验和 PostgreSQL 连接。
- `users` 表的首个迁移。
- `UsersModule` 与 `AuthModule`。
- `POST /api/v1/auth/sign-up` 和 `POST /api/v1/auth/login`。
- 最小 Access JWT、同源 HttpOnly Cookie、`GET /auth/me`、`POST /auth/logout` 和受保护路由。
- Sign Up、Login 页面与完整表单状态。
- 可扩展、响应式、可访问的 Navigation Bar。
- Dashboard、Flight Info、User 的最小路由落点。
- 首版英文界面，以及集中消息 key/英文 catalog/locale formatter 组成的 i18n-ready 边界。
- 与本功能相称的单元、集成、组件和关键 E2E 测试。
- 环境变量示例、本地运行说明、根 Pre-commit/Commit-message Hook 和 GitHub Actions CI 质量门。
- GitHub 仓库治理：受保护的 `main`、Pull Request Ownership/Template、MIT License、Dependabot 和可用的安全扫描。

### 首个切片明确不做

- 航班供应商接入、搜索结果或预订流程。
- LangGraph 图、Agent 工具或 LLM 调用。
- Embedding 模型、向量生成、向量列或 pgvector 索引；高权限本地 Bootstrap 会启用并验证镜像中的扩展以保证环境一致，但不创建无用途的向量 Schema。
- Refresh Token、Token 轮换/服务端撤销、Redis、缓存、队列或分布式锁。
- 邮箱验证、忘记/重置密码、社交登录、多因素认证、账户状态或 RBAC。
- 中文翻译、语言切换器和 locale URL；首版只建立不硬编码英文文案的本地化边界。
- 完整 User Profile 功能；User 页面仅为导航落点。
- 完整 Swagger 文档与生成客户端。
- 生产部署、云资源、应用镜像、Registry 发布和启用 Continuous Delivery。未来 GitHub CD 契约现在进入计划，但只在 R-09 实施。

### “生产级”后续补齐项

以下不是遗忘项，而是需要独立设计和验收的后续工作：公开环境认证安全门、Refresh Token 轮换/撤销、Redis 支撑的 Token/session 管理、邮件验证与找回密码、账户状态、RBAC、简体中文、Swagger/OpenAPI 客户端生成、应用镜像与受 Environment 保护的 GitHub Delivery、运维就绪、隐私/威胁建模、向量检索、Agent 持久化/评测/可观测性、供应商降级与成本控制。第 8 节已将它们登记为明确任务。

## 4. 决策记录

D-01 至 D-25 全部已确认并作为当前权威。D-14 至 D-19 是已接受的独立审计建议；D-20 至 D-24 记录用户提出的 GitHub Identity、治理、CI/CD、本地 Hook、License 和 AI Review 要求；D-25 记录 Owner 授权的 Framework/ORM Major-line Revision。首切片实施在既定排除项内已获授权。

| ID   | 状态        | 决策                                                                                                                                                                                                                                                                                                                                                                                                     | 影响范围                        |
| ---- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| D-01 | `CONFIRMED` | 使用 TypeORM；只用 migration，生产禁用 `synchronize`                                                                                                                                                                                                                                                                                                                                                     | B-01 起                         |
| D-02 | `CONFIRMED` | pnpm workspace 管依赖，Turborepo 管任务图与本地缓存；远程缓存后续审计后再启用                                                                                                                                                                                                                                                                                                                            | F-01 起                         |
| D-03 | `CONFIRMED` | 首个切片实现短期 Access JWT，并通过同源 HttpOnly Cookie 传输；Refresh、轮换、撤销和 Redis 后续实现                                                                                                                                                                                                                                                                                                       | B-05、W-05、I-02、R-03          |
| D-04 | `CONFIRMED` | 登录对外统一“邮箱或密码错误”与 `INVALID_CREDENTIALS`                                                                                                                                                                                                                                                                                                                                                     | B-07、W-07                      |
| D-05 | `CONFIRMED` | 注册成功后签发同样的 Access JWT 并自动进入 Dashboard                                                                                                                                                                                                                                                                                                                                                     | B-06、W-06、E2E-01              |
| D-06 | `CONFIRMED` | 首个 Agent 用例开始时在 NestJS `AgentModule` 中使用 TypeScript LangGraph；Web 只消费已认证流式事件；需要独立扩缩容时再拆 `apps/agent`；本切片不创建空模块                                                                                                                                                                                                                                                | R-12                            |
| D-07 | `CONFIRMED` | UUID 主键、物理表名 `users`、邮箱 trim + 小写规范化后唯一                                                                                                                                                                                                                                                                                                                                                | B-02 起                         |
| D-08 | `CONFIRMED` | 首版密码为 8–20 个 ASCII 字符，只允许 `A-Z`、`a-z`、`0-9` 和 `$#@%`，且至少包含一个大写字母、一个小写字母、一个数字和一个 `$#@%` 字符；不 trim；保留常见/已泄露密码阻止与经基准测试的 Argon2id                                                                                                                                                                                                           | B-04、B-06、W-04、R-13          |
| D-09 | `CONFIRMED` | Next.js/NestJS 独立部署；浏览器通过同一公开 origin 的 `/api/v1` 访问 Gateway 后的 NestJS                                                                                                                                                                                                                                                                                                                 | F-05、B-05、W-05                |
| D-10 | `CONFIRMED` | 首版界面使用英文；从第一天集中管理消息 key 和英文 catalog，后续至少支持简体中文 `zh-CN`；首版不做语言切换器或 locale URL                                                                                                                                                                                                                                                                                 | W-02 起、R-08                   |
| D-11 | `CONFIRMED` | 首个迁移不加入邮箱验证、账户状态或角色；相关能力通过按序前滚迁移加入                                                                                                                                                                                                                                                                                                                                     | B-02 起、R-04/R-06/R-07         |
| D-12 | `CONFIRMED` | 本地内循环由宿主机运行 Next.js/NestJS；PostgreSQL + pgvector 等基础设施容器化；应用镜像在纵向切片稳定后加入，生产优先托管数据服务                                                                                                                                                                                                                                                                        | F-02、F-03、F-05、R-09          |
| D-13 | `CONFIRMED` | 无后缀项目文档是英文权威版本；对应 `_ZH.md` 是同步的简体中文跟随版；冲突时英文为准                                                                                                                                                                                                                                                                                                                       | 所有文档任务                    |
| D-14 | `CONFIRMED` | 首版 JWT/Cookie：`HS256`、至少 256-bit 托管密钥、15 分钟 TTL、User UUID `sub`、`iss=trip-api`、`aud=trip-web`、必需 `iat`/`exp`、最多 30 秒时钟容差；生产 Cookie 为 `__Host-trip_access`、`HttpOnly`、`Secure`、`SameSite=Lax`、`Path=/`、无 `Domain`、`Max-Age=900`；本地 HTTP 使用 900 秒的 `trip_access_dev`；退出以匹配属性发送 `Max-Age=0`                                                          | B-05、B-08、W-05、I-02          |
| D-15 | `CONFIRMED` | 仅浏览器的不安全认证请求只接受 JSON，要求精确受信 Origin，同源 Referer 可回退，缺失/`null` 来源拒绝；首个受保护业务写接口或拓扑扩大前加入 CSRF Token                                                                                                                                                                                                                                                     | B-05 至 B-10、I-01/I-02         |
| D-16 | `CONFIRMED` | 已认证/用户私有响应与 Next 服务端认证请求全部 `no-store`；Gateway 不缓存 `Set-Cookie` 或私有响应                                                                                                                                                                                                                                                                                                         | B-05、B-08、W-05、I-01/I-02     |
| D-17 | `CONFIRMED` | 首版邮箱采用 trim 后的小写 ASCII 规范形式，最长 254；数据库使用规范形式 CHECK + UNIQUE；国际化邮箱后续另定策略                                                                                                                                                                                                                                                                                           | B-02、B-03、B-06/B-07           |
| D-18 | `CONFIRMED` | 数据库 Provisioner、Migrator、Runtime 角色分离；高权限 Bootstrap 负责扩展启用；迁移是明确 Job，不在应用启动时自动执行                                                                                                                                                                                                                                                                                    | F-05、B-01、B-02、R-09          |
| D-19 | `CONFIRMED` | 本地切片完成不等于允许公开发布；发布门必须完成 R-02、R-09、R-10 并重新获得安全/运维批准                                                                                                                                                                                                                                                                                                                  | Q-01、H-01、R-02/R-09/R-10/R-14 |
| D-20 | `CONFIRMED` | GitHub 是源码与自动化平台。Public 仓库由 `@Donny-Guo` 所有。`main` 只能通过 Pull Request 修改，要求稳定 Required CI、已解决对话、线性历史、默认 Squash Merge，并禁止 Force Push/删除。Bootstrap 期间 Approval Requirement 必须可满足，且不设置通用 Check Bypass；存在合格 Reviewer 时，至少要求一个非作者 Owned-path Approval                                                                            | F-06、F-08、Q-01                |
| D-21 | `CONFIRMED` | 根 Husky Hook 使用 lint-staged 对 Staged Files 格式化/lint，并在 `commit-msg` 以 commitlint 执行 Conventional Commits；CI 是权威并校验 Squash Pull Request Title；Pre-commit 不执行网络、数据库、构建或全量测试                                                                                                                                                                                          | F-04、F-07、F-08                |
| D-22 | `CONFIRMED` | GitHub CD 受 R-09 和已批准部署目标约束：从可信代码构建一次并 Attest/发布不可变 Web/API Image Digest，通过 OIDC 将同一 Digest 推进受保护的 `staging`/`production` Environments，生产必须由他人批准且禁用 Self-review，部署串行化并支持回滚；Pull Request 代码不获得部署 Secret                                                                                                                            | R-09、R-14                      |
| D-23 | `CONFIRMED` | 仓库 Owner 及初始 `CODEOWNERS` Identity 为 `@Donny-Guo`。MIT 是已确认的 Open-source License 选择；标准根 License 使用 `Copyright (c) 2026 Donny-Guo`，需要 Owner 明确授权，且不强制每个 Source File 加 License Header。F-08 负责验证与维护该 Artifact                                                                                                                                                    | F-08、文档                      |
| D-24 | `CONFIRMED` | 初始最多启用一个辅助 AI Reviewer。只有 Pull Request 已 Ready for Review、确定性 CI 全绿并完成 Self-review 后才手动请求。用三个有代表性且承载风险的 Pull Request 评估它；不自动 Review Draft/每次 Push，不启用重叠 Reviewer，也不赋予 Merge Gate 权限；调整 Policy 前记录有效发现、False Positive、漏检和 Latency。Public Repository 不记录 Provider 与 Account Detail                                    | F-08、Q-01                      |
| D-25 | `CONFIRMED` | 以当前稳定的 Next.js 16、MUI v9 与 TypeORM 版本线取代原有 Web/ORM 版本约束，同时保留 React 19、PostgreSQL 18 与已批准测试系列。2026-08-03 的精确基线为 Next.js 16.2.12、MUI Material/Icons 9.2.0、`@mui/material-nextjs` 9.1.1，以及 TypeORM 1.1.0。已安装 Dependency 立即迁移；尚未进入 Owner Task 的 Dependency 在任务开始时使用这些 Pin。保持精确 Stable Pin、隔离 Upgrade，再次变更 Major 需明确批准 | P-03、F-02、W-01、B-01          |

### 密码策略变更契约

8–20 组合规则集中隔离，因此后续演进不需要数据模型迁移：

- 服务端只有一个 `PasswordPolicy` 负责创建或替换密码；Web 只镜像规则意图以提供即时反馈，不能成为安全权威。
- 登录只把用户原样提交的值与已有哈希比较，不执行当前注册长度、字符集或组合规则。
- 后续放宽策略只修改策略边界、客户端文案、API 契约文档和边界测试；已有哈希与 `users` 表保持有效。
- 后续收紧策略默认只作用于新密码和重置密码；没有单独审批的重新注册方案，不得静默锁定或强制轮换已有用户。
- 哈希无法判断旧密码是否符合新规则，因此不存在可靠的“迁移全部旧密码”捷径。

## 5. 目标架构与依赖方向

```text
Browser: https://trip.example.com
  │
  ▼
apps/web (Next.js + MUI)
  │  same-origin /api/v1；Gateway/Ingress 路由；未来使用 OpenAPI 生成客户端
  ▼
apps/api (NestJS)
  ├── AuthModule ──► UsersModule ──► Repository ──► PostgreSQL
  └── AgentModule ──► LangGraph ──► Travel tool adapters（随首个真实用例创建）
                                         │
                                         └── 外部航班/旅行供应商（后续）

Redis（后续）用于缓存、限流和短期协调，不是 User 主数据源。
本地镜像具备 pgvector 能力；高权限 Bootstrap 启用并验证扩展。生产扩展启用属于基础设施职责，仅在已批准的向量迁移前执行；在模型和检索需求明确前不创建向量列。
```

依赖原则：Web 不直接连接数据层或内部 Agent；Controller 不直接操作 ORM；Auth 通过 Users 提供的窄接口访问凭据；Agent 工具通过应用服务访问业务能力。Next.js 与 NestJS 虽共享公开 origin，仍保持独立部署和扩缩容。

### 5.1 本地运行拓扑

```text
Host（pnpm + Turborepo）
  ├── Next.js dev server ── /api/v1 proxy ──► NestJS dev server
  └── test/lint/typecheck/build

Docker Compose（仅本地基础设施）
  └── PostgreSQL + pgvector
      ├── healthcheck
      ├── Provisioner/Migrator/Runtime 开发角色
      ├── 高权限扩展启用与验证
      └── named development volume

后续按需加入：Redis、邮件捕获服务；纵向切片稳定后再加入 Web/API 镜像。
```

这样让应用迭代保持快速，同时让有状态依赖可重复。CI 使用临时数据库服务而不是复用开发卷；生产应用容器无状态，PostgreSQL/Redis 优先采用托管服务。

## 6. API 契约草案

### 6.1 通用错误结构

| 字段          | 类型                             | 用途                                       |
| ------------- | -------------------------------- | ------------------------------------------ |
| `code`        | string                           | 稳定、机器可读的错误码                     |
| `message`     | string                           | 用于诊断和未本地化客户端的安全英文回退文案 |
| `fieldErrors` | `Record<string, string[]>`，可选 | 字段名到一个或多个稳定机器错误码的映射     |
| `requestId`   | string                           | 排障关联 ID                                |

Web 通过 Catalog 本地化 `code` 和 `fieldErrors`；API 文案不是本地化契约。禁止泄露 ORM 错误、堆栈、SQL、密码值/哈希或账户内部状态；校验错误不得回显被拒绝的密码。

### 6.2 注册

| 项目       | 约定草案                                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Endpoint   | `POST /api/v1/auth/sign-up`                                                                                                                  |
| Request    | `email`、`password`                                                                                                                          |
| Success    | `201 Created`；设置 Access JWT HttpOnly Cookie，返回 `messageCode: AUTH_SIGN_UP_SUCCEEDED` 和安全 User `{ id, email, createdAt, updatedAt }` |
| Validation | `400 VALIDATION_ERROR`，包含字段错误                                                                                                         |
| Duplicate  | `409 EMAIL_ALREADY_EXISTS`；由数据库唯一约束作为最终保障                                                                                     |

### 6.3 登录

| 项目                | 约定草案                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| Endpoint            | `POST /api/v1/auth/login`                                                                      |
| Request             | `email`、`password`                                                                            |
| Success             | `200 OK`；设置 Access JWT HttpOnly Cookie，返回安全 User `{ id, email, createdAt, updatedAt }` |
| Validation          | `400 VALIDATION_ERROR`，包含字段错误                                                           |
| Invalid credentials | `401 INVALID_CREDENTIALS`，邮箱不存在和密码错误使用相同响应                                    |

### 6.4 当前会话与退出

| Endpoint                   | Success                                              | Failure/说明                                    |
| -------------------------- | ---------------------------------------------------- | ----------------------------------------------- |
| `GET /api/v1/auth/me`      | `200`，返回当前安全 User 摘要                        | 缺失、无效或过期 JWT 返回 `401 UNAUTHENTICATED` |
| `POST /api/v1/auth/logout` | 幂等 `204`，无论 Cookie 是否有效都清除 Access Cookie | 无业务响应体；仍执行 Origin/CSRF 检查           |

JWT 使用 allowlist 中的 `HS256`、至少 256-bit 部署托管密钥、15 分钟 TTL、User UUID `sub`、`iss=trip-api`、`aud=trip-web`、必需 `iat`/`exp` 和最多 30 秒时钟容差。生产使用 `__Host-trip_access`，属性为 `HttpOnly`、`Secure`、`SameSite=Lax`、`Path=/`、无 `Domain`、`Max-Age=900`；本地 HTTP 使用相同生命周期的 `trip_access_dev`。退出以相同 Cookie 属性发送 `Max-Age=0`。

带请求体的认证端点只接受 `application/json` 并设置较小的明确 Body Limit。不安全浏览器方法要求精确受信 `Origin`，同源 `Referer` 可回退，缺失或 `null` 来源拒绝；`GET` 不改变状态。认证/User 响应和 Next.js 服务端会话请求均使用 `Cache-Control: no-store`。首个受保护业务写接口或不再满足狭窄同源假设的部署上线前，CSRF Token 必须加入。

### 6.5 输入规则草案

| 字段                    | 客户端即时校验                            | 服务端权威校验                                                                     | 说明                                              |
| ----------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------- |
| email                   | 必填、trim、ASCII 邮箱结构、最大 254 字符 | trim + 小写后查询/写入；数据库 CHECK + UNIQUE 保证规范形式                         | 国际化邮箱后续另定；不用自制正则追求完整 RFC 覆盖 |
| 注册/重置/改密 password | 必填、8–20，显示字符类别和允许字符清单    | 只允许 `A-Z`、`a-z`、`0-9`、`$#@%`；四类各至少一个；完整密码 blocklist；不 trim    | 允许粘贴和密码管理器                              |
| 登录 password           | 必填且最多 1,024 个传输字节               | 将原样提交值与已有哈希比较，不执行当前创建密码策略；未知用户走固定 dummy-hash 路径 | 保持兼容，同时限制资源并降低计时枚举风险          |
| unknown fields          | 不发送                                    | 拒绝                                                                               | 防止 mass assignment                              |

前后端可共享规则意图和错误码，但服务端不能信任客户端，也不应为了“复用类型”把 Nest 运行时 DTO 直接导入 Web。

## 7. User 表草案

物理表建议命名为 `users`，避免 PostgreSQL `USER` 语义和引用混乱。

| 列              | 类型草案     | 约束/索引                                          | API 可见性 |
| --------------- | ------------ | -------------------------------------------------- | ---------- |
| `id`            | uuid         | Primary Key，数据库生成                            | 可见       |
| `email`         | varchar(254) | NOT NULL；CHECK trim 后小写 ASCII 规范形式；UNIQUE | 可见       |
| `password_hash` | text         | NOT NULL                                           | 永不返回   |
| `created_at`    | timestamptz  | NOT NULL、默认当前时间                             | 可见       |
| `updated_at`    | timestamptz  | NOT NULL、一致更新策略                             | 可见       |

迁移验收：Migrator 可从空库前滚；直接写入非规范邮箱和并发重复邮箱均被数据库拒绝；Runtime 角色不能执行 DDL；降级/修复策略有说明；测试证明密码哈希列不会序列化到 API。密码策略变化不需要表或数据迁移。

## 8. 可执行任务清单

适合直接实施的 Issue 包装、顺序、审核标准和所需证据维护在英文权威 [`ISSUES.md`](./ISSUES.md) 中；若文档发生冲突，仍以本计划为准。

状态图例：决策 `CONFIRMED` 是当前权威。任务 `TODO` 未开始；`BLOCKED` 等待外部决策或授权；`DONE` 已有证据完成；`TODO（后续）` 是首个切片权限之外的 Backlog；`BLOCKED（后续）` 是同时等待前置条件与明确授权的未来 Gate。

### Phase 0 — Review 与实施门

#### P-01 完成产品、架构与审计 Review — `DONE`

- 负责人：Product + Tech Lead
- 前置：无
- 动作：记录已接受的独立安全/运维审计 D-14 至 D-19，以及已确认的 GitHub Identity、治理、CI/CD、Hook、MIT License 与辅助 AI Review 决策 D-20 至 D-24，同时保留首个切片明确非目标。
- 产出：英文权威 `PLANS.md` 和同步的 `PLANS_ZH.md` 跟随版。
- 验收：已于 2026-07-30 满足——用户明确接受 D-14 至 D-19，要求加入 GitHub 治理、CI/CD 规划和 Pre-commit 行业规范，随后确认 `@Donny-Guo`、MIT License 与 Manual、Non-blocking 的辅助 AI Review Policy；全部决策只有一个答案；规划内容未写成已实现事实。

#### P-02 授权实施 — `DONE`

- 前置：P-01
- 动作：获取用户明确要求开始实施的指令；Review 意见和规划文档修改不等于开工授权。
- 产出：Owner 于 2026-08-02 发出的无歧义实施开始指令。
- 验收：已于 2026-08-02 满足——Owner 明确授权计划内的首个本地认证切片，覆盖代码、脚手架、依赖与根锁文件、Hook、MIT License 治理、首切片 GitHub CI/治理配置、迁移、本地 PostgreSQL/pgvector 基础设施，以及同步文档/状态更新。Post-MVP 工作、生产部署/CD、Cloud Resource、公开暴露、仓库 Visibility 变更、远程创建 `ISSUE-028` 及之后的 Issue，以及远程更新/关闭任何 GitHub Issue 仍为排除项。

#### P-03 冻结兼容版本矩阵 — `DONE`

- 前置：P-02
- 已确认的 Owner 约束：2026-08-02 Baseline 保留 Next.js 15、MUI v6 与 TypeORM 0.3.31。D-25 于 2026-08-03 明确以当前稳定的 Next.js 16、MUI v9 与 TypeORM 版本线取代这三项选择。PostgreSQL 18 与 Jest/Supertest、Vitest/React Testing Library、Playwright 系列保持不变。不得静默替换这些 Major 或测试系列；再次变更 Major 需明确批准。
- 动作：从 Primary Source 维护 Node.js LTS、pnpm、TypeScript、Turborepo、Next.js 16、React/React DOM、MUI v9 及其官方 Next/Emotion Integration、NestJS 及其 CLI/Adapter Package、TypeORM 1.1、PostgreSQL Driver、PostgreSQL 18、pgvector、Argon2、ESLint、Prettier、Jest/Supertest、Vitest/React Testing Library、Playwright、Husky、lint-staged 与 commitlint 的精确兼容基线。选择有明确版本的标准 GitHub-hosted Ubuntu Runner（评估 `ubuntu-24.04`，不用浮动 `-latest` 或 Preview Label），记录后续 Benchmark 的 Debian-slim/Alpine 应用镜像候选，定义精确 Pin/Range 与升级/回滚策略，并建立带可读版本注释、使用完整 SHA 的初始 Action Reference Register。
- 产出：`.node-version`、权威 `docs/toolchain.md` 及其 `docs/toolchain_ZH.md` 跟随版。Toolchain 文档包含唯一矩阵，记录精确选择、Compatibility/Support Status、Primary-source Link 与检查日期、Pin/Enforcement Location、Update Owner/Cadence、Rollback Target、下游 Verification Task，以及初始不可变 Action Reference Register。
- 验收：记录精确 Node 与 pnpm 选择，且 `.node-version` 与矩阵一致；不选择浮动 `latest`、Canary、Preview、Prerelease 或可变 Action Reference；明确 D-25 的 Next.js 16/MUI v9/TypeORM 1.1 选择；兼容证据覆盖 MUI/Next SSR、NestJS/TypeORM/PostgreSQL、pgvector、Native Argon2 及受支持 Runtime 交集；每个 Pin 都注明 Owner、回滚与下游 Enforcement Task。F-01 实现根 `packageManager`/Engine Constraint，F-02 证明已安装 Next Line，F-05 固定并验证数据库镜像，B-04 证明 Argon2 Runtime Behavior，W-01 证明 MUI SSR，F-06/F-08 证明 CI 一致性及完整 Action Register；P-03 不声称尚不存在的下游检查。
- 完成证据：2026-08-02，`.node-version`、[`docs/toolchain.md`](./docs/toolchain.md) 及同步跟随版建立原始精确矩阵、Policy、Rollback Class、Candidate Image、Full-SHA Action Register 与 Downstream Enforcement Map。D-25 于 2026-08-03 根据当前 Primary Source 与 Publisher Metadata 修订 Next.js/MUI/TypeORM Row。F-01 提供 Root Installation、Lockfile 与 Task-graph Evidence；F-02 提供 Next.js 16 Installation/Build/Runtime Evidence；W-01 于 2026-08-05 提供 MUI v9 Installation、SSR、Hydration、Navigation 与 Render-test Evidence。TypeORM/PostgreSQL Runtime Evidence 仍由 B-01 负责。

### Phase 1 — Monorepo 与本地环境

#### F-01 建立 pnpm Monorepo 根 — `DONE`

- 前置：P-02、P-03
- 动作：创建 workspace 定义、根脚本、包管理器版本约束、共享 ignore/editor 约定、供后续 Husky 使用的根 `prepare` 边界和 Turbo 任务图；只启用本地缓存。
- 产出：可发现 `apps/*`、`packages/*` 的根工作区。
- 验收：单一根 lockfile；内部包只能使用 workspace protocol；根命令能定位各应用任务；Turbo 依赖和输出声明正确且未启用远程缓存。
- 完成证据（2026-08-02）：`package.json`、`pnpm-workspace.yaml`、`turbo.json`、`.editorconfig`、`.gitignore` 与唯一 `pnpm-lock.yaml` 实现了精确的 Node 24.18.0、pnpm 11.18.0、Turborepo 2.10.8 与 TypeScript 5.9.3 选择；根任务与保留的 No-op `prepare` Boundary；`apps/*`/`packages/*` 发现；Strict Engine、Exact Dependency Saving 与 Workspace-protocol Saving；声明的 Build Output；不缓存 Format；以及显式禁用 Remote Cache。Frozen Install 在由 Committed HEAD 加本次变更组装的 Disposable Fresh Candidate Tree 中成功。Dry Graph 与五个根命令全部成功；应用脚手架尚未创建，因此零个 Package Task 符合预期。Disposable Two-package Fixture 进一步证明了两个 Workspace Glob、`workspace:*` Resolution、Dependency Ordering、Local Cache 对声明 Output 的恢复以及 Format Cache Bypass。未发现 npm/yarn Lockfile 或包含 Secret/Remote Cache 的配置。

#### F-02 创建 Next.js 项目目录 — `DONE`

- 前置：F-01
- 动作：在 `apps/web` 创建 TypeScript + App Router + `src/` 结构；不引入未批准的 Tailwind；配置严格类型检查；默认由宿主机 pnpm/Turbo 运行开发服务。
- 产出：最小可构建 Web 应用。
- 验收：开发启动、类型检查、lint、production build 成功；没有模板遗留页面或无用依赖。
- 完成证据（2026-08-03）：`apps/web` 是最小 App Router/`src` TypeScript Package，启用 Strict Checking，不包含 Tailwind、伪 Business Behavior 或暴露到 Client 的 API Configuration。D-25 将已安装 Framework 从 15.5.22 升级为精确的 `next@16.2.12`/`eslint-config-next@16.2.12`，移除 Direct Legacy `FlatCompat` Dependency，采用 Next 原生 Flat Config，并接受 Next 生成的 `react-jsx` 与 Development Route Type。`pnpm install`、Web Lint、Route Type Generation、Strict TypeScript、Turbopack Production Build，以及返回 `200` 和 `Trip Agent` 的 Production `GET /` Smoke Check 全部通过。F-02 未生成 Web Test；W-01 后续加入 App-local Vitest Tooling 与一项 Render Regression，进一步 Coverage 仍由后续 Component/E2E Task 负责。

#### F-03 创建 NestJS 项目目录 — `DONE`

- 前置：F-01
- 动作：在 `apps/api` 创建 NestJS TypeScript 应用；建立 `/api/v1`、模块目录、测试入口、仅检查进程的 Liveness 和 Graceful Shutdown Hook；默认由宿主机 pnpm/Turbo 运行。不得创建空的 `AgentModule`。
- 产出：最小可启动 API。
- 验收：启动、类型检查、lint、test、production build 成功；默认示例 Controller 已清理或替换为明确健康入口。
- 完成证据（2026-08-03）：`apps/api` 是可独立构建的 NestJS 11.1.28 Package，使用严格 ES2023 TypeScript、原生类型感知 ESLint、`/api/v1` Prefix、明确的 `HealthModule`、只检查进程的 `GET /api/v1/health/live` 与 Shutdown Hook。API lint、typecheck、一个 Unit Test、两个 Supertest HTTP Assertion、组合 Test Entry 和 Production Build 均通过；Root format、lint、typecheck、test、build 与 Frozen Install 均通过。Development 与编译后的 Production Start 都返回 `200` 和 `{"status":"ok"}`，已移除的 Starter Root 返回 `404`，两个进程均在一次中断后退出且无挂起。Package 不含 ORM、Readiness、认证、UsersModule、AgentModule、Redis、Swagger、Provider Integration、嵌套 Lockfile 或 Starter README。

#### F-04 建立共享工程配置 — `DONE`

- 前置：F-01、F-02、F-03
- 动作：抽取真正共享的 TypeScript/ESLint 配置，建立统一 Prettier 策略；统一 `format`、`format:check`、`lint`、`typecheck`、`test`、`build` 任务名。
- 产出：`packages/config-typescript`、`packages/config-eslint`（若确有复用价值）。
- 验收：Web/API 不复制冲突规则；缓存任务声明正确；生成物和环境文件不进入 Git。
- 完成证据（2026-08-05）：两个应用均通过 `workspace:*` 消费窄范围的 `@trip/config-typescript` 与 `@trip/config-eslint` Package；统一的精确根 Prettier 3.9.6 Policy 及标准化 `format`、`format:check`、`lint`、`typecheck`、`test`、`build` Task 已启用，而 Next.js、Node、Jest 与 Vitest 关注点仍保留在应用本地。精确 Node/pnpm Check、Frozen Install、Formatting Check、强制 Lint/Typecheck/Test/Build Task、Web Render Test、API Unit 与 HTTP Test、Production Build、Shared-config Loading、五类故意违规的 Negative Rule Probe、Ignore Allow/Deny Matrix、Lockfile/Package-boundary Audit，以及两次命中的 Local-cache Output-restoration Run 均通过。Remote Cache 保持关闭，且未发现竞争 Lockfile、Deep/Circular Config Import、推测性 `test-utils`、Probe Residue 或被隐藏的 Source/Contract File。

#### F-05 建立本地 PostgreSQL/pgvector 环境 — `TODO`

- 前置：D-09、D-12、D-18、F-03
- 动作：通过 Docker Compose 提供固定 PostgreSQL + pgvector 镜像、健康检查、具名开发卷和相互分离的非生产 Provisioner/Migrator/Runtime 凭据；高权限 Bootstrap 启用 `vector` 并记录 `extversion`；建立 `.env.example` 并忽略 `.env`。此阶段不把 Web/API 放入 Compose。
- 产出：开发者可重复启动的 PostgreSQL + pgvector。
- 验收：数据库可独立重复启停并健康；分别验证扩展可用性和启用状态；只有 Migrator 可从空库迁移；API 使用不能执行 DDL/扩展操作的最小权限 Runtime 用户；无真实密钥；不引入 Redis。

#### F-06 建立 GitHub Actions Pull Request CI — `TODO`

- 前置：D-20、F-04、F-05
- 动作：创建最小权限 Workflow，监听 `pull_request`、可信 `main` Push，并在启用 Merge Queue 后监听 `merge_group`。在选定的有明确版本标准 GitHub-hosted Ubuntu Runner 上安装固定 Node/pnpm Toolchain，使用 Frozen Lockfile，直接通过 Turbo 执行 Format Check、lint、typecheck、单元/集成测试和 Build，而不是把这些任务放入 Alpine 应用镜像；启动临时且固定版本的 PostgreSQL + pgvector Service；校验 Markdown 链接、英文主文档语言规则，以及现有 `_ZH` 跟随版中的决策/任务/Issue ID 与状态一致性。第三方 Action 固定完整 SHA，设置 Timeout/Concurrency Cancellation，隔离不可信 Cache，并提供即使 Path Filter 跳过 Job 也始终上报的稳定 `ci-required` 聚合结果。轻量 Runner 只可针对短且无需 Docker 的文档/Metadata Job 评估。
- 产出：`.github/workflows/ci.yml` 和 Required-check 名称文档。
- 验收：每个 Required Result 都会上报，失败阻止合并；Fork Pull Request 无需 Secret 即可运行；没有 `pull_request_target` Job 执行不可信代码；不可信 Artifact/Cache 不能进入可信 Job；Cache 不掩盖 Lockfile 或生成物漂移；不使用生产凭据或真实第三方 API。

#### F-07 增加本地 Git Hook 与 Commit 约定 — `TODO`

- 前置：D-21、F-01、F-04
- 动作：配置根 Husky Hook；`pre-commit` 只对 Staged Files 执行 lint-staged Prettier/ESLint；`commit-msg` 通过 commitlint 执行 Conventional Commits；CI 校验用于 Squash 的 Pull Request Title。Hook 保持确定性、兼容部分暂存，并排除网络、数据库、Build 和全量测试。
- 产出：`.husky/` Hook、lint-staged/commitlint 配置、根脚本与贡献指南。
- 验收：合法 Staged Change 和 Commit Message 通过；格式/lint/消息错误可操作；部分暂存文件不被破坏；文档允许的 `--no-verify` 绕过会被 CI/PR-title 检查捕获；正常根 pnpm Install 后 Hook 能正确安装。

#### F-08 建立 GitHub 仓库治理与安全自动化 — `TODO`

- 前置：D-20、D-21、D-23、D-24、F-06、F-07
- 动作：加入把初始敏感路径分配给 `@Donny-Guo` 的 `CODEOWNERS`、贡献/安全指南、Pull Request/Issue Template，以及同时覆盖 pnpm/npm 与 GitHub Actions 的 Dependabot 配置；验证并维护版权声明为 `Copyright (c) 2026 Donny-Guo` 的标准 MIT `LICENSE`。为 Public 仓库配置 `main` Ruleset：仅 Pull Request、Squash/线性历史、对话已解决、稳定 Required Checks、禁止 Force Push/删除。Bootstrap 期间 Approval Requirement 必须可满足，且不允许 Owner 通用绕过 Required Check；记录存在合格 Reviewer 时改为一个非作者 Owned-path Approval 的触发条件。验证当前设置后启用 Public-repository Dependency Review、CodeQL/Code Scanning、Secret Scanning 和 Push Protection。如启用辅助 AI Reviewer，只在 Pull Request 已 Ready、确定性 CI 全绿并完成 Self-review 后手动请求；排除 Draft、每个 PR/每次 Push 自动 Review、纯文档/纯生成物和常规依赖更新。用三个有代表性的认证、迁移或 Workflow Pull Request 评估它；只有出现影响风险的实质变更时才重新请求。记录有效发现、False Positive、漏检、Latency、Availability 和相关 Data-handling Setting。不启用重叠 AI Reviewer；替代方案必须另行 Review Permission、Data/Retention/Reliability。Public Repository 不记录 Provider 或 Account Detail。
- 产出：纳入版本控制的 `.github/`、`CONTRIBUTING.md`、`SECURITY.md`、MIT `LICENSE`、Repository-settings Checklist、Ownership Matrix、Bootstrap Review-policy Record 和辅助 AI-review Evaluation Record。
- 验收：直接修改 `main` 和绕过 Required Check 被阻止；合并必须经过 Pull Request、确定性检查和 Self-review；`CODEOWNERS` 将敏感路径分配给 `@Donny-Guo`，但不造成无法满足的 Self-approval Gate；未来 Human-review 转换有 Owner 与 Trigger；仓库可被正确识别为带已批准声明的 MIT License；AI Review 不计作 Human Approval、不阻止 Merge、保持在已记录的 Evaluation Scope 内，且不启用重叠 Reviewer；Dependabot 覆盖两个依赖生态且不自动合并 Major Version；Action 保持完整 SHA 固定；Public-repository CodeQL/Dependency/Secret Control 已启用，或当前限制已记录。

### Phase 2 — Database、Users 与 Auth API

#### B-01 接入配置校验与 ORM — `TODO`

- 前置：D-01、F-03、F-05
- 动作：启动时校验端口、Runtime/Migration 数据库 URL、Proxy Trust、CORS/受信 Origin、请求限制和认证配置；建立连接生命周期、依赖感知 Readiness、Graceful Shutdown 和明确 Migration Job 边界。
- 产出：DatabaseModule/ConfigModule 基础。
- 验收：关键配置缺失时快速失败；Liveness 不依赖 PostgreSQL 而 Readiness 依赖；生产关闭 `synchronize` 和启动时自动迁移；测试可注入隔离配置。

#### B-02 创建 `users` 迁移 — `TODO`

- 前置：D-07、D-11、B-01
- 动作：由 Migrator 按第 7 节创建表、邮箱规范形式 CHECK、唯一约束和时间字段。
- 产出：首个可审查迁移。
- 验收：空库 Migration 成功；Schema 与计划一致；直接非规范邮箱写入和并发重复均被数据库拒绝；Runtime DDL 失败；有前滚修复/降级说明。

#### B-03 实现 UsersModule 持久化边界 — `TODO`

- 前置：B-02
- 动作：实现 User Entity/Repository/Service 的窄接口；区分安全 User 视图与含 hash 的内部凭据查询。
- 产出：创建用户、按规范化邮箱查凭据的内部能力。
- 验收：普通查询默认不选择/返回 `password_hash`；唯一冲突映射稳定；Repository 使用真实 PostgreSQL 集成测试。

#### B-04 实现密码服务 — `TODO`

- 前置：D-08
- 动作：集中实现已确认的 8–20 ASCII 允许集合和四类字符规则；为每个失败原因定义稳定错误码；固定一个具备许可证、版本和 checksum 的本地完整密码 Blocklist，并记录来源、更新与失败策略；封装 Argon2id hash/verify，基准测试参数并限制并发成本。不得用候选密码或其派生 Hash 调用远程密码检查服务。
- 产出：可替换、可测试的 `PasswordPolicy` 和 `PasswordHasher`。
- 验收：覆盖 7/8/20/21 边界和每一种缺失类别；穷举可打印 ASCII 补集，并覆盖空白与 Unicode，证明不允许输入均被拒绝；粘贴输入不被改写；常见密码被拒绝；同一密码产生不同盐值哈希；正确/错误密码验证符合预期；明文和 hash 不写日志；算法、基准、rehash 和未来策略变更行为有记录。

#### B-05 建立最小 Access JWT 会话边界 — `TODO`

- 前置：D-03、D-09、D-14、D-15、D-16、B-01
- 动作：建立 TokenIssuer、JWT Guard、Cookie Adapter 和不安全请求来源 Guard；实现第 6 节精确 JWT/Cookie 配置、JSON-only/Body Limit、Origin/Referer、Fetch Metadata 纵深防御、no-store Header 和密钥/轮换配置边界。
- 产出：注册与登录可复用的 Access JWT 签发/验证能力。
- 验收：只接受预期算法/Claims；生产和本地 Profile 的 Cookie 设置/删除属性一致；密钥缺失或过弱时启动失败；不受信/缺失来源、不支持 Content-Type 或过大 Body 安全失败；认证响应 no-store；Token 不进入响应体、Web Storage、缓存或日志。

#### B-06 实现注册与自动登录 API — `TODO`

- 前置：D-05、B-03、B-04、B-05、B-09
- 动作：创建 DTO、全局输入校验、规范邮箱、密码策略检查、密码哈希和 User 创建；映射校验/Blocklist/重复错误；成功后复用 TokenIssuer，并返回冻结的安全 User + `messageCode` 契约。
- 产出：`POST /api/v1/auth/sign-up`。
- 验收：成功 `201` 并建立真实登录态；空值/格式/长度/缺失类别/不允许字符/常见或已泄露密码/未知字段返回安全、可定位的 `400`；重复邮箱为 `409`；响应和日志无 hash/明文/Token；并发重复注册只成功一次。

#### B-07 实现登录 API — `TODO`

- 前置：D-04、B-03、B-04、B-05、B-09
- 动作：校验传输结构和 1,024-byte 密码传输上限；规范邮箱；对已有 Hash 验证原样密码且不执行创建规则；未知账户对固定 dummy Argon2id Hash 验证一次；两条路径对外等价；成功设置 Access Cookie。
- 产出：`POST /api/v1/auth/login`。
- 验收：已有凭据在未来创建策略变化后仍可登录；未知邮箱和错误密码执行可比验证路径并返回结构相同的 `401 INVALID_CREDENTIALS`；测试不要求精确耗时相等；缺失字段/传输超限返回 `400`；无敏感字段。

#### B-08 实现当前用户、退出与授权保护 — `TODO`

- 前置：B-03、B-05、B-09
- 动作：实现 `/auth/me`、幂等退出、精确 Cookie 删除、JWT Guard 和 no-store 私有响应；建立未来受保护业务 Controller 的统一授权入口。
- 产出：`GET /api/v1/auth/me`、`POST /api/v1/auth/logout` 和可复用 Guard。
- 验收：有效 Token 返回当前安全 User；缺失/无效/过期 Token 返回 `401`；退出正确清 Cookie；NestJS 是最终授权边界；测试记录首版无主动撤销的限制。

#### B-09 统一异常与响应关联 — `TODO`

- 前置：F-03；必须先于 B-06、B-07 完成
- 动作：冻结稳定成功/错误码；定义数组形式 `fieldErrors`、安全英文回退消息、安全 User 序列化、全局异常 Filter、request ID、日志脱敏、JSON Content-Type/Body Size 处理和 no-store 策略；区分公开与内部错误。
- 产出：第 6 节错误契约的实现基础。
- 验收：预期错误稳定且可携带多个字段错误；Web 无需解析文案；密码输入不回显；未知错误不泄露内部信息；日志可按 request ID 关联；认证/私有缓存 Header 可测试。

#### B-10 API 自动化测试 — `TODO`

- 前置：B-06、B-07、B-08、B-09
- 动作：覆盖 DTO/规范化/密码策略/Argon2id/JWT 单元测试，Repository + PostgreSQL 集成测试，注册登录会话 API E2E。
- 产出：独立、可重复的 API 测试套件。
- 验收：覆盖成功、空值、非法/非规范邮箱、7/8/20/21 边界、各缺失类别、允许字符、可打印 ASCII 补集、空白/Unicode 拒绝、固定 Blocklist 行为、未知字段/Content-Type/过大 Body、重复/并发注册、Cookie 设置/删除属性、受信/不受信/缺失 Origin 和 Referer、no-store、JWT Claims/到期、自动登录/恢复/退出/无效 Token、未知用户 dummy-hash、错误密码、旧策略登录兼容、数据库角色边界和敏感字段/日志泄露；测试不依赖顺序。

### Phase 3 — Web 基础与 Navigation

#### W-01 集成 MUI v9 与 App Router SSR — `DONE`

- 前置：F-02
- 动作：加入精确的 `@mui/material@9.2.0`、`@mui/icons-material@9.2.0`、`@mui/material-nextjs@9.1.1` 与已批准 Emotion Pin；配置来自 `v16-appRouter` 的 `AppRouterCacheProvider`、ThemeProvider、字体与 CSS Variable Strategy。当 MUI `component` Prop 在 Next.js 16 Boundary 下接收 `next/link` 时，使用 Local Client Wrapper。
- 产出：稳定无闪烁的应用根 layout 和主题。
- 验收：开发/生产渲染无 hydration/style 警告；主题 token 生效；不混入第二套组件库。
- 完成证据：2026-08-05，精确 MUI/Emotion 与所需 Web Render-test Pin 已写入根 Lockfile。Root Layout 使用 `v16-appRouter` 的 `AppRouterCacheProvider`、唯一 Client `ThemeProvider`/`CssBaseline` Boundary、MUI CSS Variable，并通过 `next/font` 自托管 Roboto。最小 Server Component 页面消费 Theme Spacing 与 Palette Token。Frozen Install、Web Render Test、Root Lint/Typecheck/Test/Build、Production SSR Style Placement（`head` 中三个 Emotion Style Element，`body` 中为零）及两轮重复 Client-navigation Cycle 均通过，Style Count 保持稳定且 Browser Console 无相关错误。未加入 Custom Palette、第二套 UI System、Auth Form 或 Product Navigation。

#### W-02 创建路由组与应用壳 — `TODO`

- 前置：W-01
- 动作：建立 `(auth)` 与 `(app)` route groups；认证页不显示应用 Navigation，应用页共享 App Shell；建立稳定消息 key、默认英文 catalog 和 locale-aware formatter，用户可见英文不散落硬编码。
- 产出：Login、Sign Up、Dashboard、Flight Info、User 路由落点。
- 验收：URL 不包含 route group 名；刷新/直达各路由正常；404、loading/error 边界范围清晰；`html lang` 与默认 locale 一致；切换到其他 catalog 不需改组件结构。

#### W-03 实现可扩展 Navigation Bar — `TODO`

- 前置：D-10、W-02
- 动作：用 MUI AppBar/Toolbar/Tabs 或 Buttons 构建桌面导航，用 Drawer/Menu 处理窄屏；导航项来自 typed config，label 使用消息 key。
- 产出：Dashboard、Flight Info、User 三项导航。
- 验收：当前页明确高亮；鼠标/键盘/触屏可用；移动端不溢出；语义是链接、刷新后路由正确；未来可附加权限和 feature flag。

#### W-04 建立表单校验与 API 访问边界 — `TODO`

- 前置：D-08、D-16、W-01、B-09，以及已批准的第 6 节契约
- 动作：选定表单/Schema 方案；集中浏览器相对 `/api/v1`、仅服务端内部 API Origin、超时、Credentials 和基于 Code 的错误映射；通过结构化约束镜像 `PasswordPolicy` 意图；保留密码粘贴和自动填充。
- 产出：Auth 表单基础和 typed API adapter。
- 验收：组件不拼接 URL 或解析 API 文案；内部 Origin 不进入客户端 Bundle；客户端与服务端意图一致但服务端仍为权威；清单覆盖长度/大小写/数字/`$#@%`；网络、超时、解析和多个服务端字段码分别处理；文案来自 Catalog。

#### W-05 会话恢复、退出与受保护路由 — `TODO`

- 前置：D-03、D-09、D-16、B-08、W-02
- 动作：在服务端 Layout 保护 `(app)`；通过仅服务端内部 API Origin 调用同源 `/auth/me`，转发入站 Cookie 并显式 no-store；实现退出并清洗相对返回路径；NestJS Guard 保持最终权威。
- 产出：认证表单可使用的真实 App Shell 访问控制。
- 验收：未登录用户不能访问私有页面；`401` 跳转 Login，而 API 故障显示可恢复错误；过期/无效凭据不循环；私有内容不闪现或进入共享缓存；拒绝开放重定向；浏览器不可读 Token；退出清除完全一致的 Cookie 属性和客户端 User 状态。

#### W-06 实现 Sign Up 页面与自动登录 — `TODO`

- 前置：D-05、W-04、W-05、B-06
- 动作：构建 email/password 表单、label、password visibility、密码规则清单、loading、禁用重复提交、字段错误、表单级 Alert 和真实成功反馈。
- 产出：可用的 `/sign-up`。
- 验收：空值、非法邮箱及每一项密码规则都获得即时、可访问反馈；常见/已泄露密码和 `409` 服务端错误清晰；API 成功设置 Cookie 后自动进入 Dashboard；键盘提交、粘贴、密码管理器、焦点和错误播报可用；不记录密码或读取 Token。

#### W-07 实现 Login 页面 — `TODO`

- 前置：D-04、W-04、W-05、B-07
- 动作：构建 email/password 表单及完整请求状态；映射 `INVALID_CREDENTIALS` 为统一提示；登录不执行注册密码组合规则。
- 产出：可用的 `/login`。
- 验收：空值/邮箱格式错误就近显示；未知邮箱和密码错误显示同一外部提示；后续策略演进后仍可提交旧密码；提交中不重复请求；成功后进入 Dashboard；密码和 Token 不进入 URL、日志或前端持久化状态。

#### W-08 Web 组件与可访问性测试 — `TODO`

- 前置：W-03、W-06、W-07
- 动作：测试表单状态、密码规则清单、API 错误映射、Navigation 当前态/移动态、消息 key 完整性，并执行自动可访问性检查和键盘手测。
- 产出：Web 测试套件与手测记录。
- 验收：关键交互不只由实现细节断言；无严重可访问性违规；布局覆盖窄屏和桌面宽度。

### Phase 4 — 端到端集成与交付

#### I-01 联调注册链路 — `TODO`

- 前置：B-06、W-06
- 动作：真实 Web → Gateway `/api/v1/*` → API → PostgreSQL 联调；检查 Proxy Trust、Origin/Referer、Content-Type/Body Limit、Cookie/缓存 Header、环境配置、错误码、规范化和密码边界。
- 验收：注册成功进入 Dashboard；密码规则/Blocklist、重复邮箱、来源失败和 API 故障符合契约；Gateway 不缓存私有/`Set-Cookie` 响应；数据库无明文密码；Web 不可读取 JWT。

#### I-02 联调登录链路 — `TODO`

- 前置：B-07、W-07、W-05
- 动作：联调真实凭据成功/失败、Cookie 设置/删除一致性、跳转/会话/缓存、未知用户 dummy-hash，以及创建策略变化后的旧密码登录。
- 验收：成功进入 Dashboard；两类错误凭据外部一致；刷新恢复 no-store 会话；过期后无循环地回 Login；API 故障不当作 `401`；返回 URL 保持同源；已有密码不被创建规则拒绝。

#### E2E-01 浏览器主路径测试 — `TODO`

- 前置：I-01、I-02、W-03
- 动作：自动化“注册 → 自动进入 Dashboard → 三项 Navigation → 刷新恢复 → 退出 → 重新登录”主路径，并覆盖重复注册、错误凭据和未认证访问。
- 验收：使用隔离测试数据；可在 CI 重复运行；失败保留安全的截图/trace 且不泄露密码。

#### Q-01 全量质量与安全检查 — `TODO`

- 前置：F-01 至 F-08、B-01 至 B-10、W-01 至 W-08、I-01、I-02、E2E-01
- 动作：运行 Format、lint、typecheck、unit/integration/E2E、production build；检查依赖、Action SHA Pin、Workflow Permission/Event/Cache Trust、Required-check 行为、Repository Rule、Ownership、Proxy/CORS/Origin、Cookie/缓存、数据库权限、敏感日志、响应字段、环境文件、密码数据集/策略和英文 Catalog 完整性。
- 验收：本地与 GitHub 门禁全部通过；Required Check 不会因 Path Skip 意外保持 Pending；无跳过测试、可变 Workflow Dependency、硬编码密钥或未解释 TODO；可用的 Dependency/CodeQL/Secret Check 无未解决高危问题；风险有 Owner；结果只授权本地交接，不授权公开发布。

#### H-01 文档与交接 — `TODO`

- 前置：Q-01
- 动作：把实际版本、目录、命令、环境变量、迁移、API 契约和测试方式同步到英文权威 README/AGENTS 等文档；同步所有已有 `_ZH.md` 跟随版并更新计划状态。
- 验收：新开发者仅凭英文文档能启动和验证；中文跟随版的任务/决策 ID、依赖与状态一致；链接和英文主语言检查通过；文档与运行时一致；公开发布门仍明确关闭。

### Post-MVP — 已登记的递进任务（非首个切片范围）

以下任务只有在首个纵向切片验收后才启动；每项都应独立 Review、迁移、测试和发布，不能因为列在这里就视为已授权实施。

#### R-01 建立 Swagger/OpenAPI 契约和生成客户端 — `TODO（后续）`

- 前置：H-01
- 动作：为现有 REST API 补全 schema、cookie auth、错误码和示例；在 CI 生成 `packages/api-client` 并检查契约漂移。
- 验收：Web 不再手写重复响应类型；生成结果可复现；breaking change 有明确版本与迁移说明。

#### R-02 增加公开环境认证安全控制 — `TODO（后续）`

- 前置：H-01；建议先完成 R-01
- 动作：为认证及未来邮件接口加入 Redis 分布式限流、隐私安全审计事件、安全 Header、Proxy Trust 校验、滥用阈值、运维 Override/Runbook，以及 Redis 故障时明确的 fail-open/fail-closed 行为。
- 验收：限流跨 API Replica 生效，不能伪造 Forwarded Header 绕过；审计不含凭据/Token；Header 和故障行为通过集成测试；任何公开或共享环境发布前必须完成。

#### R-03 增加 Refresh Token 轮换与服务端撤销 — `TODO（后续）`

- 前置：H-01，且 Session/Device 语义已批准；建议先完成 R-01、R-02
- 动作：设计短期 Access + 轮换 Refresh Token、服务端 Hash 记录、重放检测、Token Family 撤销、Redis/数据库职责、密钥轮换、设备/Session 边界和故障行为。
- 验收：退出和安全事件可撤销 Session；旧 Refresh Token 重放会撤销 Family；Cookie/CSRF 规则明确；TTL、并发、轮换和降级测试通过。

#### R-04 增加邮件基础与邮箱验证 — `TODO（后续）`

- 前置：R-01、R-02，且 Mail Provider/本地捕获、发件域、Bounce 与模板方案已批准
- 动作：确认未验证用户权限；增加 `email_verified_at`、随机一次性 Token Hash、TTL、重发节流、验证/重发 API、模板、投递可观测性和审计。
- 验收：Token 单次使用且不可从存储还原；过期/重放/伪造安全失败；响应不泄露账户存在性；投递失败可操作；注册至验证自动化通过。

#### R-05 增加忘记/重置密码 — `TODO（后续）`

- 前置：R-02、R-03 和 R-04 邮件边界
- 动作：实现统一请求响应、Hash 存储的一次性短 TTL Reset Token、安全密码替换、旧 Session 撤销、通知邮件、限流和审计。
- 验收：未知/已有邮箱外部响应一致；Token 不入日志/不可重用；新密码遵守届时策略；旧密码/Session 失效；投递、限流和审计覆盖完整。

#### R-06 建立账户状态生命周期 — `TODO（后续）`

- 前置：业务语义和运维流程已批准
- 动作：判断 `active`、`suspended`、`deactivated`、`deleted` 是否真实需要；定义转换、登录/保留影响、恢复、迁移、领域服务、Guard 与审计。
- 验收：无模糊自由字符串；每个转换有授权、审计和测试；默认/回填与修复路径明确。

#### R-07 建立 RBAC/授权模型 — `TODO（后续）`

- 前置：至少一个受限操作和 Role/Permission 用例已批准；仅当用例依赖账户状态时才前置 R-06
- 动作：从权限矩阵推导 Role/Permission/Assignment；实现 deny-by-default NestJS 授权、管理边界和 Web 导航过滤。
- 验收：隐藏导航不被当作安全；API 独立拒绝提权；角色变更可审计；矩阵、迁移和测试一致。

#### R-08 增加简体中文与语言切换 — `TODO（后续）`

- 前置：W-02 消息边界稳定
- 动作：基于 SEO 与偏好决定 Locale URL/持久化；增加 `zh-CN` Catalog、切换器、Fallback、日期/货币格式和翻译 QA。
- 验收：英文/简中 Catalog 完整；缺失/多余 Key 导致 CI 失败；偏好刷新后保留；窄屏能容纳更长文案。

#### R-09 容器化应用并建立 GitHub Delivery/运维就绪基线 — `TODO（后续）`

- 前置：H-01；部署目标、Registry、GitHub Environment Ownership、Domain/TLS 拓扑和 RPO/RTO/SLO 目标均已批准
- 动作：为 Web/API Runtime 分别在选型前 Benchmark 固定 LTS 的 Debian Slim 与 Alpine 候选：验证 `glibc`/`musl`、Argon2id 和其他 Native Addon、Next.js Runtime Artifact、amd64/arm64、安全更新时效、Cold/Warm Build Time、Compressed Size、Startup、Scan Result 和 Smoke Behavior。通过较小 `.dockerignore` Context、稳定 Layer、Multi-stage Output、Frozen Install、过滤后的 Monorepo Artifact、`pnpm fetch` 或 BuildKit Cache Mount 和信任隔离 Cache 优化；Final Stage 不保留 Build Toolchain。随后从可信 `main`/Release Commit 由 GitHub Actions 对每个 Non-root Image 构建一次、扫描、生成 SBOM 与 Artifact Attestation/Provenance，并发布不可变 Digest。通过 OIDC 而非长期 Cloud Key，把完全相同的 Digest 推进受保护的 `staging` 和 `production` Environments；自动化 Staging 与 Smoke Check，生产要求合格 Reviewer 且禁用 Self-review，限制可部署 Ref，按 Environment 串行化部署，并让迁移保持独立最小权限 Job。同时定义 Liveness/Readiness、优雅终止、只读文件系统、Secret 注入、Proxy Trust、发布/回滚、PostgreSQL 备份恢复演练、日志保留/脱敏、SLO、告警和 On-call Runbook。
- 验收：Image Decision Record 证明兼容性和实测收益，不因体积单独选择 Alpine；可复现且固定 Digest 的镜像不含开发依赖、Package-manager Cache、Build Toolchain 或 Secret；Pull Request 代码不能访问部署凭据或触发生产；可信 Release 带可验证 Digest/SBOM/Provenance；Staging/Production 使用同一已批准 Digest；支持架构上的 Smoke/Shutdown 测试通过；Web/API 可独立发布并回滚至先前已验证 Digest；生产 Approval/Concurrency 生效；OIDC Trust 限定到 Branch/Environment；迁移责任明确；恢复演练达到已批准 RPO/RTO；Dashboard/告警可操作；生产数据不进应用容器。

#### R-10 完成隐私、数据治理与威胁建模 — `TODO（后续）`

- 前置：H-01；每个新外部 Provider 或敏感数据类别都需重审
- 动作：清点个人/旅行/支付邻接数据，定义目的/同意、保留/删除/导出、区域与 Vendor 限制、日志/Trace 脱敏、Prompt Injection/Tool 授权威胁、Incident 处理和模型 Provider 数据使用配置。
- 验收：数据流和信任边界已 Review；每个敏感字段都有 Owner、目的、保留和删除路径；Provider 合同/配置获批；滥用场景有测试或 Runbook。

#### R-11 设计并验证向量检索 — `TODO（后续）`

- 前置：R-10，且检索用例、Corpus、Embedding 模型/版本、隐私分类和评测指标已批准
- 动作：在 `PLANS.md` 中记录并批准 Vector Design，覆盖生产扩展高权限 Provisioning、Schema Owner、Chunking、Metadata/Tenant 隔离、维度、距离函数、索引、过滤、重新 Embedding/版本化、删除和离线检索评测。
- 验收：获批 Design 与 Evaluation 前不创建向量 Schema；代表性 Recall/Latency/Cost 达标；Tenant/隐私、删除/重新 Embedding 经过测试；Schema/索引通过 Migration 变更。

#### R-12 实现首个旅行 Agent 纵向切片 — `TODO（后续）`

- 前置：R-10，且旅行用例、模型 Provider、工具契约、流式安全、人工批准边界和评测指标已批准；仅在需要检索时前置 R-11
- 动作：创建真实 NestJS `AgentModule`；增加显式 LangGraph State/图/工具 Port、已认证流式契约、安全、取消、超时、有界重试、幂等、成本限制和 Web 消费。
- 验收：浏览器无模型密钥/工具权；工具有严格 Schema 与授权；确定性图、录制 Provider Contract、Prompt Injection/副作用测试和独立评测通过；拆服务触发条件有记录。

#### R-13 复审并在有依据时放宽密码策略 — `TODO（后续）`

- 前置：首个切片使用/支持证据，或新合规/MFA 要求
- 动作：在不记录密码下复审放弃率和支持数据；考虑更长上限、更广字符、Passphrase、移除组合规则，同时保留 Blocklist/Argon2id；同步英文契约和 `_ZH`。
- 验收：只有一个获批策略；注册/重置/改密测试与文案一致；登录兼容测试证明已有用户有效；仅校验变化不引入 User 表迁移。

#### R-14 Review 并授权公开发布 — `BLOCKED（后续）`

- 前置：Q-01、H-01、R-02、R-09、R-10，以及目标 Release 包含的所有功能任务
- 动作：执行发布威胁模型、外部 Surface 扫描、生产配置/Secret/备份恢复 Review、负载与滥用测试、可访问性检查、可观测性演练、回滚演练和 Owner Sign-off；等待用户明确公开发布授权。
- 验收：发布条件均有证据与 Owner；无开放高危问题；回滚/Incident 路径已演练；用户明确批准公开暴露。本地切片交接不能满足本任务。

## 9. 推荐执行顺序与并行点

```text
P-01 → P-02 → P-03 → F-01
F-01 → F-02 ───────────────────────→ W-01 → W-02 → W-03
     └→ F-03 → F-05 → B-01 ───────┬→ B-02 → B-03
           │                        └→ B-05
           └→ B-09
F-02 + F-03 → F-04 ───────────────→ F-07
F-04 + F-05 ──────────────────────→ F-06
F-06 + F-07 ──────────────────────→ F-08

B-03 + B-04 + B-05 + B-09 ───────→ B-06 与 B-07
B-03 + B-05 + B-09 ──────────────→ B-08
W-01 + B-09 ─────────────────────→ W-04
W-02 + B-08 ─────────────────────→ W-05
B-06 + W-04 + W-05 ──────────────→ W-06 → I-01
B-07 + W-04 + W-05 ──────────────→ W-07 → I-02
W-03 + W-06 + W-07 ──────────────→ W-08
W-03 + I-01 + I-02 ──────────────→ E2E-01
F-01..F-08 + B-01..B-10 + W-01..W-08 + I/E2E → Q-01 → H-01
```

安全并行方式：Monorepo 根完成后，Web 基础和 API/数据库基础可并行；API 契约冻结后再实现对应前端请求映射。迁移、共享配置和根文件由单一负责人协调，避免并发冲突。

## 10. 建议拆分为可 Review 的变更集

必须保持以下 Review 与回滚边界；完整清单不是单日承诺：

1. **Foundation**：pnpm workspace、Web/API 脚手架、共享配置、本地 PostgreSQL、快速本地 Hook、GitHub PR CI 和仓库治理/安全自动化。
2. **Backend auth**：users migration、Users/Auth 模块、Access JWT/Cookie、`me`/logout、错误契约、API 测试。
3. **Web shell**：MUI SSR/theme、route groups、Navigation、路由落点。
4. **Web auth**：表单 Schema、Sign Up/Login、API adapter、组件测试。
5. **Integration**：会话恢复与受保护路由、E2E、文档与质量门。

每个变更集都应可构建、可测试，不把数据库迁移与不相关 UI 修改混在一起。

## 11. 验收矩阵

| 场景                      | Web 预期                           | API 预期                                               | 数据库预期                  |
| ------------------------- | ---------------------------------- | ------------------------------------------------------ | --------------------------- |
| 注册空值                  | 字段错误，不提交                   | 若绕过 Web 则 `400`                                    | 无写入                      |
| 注册非法邮箱              | 字段错误                           | `400 VALIDATION_ERROR`                                 | 无写入                      |
| 直接写入非规范邮箱        | 不适用                             | 应用始终先规范化                                       | 数据库 CHECK 拒绝绕过写入   |
| 密码长度为 7/21           | 清单/字段错误                      | `400 VALIDATION_ERROR`                                 | 无写入                      |
| 缺失大写/小写/数字/`$#@%` | 对应清单项未满足                   | `400 VALIDATION_ERROR`，稳定字段错误码                 | 无写入                      |
| 包含不允许的密码字符      | 清晰显示允许字符                   | `400 VALIDATION_ERROR`                                 | 无写入                      |
| 注册常见/已泄露密码       | 显示可操作的通用密码提示           | `400 VALIDATION_ERROR`，不回显密码                     | 无写入                      |
| 注册合法凭据              | loading 后自动进入 Dashboard       | `201`，设置 HttpOnly Cookie，返回安全 User             | 一行 User，只有 hash        |
| 重复注册                  | 表单级明确提示                     | `409 EMAIL_ALREADY_EXISTS`                             | 仍只有一行                  |
| 登录空值/非法邮箱         | 字段错误                           | `400 VALIDATION_ERROR`                                 | 无变化                      |
| 邮箱不存在                | 通用凭据错误                       | `401 INVALID_CREDENTIALS`                              | 无变化                      |
| 密码错误                  | 与邮箱不存在相同提示               | 与邮箱不存在相同外部结构                               | 无变化                      |
| 登录密码传输超限          | 字段/表单错误                      | `400 VALIDATION_ERROR`，不执行 Hash                    | 无变化                      |
| 策略变化后的已有密码      | 允许提交                           | 只验证精确哈希，不执行创建密码规则                     | 无变化                      |
| 会话恢复                  | 刷新后保持登录                     | `/auth/me` 返回安全 User                               | 无不必要写入                |
| 退出                      | 返回 Login，清理用户状态           | `204` 并清 Cookie                                      | 首版无服务端 Token 撤销写入 |
| 登录成功                  | 进入 Dashboard，Token 对 JS 不可见 | `200`，设置 HttpOnly Cookie 且无敏感字段               | 无不必要写入                |
| 未认证访问                | 返回 Login，不闪现私有内容         | API Guard 返回 `401`                                   | 无变化                      |
| 不安全请求的来源缺失/非法 | 显示可操作错误，不产生重定向循环   | 在写入前拒绝                                           | 无变化                      |
| 认证/私有响应缓存         | 私有状态不来自共享缓存             | `Cache-Control: no-store`；Gateway 不缓存 `Set-Cookie` | 无变化                      |
| 导航                      | 当前项高亮、可键盘操作             | 不需要 API                                             | 无变化                      |
| API/网络故障              | 可重试的通用错误，表单恢复         | request ID 可追踪                                      | 无部分注册写入              |

## 12. 风险与控制

| 风险                                                         | 影响                                                                     | 控制                                                                                                                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 短期 Access JWT 无主动撤销                                   | Token 泄露后在到期前仍有效                                               | 15 分钟 TTL、Secure/HttpOnly Cookie；R-03 增加 Refresh/撤销                                                                                                   |
| 分开提示未知邮箱/错误密码                                    | 账户枚举                                                                 | 默认统一 `INVALID_CREDENTIALS`                                                                                                                                |
| 登录昂贵计算路径不同                                         | 计时信息可能辅助账户枚举                                                 | 未知账户执行固定 dummy Argon2id；测试路径而不比较脆弱的精确耗时                                                                                               |
| 已选择的 8–20 组合/允许集合规则                              | 拒绝许多密码管理器结果和长 passphrase，并可能诱导可预测的合规模式        | 一次性清晰清单、允许粘贴/自动填充、固定本地 Blocklist、集中策略和明确 R-13 复审路径                                                                           |
| 登录重新执行创建密码规则                                     | 策略变化后已有用户被锁定                                                 | 登录只做精确哈希验证，并以回归测试固定兼容性                                                                                                                  |
| 客户端校验被当作安全边界                                     | 非法数据写入                                                             | 服务端 DTO + 全局 ValidationPipe + DB 约束                                                                                                                    |
| ORM 自动同步                                                 | 生产 Schema 漂移/数据损失                                                | 仅 migration，生产关闭 synchronize                                                                                                                            |
| 先查询再创建用户                                             | 并发重复账户                                                             | 数据库唯一约束，捕获冲突                                                                                                                                      |
| JWT 放入 Web Storage                                         | XSS 后 Token 易被窃取                                                    | 只使用 host-only HttpOnly Cookie；前端代码不接触 Token                                                                                                        |
| Cookie 自动随请求发送                                        | CSRF/Login CSRF                                                          | `__Host-`、SameSite=Lax、JSON-only、精确 Origin/Referer；受保护业务写接口或拓扑扩大前加入 Token                                                               |
| 认证/私有响应进入共享缓存                                    | 跨用户数据或 Cookie 泄露                                                 | 端到端 `no-store`；Gateway 测试禁止缓存私有/`Set-Cookie` 响应                                                                                                 |
| MUI + App Router SSR 配置错误                                | 闪烁/水合错误                                                            | 使用官方 cache provider 并做 production build 验证                                                                                                            |
| 所有服务都在容器中开发导致反馈慢，或完全不容器化导致环境漂移 | 调试效率低或团队环境不一致                                               | 宿主机运行 Web/API；固定版本容器运行有状态基础设施；CI 使用临时隔离服务                                                                                       |
| 把本地 Hook 当成合并/安全强制                                | `--no-verify` 或 Hook 未安装即可绕过                                     | Hook 保持快速和辅助性质；GitHub Required Check 与 Pull Request Title 校验重复权威规则                                                                         |
| 把 Bootstrap Approval 约束配置成宽泛 Ruleset Bypass          | Contributor 可以跳过原本用于保护 `main` 的 CI                            | Approval Requirement 必须可满足；Pull Request 和 Required Check 仍强制；存在合格 Reviewer 时加入一个非作者 Approval                                           |
| 把 AI Review 当成可问责或确定性的 Approver                   | 错误建议、漏检、Vendor Outage 或 Instruction Manipulation 带来虚假安全感 | AI Review 只作为辅助 Comment，永不计作 Human Approval；人工检查 Instruction Change；确定性 CI 与 Self-review 保持权威                                         |
| 辅助 AI Review 不可用或产出价值不足                          | Review 可能意外停止，或只增加噪音而未改善风险发现                        | 仅在 CI 全绿/Self-review 后手动请求；评估三个风险 PR；测量有效发现、False Positive、漏检和 Latency；跳过低价值类别和 Every-push Re-review；以确定性 CI 为权威 |
| 不可信 Pull Request 接触 Secret 或高权限 Trigger             | 凭据被窃或仓库被攻破                                                     | 只读权限、不可信 Job 不持有 Secret、不通过 `pull_request_target` 执行不可信代码，并隔离可信/不可信 Cache                                                      |
| GitHub Action 使用可变 Tag 或过大权限                        | 供应链替换或事故影响扩大                                                 | Action 固定完整 SHA、Dependabot 提交经 Review 的更新、Workflow 默认只读、Job 级最小权限                                                                       |
| Path Filter 或 Cache 掩盖 Required Failure                   | Pull Request 未运行应有门禁即合并                                        | 稳定聚合 `ci-required` 始终上报；Cache 不替代 Frozen-lockfile/生成物检查；可信与不可信 Cache 分离                                                             |
| 每个 Environment 重建 Release 或使用长期 Cloud Key           | Staging/Production 不一致，泄漏凭据长期有效                              | 构建并 Attest 一次、推进同一不可变 Digest、使用受保护 Environment 与限定 OIDC，并按已验证 Digest 回滚                                                         |
| GitHub Plan/可见性不支持某安全能力                           | 文档中的门禁实际不存在                                                   | F-08 执行能力检查，记录等效控制、Owner 或显式接受的风险                                                                                                       |
| 仅因 Image 较小就选择 Alpine 或 Tiny Runner                  | Native Addon 不兼容、缺少工具、Build 更慢、安全更新延迟或 CI 资源不足    | 常规 CI 使用有明确版本的标准 Ubuntu Runner；从兼容性、架构、Cold/Warm Time、Size、Startup、Scan 和更新时效 Benchmark Debian Slim/Alpine                       |
| 过早实现 Agent/pgvector                                      | 首个切片范围膨胀、错误抽象                                               | 只保留模块边界，等待真实检索需求                                                                                                                              |
| 混淆 pgvector 安装与启用                                     | Runtime 越权或迁移失败                                                   | Provisioner 启用/验证；Migrator/Runtime 分权；R-11 负责向量设计                                                                                               |
| 一次追求全部生产能力                                         | Review 和测试被压缩                                                      | 分变更集交付纵向切片，硬化项显式进入后续计划                                                                                                                  |
| 把本地完成误当作上线就绪                                     | 公开系统缺少滥用、运维或隐私控制                                         | D-19 与阻塞的 R-14 要求 R-02/R-09/R-10 证据及明确授权                                                                                                         |
| 中英文文档漂移                                               | 产生互相冲突的工程指令                                                   | 英文为权威；同步 `_ZH` 是完成定义的一部分                                                                                                                     |

## 13. 已确认结论与下一道门

D-01 至 D-13 已确认：Access JWT + 同源 HttpOnly Cookie、注册自动登录、通用凭据错误、TypeORM、pnpm workspace + Turborepo、公开同源/服务独立部署、首个真实用例才创建可拆分的后端 TypeScript LangGraph、UUID + `users` + 规范唯一邮箱、首版英文/i18n-ready/后续简中、首迁移不加入验证/状态/角色、宿主机应用 + 容器化基础设施、首版 8–20 组合密码策略，以及英文权威/`_ZH` 跟随文档体系。

D-14 至 D-19 是已接受的审计建议：精确 JWT/Cookie 配置、Origin/Referer CSRF 基线、端到端 no-store、数据库强制规范 ASCII 邮箱、数据库权限/pgvector Provisioning 分权，以及独立阻塞的公开发布门。

D-20 至 D-24 已确认：GitHub 作为源码/自动化平台；由 `@Donny-Guo` 所有的 Public 仓库；绝不移除 Required CI 或允许通用 Bypass 的 Bootstrap Review Mode；快速 Husky/lint-staged/commitlint 本地检查与权威 CI；基于可信 Build-once Artifact、不可变 Digest Promotion、受保护 Environment、OIDC、Approval 和 Rollback 的后续 GitHub CD 模式；MIT License；以及手动请求、Provider-neutral 的辅助 AI Review Evaluation。

D-25 已确认：现役 Framework/ORM Major Line 为 Next.js 16、MUI v9 与 TypeORM 1.1；P-03 与 `docs/toolchain.md` 记录精确且经 Review 的 Stable Pin 与 Owner-task Installation Boundary。

没有剩余的基础产品、Review 或首切片实施门。Owner 已于 2026-08-02 关闭 `P-02`，Version-policy Evidence 在本地完成了 `P-03`，Monorepo-root Evidence 也在本地完成了 `F-01`。`F-02` 已于 2026-08-03 在本地完成并基于 Next.js 16 重新验证；`F-03` 也已于 2026-08-03 通过经验证的 NestJS Lifecycle 与 Liveness Boundary 在本地完成。`F-04` 已于 2026-08-05 在本地完成，共享 TypeScript/ESLint Config、统一根 Prettier Policy、标准化 Check、Negative-rule Probe，以及 Cache/Ignore/Package-boundary Evidence 均已验证。`ISSUE-007`、`ISSUE-009` 与 `ISSUE-010` 是剩余依赖已满足的工作，权威 Issue 顺序仍是安全默认值。独立的公开发布门仍然 Blocked，首切片授权不延伸至 Post-MVP 或生产工作。

对 D-08 的记录假设：`$#@%` 是首版完整允许的特殊字符集合，而不仅是示例。如果用户原意是示例，修改计划很小且不影响架构。

## 14. Review 闭环与实施门

计划 Review 已完成：

- 首个切片必须交付/明确不做边界、API 语义和 User 表已接受。
- D-08 及登录兼容行为已接受。
- D-14 至 D-19 的安全、数据和发布边界已接受。
- D-20 至 D-24 的 GitHub Identity/治理、Hook/CI 权威、受控 CD 边界、MIT License 与辅助 AI Review Policy 已接受。
- D-25 的 Next.js 16/MUI v9/TypeORM 1.1 Major-line Revision 及其 Owner-task Boundary 已接受。
- 英文权威和 `_ZH` 跟随规则已接受。

Owner 已于 2026-08-02 发出独立的实施开始指令。该指令只授权计划内的首个本地认证切片及其列明的仓库治理工作，不授权 Post-MVP 范围、生产部署、启用 CD、Cloud Resource、公开暴露、仓库 Visibility 变更、远程创建 `ISSUE-028` 及之后的 Issue，或远程更新/关闭任何 GitHub Issue。

## 15. 实施阶段待提供信息

以下信息不会重新打开已接受的架构决策；当前处理状态如下：

1. **F-08 Repository Profile — Policy 已解决，Artifact 对齐待完成：** Public 仓库由 `@Donny-Guo` 所有，MIT 是已确认的 Open-source License 选择。当前已跟踪的根 `LICENSE` 使用 `Copyright (c) 2026 Dongping Guo (Donny)`，与 D-23 已确认的 `Copyright (c) 2026 Donny-Guo` Notice 不一致。F-08 必须通过可审核的治理变更对齐并验证该 Artifact，并将初始敏感路径 Ownership 分配给 `@Donny-Guo`；不得在 P-02 Gate 中静默重写它。
2. **F-08 Review Policy — 已解决：** Bootstrap Approval Requirement 必须可满足，且不允许 Owner 通用绕过 Required CI；作者完成 Self-review，并只针对选定的风险 Pull Request 在 CI 全绿后手动请求 Non-required 辅助 AI Review。用三个有代表性的 Pull Request 进行评估，不启用重叠 Reviewer，并在调整 Policy 前记录有效发现、False Positive、漏检和 Latency。Provider 与 Account Detail 不进入 Public Repository。存在合格 Reviewer 时，至少要求一个非作者 Owned-path Approval。
3. **R-09 Delivery Target — 用户决定后置：** Hosting Platform、Region、Image Registry、`staging`/`production` Domain 和 OIDC Provider 后续决定。Image Evaluation Method 已明确，但尚未选择 Base Image 或 Platform。
4. **R-09/R-14 Operations — 用户决定后置：** Production Approver、RPO、RTO、SLO、Alerting/On-call、Data Residency 和 Rollback Target 后续决定。

第 3、4 项解决前，使用 GitHub-hosted Runner 并保持 CD 禁用；不得猜测 Cloud Credential 或 Production Ownership。
