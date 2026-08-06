# 认证 API 与本地 Runbook（中文）

本文件是权威英文 [authentication.md](./authentication.md) 的简体中文跟随版。若两者冲突，以英文版为准并修正本文件。

状态：ISSUE-009 已合并，GitHub #9 已按 completed 关闭。ISSUE-010 Web Integration 已在本地实现并验证，但仍开放，等待正常 PR CI、Review、Merge 与远程关闭。本文只描述本地开发，不代表公开发布获准。

## 边界

NestJS 在 `/api/v1` 下拥有认证与 Persistence。PostgreSQL 通过 Docker Compose 运行，API 和 Migration CLI 在宿主机运行。Provisioner 创建 Role/Extension，Migrator 拥有获准 Application DDL，长期运行的 API 只以 `trip_runtime` 连接。

TypeORM 使用 ESM DataSource，并关闭 `synchronize`、`migrationsRun` 与 `installExtensions`。Migration 始终由显式命令或独立 Deployment Job 执行。

## 本地配置

三类配置有意分离：

| 文件                            | 进程                       | 内容                                                          |
| ------------------------------- | -------------------------- | ------------------------------------------------------------- |
| 根 `.env`                       | Docker Compose Bootstrap   | 数据库名、端口及 Provisioner/Migrator/Runtime Role Credential |
| `apps/api/.env.migration.local` | 显式 TypeORM Migration CLI | 仅 `NODE_ENV` 与 `trip_migrator` Database URL                 |
| `apps/api/.env.runtime.local`   | 长期 NestJS API            | 仅 Runtime Database/Auth/HTTP 设置与 `trip_runtime` URL       |

从对应 `.example` 创建每个被忽略的 Local File。绝不把 Provisioner Credential 放入 API 文件。当前本地 Bootstrap 要求 64 字符小写 Hex Role Password，因此这些 Password Byte 放入 URL 时无需额外编码。未来若 Password 包含 URL User-info 保留字符，只对 URL 中的 Password 部分做 Percent Encoding。

生成三个不同的本地数据库 Password：

```sh
openssl rand -hex 32
openssl rand -hex 32
openssl rand -hex 32
```

生成 Runtime JWT Secret 与固定的非用户 Dummy Argon2id Hash：

```sh
openssl rand -base64 32

pnpm --filter api exec node --input-type=module -e '
  import { randomBytes } from "node:crypto";
  import { argon2id, hash } from "argon2";
  console.log(await hash(randomBytes(32).toString("base64"), {
    type: argon2id, memoryCost: 19456, timeCost: 2,
    parallelism: 1, hashLength: 32
  }));
'
```

只把输出粘贴到被忽略的 Local File，然后限制权限：

```sh
chmod 600 \
  .env \
  apps/api/.env.runtime.local \
  apps/api/.env.migration.local
```

`AUTH_DUMMY_PASSWORD_HASH` 不是数据库 Password，也不关联真实 User；它让未知账户登录路径执行一次有界 Argon2id Verification。`AUTH_JWT_SECRET_BASE64` 解码后必须至少包含 32 个随机 Byte。

## 启动与 Migration

在仓库根运行：

```sh
docker compose --env-file .env -f infra/docker/compose.yaml \
  up --detach --wait postgres

pnpm --filter api migration:show
pnpm --filter api migration:run
pnpm --filter api migration:show
pnpm --filter api dev
```

Clean Database 上第一次 `migration:show` 显示 Pending，最后一次显示 Applied。Application Startup 从不执行 Migration。

- `GET /api/v1/health/live` 只检查 API Process。
- `GET /api/v1/health/ready` 通过 Runtime Connection 检查 PostgreSQL。

## 认证 Contract

所有 Auth/User Response 都使用 `Cache-Control: no-store`，公共 Response 不返回 JWT 或 `password_hash`。

| Method 与 Path              | Request                                   | Success                                                     |
| --------------------------- | ----------------------------------------- | ----------------------------------------------------------- |
| `POST /api/v1/auth/sign-up` | `{ "email": string, "password": string }` | `201`、安全 User、`AUTH_SIGN_UP_SUCCEEDED` 与 Access Cookie |
| `POST /api/v1/auth/login`   | `{ "email": string, "password": string }` | `200`、安全 User 与 Access Cookie                           |
| `GET /api/v1/auth/me`       | Access Cookie                             | `200`、安全 User                                            |
| `POST /api/v1/auth/logout`  | `{}`                                      | Idempotent `204` 与匹配的 Cookie 删除                       |

安全 User 只包含 `id`、`email`、`createdAt` 与 `updatedAt`。

创建 Email 会 Trim、Lowercase，限制为 ASCII 且最长 254 字符，并由 PostgreSQL Canonical Check 与 Unique Constraint 保护。创建 Password 必须为 8-20 个 ASCII 字符，只允许 `A-Z`、`a-z`、`0-9`、`$#@%`，四类至少各一个；绝不 Trim。该本地 MVP 明确不含 Compromised/Common-password Blocklist，也不执行远程密码查询。

Login 原样验证提交的 Password，不重新执行当前创建组合规则。未知 Email 与错误 Password 都返回 `401 INVALID_CREDENTIALS`；未知账户路径对固定 Dummy Hash 验证一次。

Access JWT 只允许 HS256，包含 `iss=trip-api`、`aud=trip-web`、User UUID `sub`、必需 `iat`/`exp`、15 分钟 TTL，以及最多 30 秒 Clock Tolerance。本地 HTTP 使用 `trip_access_dev`，生产使用 `__Host-trip_access`。两者均为 `HttpOnly`、`SameSite=Lax`、`Path=/`、`Max-Age=900`；只有生产 Cookie 使用 `Secure`。

Unsafe Method 要求 `Content-Type: application/json` 及精确配置的 `Origin`；仅当 `Origin` 缺失时可使用配置 Origin 的 `Referer`。缺失、`null`、多个或不可信 Provenance 会被拒绝。Fetch Metadata 只有在精确 Origin/Referer 检查通过后才允许 `same-origin` 或 `same-site`；拒绝 `cross-site`。JSON Body Limit 由 `API_JSON_BODY_LIMIT_BYTES` 配置，示例默认 16 KiB。

## 稳定 Error

公共 Error Shape：

```json
{
  "code": "VALIDATION_ERROR",
  "message": "One or more fields are invalid.",
  "fieldErrors": { "email": ["EMAIL_INVALID"] },
  "requestId": "<uuid>"
}
```

现役 Code：`VALIDATION_ERROR`（`400`）、`UNAUTHENTICATED`/`INVALID_CREDENTIALS`（`401`）、`UNTRUSTED_REQUEST`（`403`）、`EMAIL_ALREADY_EXISTS`（`409`）、`PAYLOAD_TOO_LARGE`（`413`）、`UNSUPPORTED_MEDIA_TYPE`（`415`）、`NOT_FOUND`（`404`）、`SERVICE_UNAVAILABLE`（`503`）与 `INTERNAL_ERROR`（`500`）。Error Log 只包含 Request Metadata 与 Category，不包含 Request Body、Cookie、Authorization Header、Exception Message 或 Database URL。

## 自动验证

标准 Root Wrapper 会在三个文件都不存在时自动生成 `apps/api/test/config/` 下的被忽略配置，使用相互独立的随机 Test-only Credential/Auth Value，并设为 `0600`。完整的既有配置会保留并修正权限；若只存在部分文件则拒绝覆盖。标准路径无需手动准备 Test Secret。

```sh
pnpm test:local
pnpm --filter web exec playwright install chromium # 仅首次本地 Browser Run
pnpm test:e2e
```

`test:local` 只使用固定 `trip-root-test` Compose Project 与 `127.0.0.1:55432`。它删除该精确 Test Project 的旧 Volume，启动 Clean Database，执行 Migration `show/run/show`，运行不使用 Cache 的 API/Web Test Graph，并在退出时删除 Test Container/Volume。`test:e2e` 使用独立的 `trip-auth-web-e2e` Project、相同 Test-only Database Port，以及隔离的 Web/API Port `43000`/`43001`；它还会让 Web 针对一个未使用的 Upstream 重新 Build，以验证 Outage Behavior。两个 Wrapper 都不会定位默认开发 Project 或 `3000`/`3001` 端口。

最近一次本地验证于 2026-08-06 完成：Root Formatting、Documentation Policy、Lint、Typecheck、Production Build、隔离 Database Test Graph 与 Browser E2E 均通过；10 个 API Unit Suite 共 48 个 Test、3 个 API Integration Suite 共 12 个 Test、8 个 Web Suite 共 73 个 Test，以及 6 条 Playwright Journey 全部通过。Clean Migration 从 Pending 变为 Applied，且 Migration Run 未尝试安装 Extension。这是本地 MVP 证据，不是公开暴露或生产部署许可。下方 Postman Smoke 仍是由用户手动执行的检查，本文不会把它伪造为自动化证据。

## Postman 手动 Smoke

创建只含 `apiBaseUrl=http://localhost:3001` 的 Postman Environment。API 与可信 Web Origin 应保持在同一个 `localhost` Site；若其中一个改成 `127.0.0.1`，Cookie Host 与 Fetch Metadata 关系也会改变。不要创建 Token Variable；让 Postman 在 Cookie Jar 中保存 HttpOnly Cookie。

按顺序运行：

1. `GET {{apiBaseUrl}}/api/v1/health/live` -> `200`。
2. `GET {{apiBaseUrl}}/api/v1/health/ready` -> `200`。
3. `POST {{apiBaseUrl}}/api/v1/auth/sign-up`，Header 为 `Content-Type: application/json`、`Origin: http://localhost:3000`、`Sec-Fetch-Site: same-site`，Body 为 `{"email":"postman@example.com","password":"TripDemo9@Qz"}` -> `201`。
4. 确认 Postman Cookie Manager 存在 `trip_access_dev`，但不要复制其值。`GET {{apiBaseUrl}}/api/v1/auth/me` -> `200` 与安全 User。
5. `POST {{apiBaseUrl}}/api/v1/auth/logout` 使用相同三个 Header 与 `{}` Body -> `204`；随后 `/auth/me` -> `401 UNAUTHENTICATED`。
6. `POST {{apiBaseUrl}}/api/v1/auth/login` 使用相同 Header 与原 Credential -> `200`；再次 `/auth/me` -> `200`。

聚焦失败检查：重复注册为 `409`；错误密码与未知 Email 均为相同 `401`；额外 `role` 字段为 `400`；移除 Origin/Referer 为 `403`；`text/plain` 为 `415`；超过 Body Limit 的 JSON 为 `413`。

完成后删除 Postman Cookie。绝不把 Cookie/JWT 值粘贴到 Screenshot、Ticket、Log 或文档。

## Migration Repair 与 Rollback

首个 Forward Migration 创建 `app.users`、Canonical-email Constraint 与仅 `SELECT`/`INSERT` 的 Runtime Grant。其 `down` 会删除表并具有破坏性，只能用于可丢弃的本地/Test Data。Shared/Production Repair 必须使用经 Review 的 Forward Migration 与另行批准的 Deployment Plan。Application Startup 与 Runtime Role 从不创建 Role、Schema 或 Extension。
