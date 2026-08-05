# 按实施顺序排列的 GitHub Issue 草案（中文）

本文件是权威英文 [`ISSUES.md`](./ISSUES.md) 的简体中文跟随翻译。若两者冲突，以英文版为准并修正本文件。

状态：**首切片已于 2026-08-02 授权实施；ISSUE-002 至 ISSUE-008 已在本地完成，当前依赖已满足的工作还包括 ISSUE-009 与 ISSUE-010**\
计划日期：2026-07-30  
范围来源：[`PLANS.md`](./PLANS.md)  
仓库 Owner：`@Donny-Guo`

## 1. 目的、权威性与使用方式

本清单把已批准计划转换为可直接用于实施的 GitHub Issue Body。下方 Registry 是草案已远程创建的证据；没有登记 URL 的条目仍只是本地草案。2026-07-30 的远程 Issue 授权不包含实施权限。Owner 已于 2026-08-02 另行授权计划内的首个本地认证切片。Post-MVP 工作、部署、公开暴露、仓库 Visibility 变更、远程创建 `ISSUE-028` 及之后的 Issue，以及远程更新/关闭任何 GitHub Issue 仍不在该授权范围内。

权威性与同步规则：

1. `AGENTS.md` 定义全仓工程规则。
2. `PLANS.md` 是决策、范围、任务状态与验收标准的权威来源。
3. 本文件定义从 `PLANS.md` 派生的有序 Issue 包装；可以增加更严格的顺序或证据要求，但不得放宽计划。
4. 每个 `ISSUE-nnn` 是稳定草案 ID，不是真实 GitHub Issue Number。明确授权并创建远程 Issue 后，应记录 URL，但保留稳定 ID。
5. `P-01` 已为 `DONE`，不事后伪造一个 Issue。Owner 已于 2026-08-02 明确满足 `P-02`，Version-policy Evidence 完成 `P-03`，Monorepo-root Evidence 完成 `F-01`。Web Scaffold 已完成 `F-02`，并于 2026-08-03 在 D-25 的 Next.js 16 Baseline 上重新验证；API Scaffold 于 2026-08-03 完成 `F-03`。Shared Engineering Configuration 于 2026-08-05 完成 `F-04`，Local PostgreSQL/pgvector Infrastructure 完成 `F-05`，MUI SSR/Theme Foundation 同日完成 `W-01`。因此 `ISSUE-001` 至 `ISSUE-008` 在本地为 `DONE`；`ISSUE-009` 与 `ISSUE-010` 仍属于依赖已满足的工作。
6. Issue 状态只能依据证据改变。关闭 GitHub Issue 后，必须同步更新 `PLANS.md`/`PLANS_ZH.md` 中的对应状态。

### 1.1 远程 Issue Registry

2026-07-30，Owner 明确授权远程创建 `ISSUE-001` 至 `ISSUE-027`。27 个 Issue 已全部创建、分配给 `@Donny-Guo`、加入 Milestone `MVP — Local Auth Vertical Slice`、应用 Labels，并验证 GitHub 原生 blocked-by 关系。`ISSUE-028` 及之后条目仍为本地草案。

仓库当前为 Public。Repository Visibility 和远程 Issue Registry 均不授权实施或部署。

| 草案      | Plan Task | GitHub Issue                                                       |
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

将草案创建到 GitHub 时：

- 初始 Assignee 为 `@Donny-Guo`。
- 首个切片使用 Milestone `MVP — Local Auth Vertical Slice`。
- 后续工作使用 `Post-MVP — Production Hardening`、`Post-MVP — Travel Agent` 或 `Release — Public Exposure`。
- 使用 GitHub 原生 blocked-by 关系，不能只依赖正文中的依赖列表。
- 默认一个 Outcome-focused Pull Request 对应一个 Issue；若无法作为一个完整单元 Review、测试与回滚，则实施前拆分。
- 标为 `Epic` 的条目必须使用 Parent/Sub-issue 关系；只有全部必需子 Issue 与 Epic 层证据完成后才可关闭。

## 2. 统一 Definition of Ready

只有以下条件全部满足，Issue 才能进入 `In Progress`：

- [ ] 实施门已打开，全部 Hard Dependency 已关闭。
- [ ] `PLANS.md` 中相关决策仍有效；未解决的产品或安全选择被明确记录，而不是猜测。
- [ ] 不参与编写 Issue 的人也能理解 Scope、Non-goals、Acceptance Criteria 与预期证据。
- [ ] 所需 External Service、测试数据、Secret、Environment 和 Permission 均可通过已批准路径使用。
- [ ] Schema、API、认证、部署或 Agent Boundary 变更在编码前已经识别 Migration、Compatibility 与 Design-review 要求。

## 3. 统一审核标准

每个 Issue 的专用 Review Checklist 在以下全局门禁之上叠加。只有满足以下条件，Reviewer 才能关闭 Issue：

- [ ] Pull Request 关联 Issue，只包含一个完整 Outcome，解释风险与回滚，不夹带无关重构或依赖升级。
- [ ] Format、lint、严格类型检查、相关 Unit/Integration/Component/E2E Test 和 Production Build 均通过权威 CI。
- [ ] 测试覆盖成功、边界、授权、失败和回归路径，不依赖执行顺序、生产数据或真实第三方 API。
- [ ] 未引入 Secret、密码、Token、私有 Prompt/Tool Result、Stack Trace、敏感 Response Field、可变 Action Reference、Skipped Test 或无法解释的 TODO。
- [ ] 在适用处完成 Security、Privacy、Accessibility、Cache、Log Redaction 与 Least Privilege Review。
- [ ] API Contract、Migration、Environment Example、Runbook、英文权威文档及已有 `_ZH.md` 跟随版保持同步。
- [ ] Required Conversation 已解决。Bootstrap 期间由 `@Donny-Guo` 记录 Self-review 证据；AI Review 只提供辅助意见，不能替代确定性 CI 或人的责任。

各类变更的最小证据：

| 变更类型              | 必需审核证据                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| UI                    | 桌面/窄屏证据、键盘路径、焦点/错误行为、自动 Accessibility 结果                                                  |
| API/Security          | Contract Test、Negative Case、Redaction Check、Request/Correlation ID、相关 Header/Cookie 证据                   |
| Database              | 空库 Forward Migration、Constraint/Concurrency Test、Least-privilege Role Check、Repair/Down Guidance            |
| CI/Governance         | Workflow Event/Permission Review、不可变依赖引用、Fork/Untrusted-code Test、Repository Setting 截图或导出        |
| Documentation         | Local-link Validation、English-primary Check、稳定 Task/Decision/Issue ID 与 Status 一致性                       |
| Deployment/Agent Epic | 已关闭的 Child Issue、Threat Model、Runbook、Evaluation/Operational Evidence，以及所需显式 Release Authorization |

## 4. 推荐实施顺序

下表是安全的默认顺序。同一 Wave 的任务只有在依赖继续满足且 Shared Contract Owner 明确时才可并行。

| 顺序 | 草案      | Plan Task | Wave                  | Milestone            | Blocked by                                                                   |
| ---: | --------- | --------- | --------------------- | -------------------- | ---------------------------------------------------------------------------- |
|    1 | ISSUE-001 | P-02      | Gate                  | MVP                  | P-01 (`DONE`)                                                                |
|    2 | ISSUE-002 | P-03      | 1                     | MVP                  | ISSUE-001                                                                    |
|    3 | ISSUE-003 | F-01      | 2                     | MVP                  | ISSUE-001、ISSUE-002                                                         |
|    4 | ISSUE-004 | F-02      | 3                     | MVP                  | ISSUE-003                                                                    |
|    5 | ISSUE-005 | F-03      | 3                     | MVP                  | ISSUE-003                                                                    |
|    6 | ISSUE-006 | F-04      | 4                     | MVP                  | ISSUE-004、ISSUE-005                                                         |
|    7 | ISSUE-007 | F-05      | 4                     | MVP                  | ISSUE-005                                                                    |
|    8 | ISSUE-008 | W-01      | 4                     | MVP                  | ISSUE-004                                                                    |
|    9 | ISSUE-009 | B-04      | 4                     | MVP                  | ISSUE-005                                                                    |
|   10 | ISSUE-010 | B-09      | 4                     | MVP                  | ISSUE-005                                                                    |
|   11 | ISSUE-011 | F-06      | 5                     | MVP                  | ISSUE-006、ISSUE-007                                                         |
|   12 | ISSUE-012 | F-07      | 5                     | MVP                  | ISSUE-003、ISSUE-006                                                         |
|   13 | ISSUE-013 | B-01      | 5                     | MVP                  | ISSUE-005、ISSUE-007                                                         |
|   14 | ISSUE-014 | W-02      | 5                     | MVP                  | ISSUE-008                                                                    |
|   15 | ISSUE-015 | W-04      | 5                     | MVP                  | ISSUE-008、ISSUE-010                                                         |
|   16 | ISSUE-016 | F-08      | 6                     | MVP                  | ISSUE-011、ISSUE-012                                                         |
|   17 | ISSUE-017 | B-02      | 6                     | MVP                  | ISSUE-013                                                                    |
|   18 | ISSUE-018 | B-05      | 6                     | MVP                  | ISSUE-013                                                                    |
|   19 | ISSUE-019 | W-03      | 6                     | MVP                  | ISSUE-014                                                                    |
|   20 | ISSUE-020 | B-03      | 7                     | MVP                  | ISSUE-017                                                                    |
|   21 | ISSUE-021 | B-06      | 8                     | MVP                  | ISSUE-009、ISSUE-010、ISSUE-018、ISSUE-020                                   |
|   22 | ISSUE-022 | B-07      | 8                     | MVP                  | ISSUE-009、ISSUE-010、ISSUE-018、ISSUE-020                                   |
|   23 | ISSUE-023 | B-08      | 8                     | MVP                  | ISSUE-010、ISSUE-018、ISSUE-020                                              |
|   24 | ISSUE-024 | B-10      | 9                     | MVP                  | ISSUE-021、ISSUE-022、ISSUE-023                                              |
|   25 | ISSUE-025 | W-05      | 9                     | MVP                  | ISSUE-014、ISSUE-023                                                         |
|   26 | ISSUE-026 | W-06      | 10                    | MVP                  | ISSUE-015、ISSUE-021、ISSUE-025                                              |
|   27 | ISSUE-027 | W-07      | 10                    | MVP                  | ISSUE-015、ISSUE-022、ISSUE-025                                              |
|   28 | ISSUE-028 | W-08      | 11                    | MVP                  | ISSUE-019、ISSUE-026、ISSUE-027                                              |
|   29 | ISSUE-029 | I-01      | 11                    | MVP                  | ISSUE-021、ISSUE-026                                                         |
|   30 | ISSUE-030 | I-02      | 11                    | MVP                  | ISSUE-022、ISSUE-025、ISSUE-027                                              |
|   31 | ISSUE-031 | E2E-01    | 12                    | MVP                  | ISSUE-019、ISSUE-029、ISSUE-030                                              |
|   32 | ISSUE-032 | Q-01      | 13                    | MVP                  | ISSUE-016、ISSUE-024、ISSUE-028、ISSUE-031                                   |
|   33 | ISSUE-033 | H-01      | 14                    | MVP                  | ISSUE-032                                                                    |
|   34 | ISSUE-034 | R-01      | Later 1               | Production Hardening | ISSUE-033                                                                    |
|   35 | ISSUE-035 | R-02      | Later 2               | Production Hardening | ISSUE-033；建议 ISSUE-034                                                    |
|   36 | ISSUE-036 | R-03      | Later 3               | Production Hardening | ISSUE-033、ISSUE-035；已批准 Session Semantics                               |
|   37 | ISSUE-037 | R-04      | Later 3               | Production Hardening | ISSUE-034、ISSUE-035；已批准 Mail Design                                     |
|   38 | ISSUE-038 | R-05      | Later 4               | Production Hardening | ISSUE-035、ISSUE-036、ISSUE-037                                              |
|   39 | ISSUE-039 | R-06      | Later 2               | Production Hardening | ISSUE-033；已批准 Lifecycle Semantics                                        |
|   40 | ISSUE-040 | R-07      | Later 3               | Production Hardening | ISSUE-033；已批准 Restricted Operation；若依赖状态则加 ISSUE-039             |
|   41 | ISSUE-041 | R-08      | Later 2               | Production Hardening | ISSUE-014、ISSUE-033                                                         |
|   42 | ISSUE-042 | R-10      | Later 2               | Production Hardening | ISSUE-033                                                                    |
|   43 | ISSUE-043 | R-09      | Later 3               | Production Hardening | ISSUE-033；已批准 Platform/Operations Input                                  |
|   44 | ISSUE-044 | R-11      | Later 3               | Travel Agent         | ISSUE-042；已批准 Retrieval Input                                            |
|   45 | ISSUE-045 | R-12      | Later 4               | Travel Agent         | ISSUE-042；只有需要 Retrieval 时才加 ISSUE-044                               |
|   46 | ISSUE-046 | R-13      | Later evidence-driven | Production Hardening | ISSUE-033；已批准 Usage/Compliance Evidence                                  |
|   47 | ISSUE-047 | R-14      | Release gate          | Public Exposure      | ISSUE-032、ISSUE-033、ISSUE-035、ISSUE-042、ISSUE-043 及全部 Release Feature |

## 5. 首个切片 Issue 规格

### ISSUE-001 — [P-02] 授权实施

- **状态：** `DONE`
- **Labels：** `type:governance`、`priority:p0`、`scope:first-slice`
- **Blocked by：** 无；P-01 已完成，Owner 授权已于 2026-08-02 记录
- **PR Boundary：** 无

**目标**

建立可审计的实施门，避免把规划批准误当成修改仓库或 GitHub Setting 的权限。

**工作**

- [x] 获得明确授权首个切片范围的指令。
- [x] 记录授权是否覆盖代码、脚手架、依赖、Hook、MIT `LICENSE` 治理、首切片 GitHub CI/治理 Setting、迁移和本地基础设施。
- [x] 实施前把 2026-08-02 授权日期与排除项同步到 `PLANS.md` 及中文跟随版。

**审核/验收**

- [x] 指令无歧义且来自 Repository Owner。
- [x] 范围和排除项与 D-01 至 D-25 一致；D-25 仅变更 Framework/ORM Version Line 及其 Migration Contract。
- [x] 在记录授权之前，未为关闭本 Gate 而修改实施 Artifact 或远程 Setting。

**证据：** 2026-08-02 的 Owner 指令与同步后的中英文 Plan Status。已跟踪的 MIT `LICENSE` 早于本次授权存在，由 F-08 处理；关闭本地 Gate 时未修改任何远程 GitHub 状态。

**非目标：** 技术实施、创建 GitHub Issue 或授权公开发布。

### ISSUE-002 — [P-03] 冻结兼容版本矩阵

- **状态：** `DONE`
- **远程状态：** GitHub Issue #2 已于 2026-08-02 关闭。
- **Labels：** `type:task`、`area:foundation`、`area:ci`、`priority:p0`
- **Blocked by：** ISSUE-001
- **PR Boundary：** 一个 Version-policy Change

**目标**

在创建脚手架前产出唯一可复现的 Toolchain 基线，使受支持组件和明确接受的支持例外都可审计。

**已确认的 Owner 约束（D-25 于 2026-08-03 修订）**

- 使用当前稳定的 Next.js 16 与 MUI v9 版本线；经 Review 的精确 Pin 为 Next.js 16.2.12、MUI Material/Icons 9.2.0 与 `@mui/material-nextjs` 9.1.1。
- 使用当前稳定的 TypeORM 版本线；经 Review 的精确 Pin 为 TypeORM 1.1.0。
- 使用 PostgreSQL 18。
- API 测试使用 Jest/Supertest，Web Unit/Component 测试使用 Vitest/React Testing Library，Browser E2E 使用 Playwright。
- 保持精确 Stable Pin，只在 Owner Task 中安装对应 Dependency；每季度及公开暴露前重新 Review Support/Compatibility，再次变更 Major 需 Owner 明确批准。

**工作**

- [x] 从 Primary Source 选择 Node.js LTS、pnpm、TypeScript、Turborepo、Next.js 16、React/React DOM、MUI v9 及其官方 Next/Emotion Integration、NestJS 及其 CLI/Adapter Package、TypeORM 1.1、PostgreSQL Driver、PostgreSQL 18、pgvector、Argon2、ESLint、Prettier、Jest/Supertest、Vitest/React Testing Library、Playwright、Husky、lint-staged 与 commitlint 的精确兼容版本。
- [x] 记录 Owner 选择的测试栈、PostgreSQL Major 与 D-25 Next.js/MUI/TypeORM Choice，不保留笼统占位符。
- [x] 创建权威 `docs/toolchain.md` 及其 `docs/toolchain_ZH.md` 跟随版。每个选择都记录精确版本或有版本的 Image Candidate、Compatible/Supported Intersection、Primary-source Link 与检查日期、Support Status 或 Exception、Pin/Enforcement Location、Update Owner/Cadence、Rollback Target 及下游 Verification Task。
- [x] 除非 Primary-source 证据否决，否则选择 `ubuntu-24.04`；记录后续镜像 Benchmark 的有版本 Debian-slim/Alpine 候选，但不选择最终生产 Base。
- [x] 定义精确 Pin/Range、升级周期、回滚 Owner 和 Enforcement-owner Map。P-03 选择策略；F-01 实现根 Package-manager/Engine Enforcement，F-05 固定数据库镜像，B-04 证明 Argon2，W-01 证明 MUI SSR，F-06/F-08 证明 CI 一致性及完整 Action Register。
- [x] 为已知 CI/Security Action 建立初始 Action Register；每个计划引用使用完整 Commit SHA 并附可读版本注释。F-06/F-08 在真实 Workflow 建立完整集合后更新该 Register。

**审核/验收**

- [x] `.node-version` 包含精确的已选 Node Release 并与矩阵一致；记录精确 pnpm Release 及其 F-01/F-06 Enforcement Location。
- [x] 不选择浮动 `latest`、未批准 Canary、Preview、Prerelease 或可变 Action Reference。
- [x] 在完成的 Toolchain Artifact 中明确记录 D-25 的 Next.js 16/MUI v9/TypeORM 1.1 Selection、Owner-task Installation Boundary、PostgreSQL 18 及所选测试系列。
- [x] 兼容证据覆盖 MUI/Next SSR、NestJS/TypeORM/PostgreSQL、pgvector、Native Argon2id 及受支持的 Node/pnpm Runtime 交集。
- [x] 每个固定工具都有 Primary-source Link 与检查日期、Owner、经 Review 的升级路径、回滚及下游 Enforcement Task。
- [x] Issue 不声称在其对应下游任务存在前，Package Installation、Lockfile Resolution、Application Build、Runtime Smoke Test 或 CI 一致性已经通过。

**证据：** `.node-version`、`docs/toolchain.md`、同步的 `docs/toolchain_ZH.md`、`PLANS.md` 中的 D-25，以及要求的 Matrix/Register 内容。原始 P-03 Documentation Check 于 2026-08-02 通过；D-25 于 2026-08-03 重新检查并修订受影响 Row。F-01 提供 Root Dependency/Lockfile/Task Evidence，F-02 提供已安装 Next.js 16 Evidence。MUI SSR、TypeORM/PostgreSQL Runtime Behavior 与 CI 仍由下游任务负责。

**非目标：** 安装依赖、生成 Lockfile、创建应用脚手架、声称下游 Runtime/CI Evidence 已存在，或选择最终生产 Container Base。

### ISSUE-003 — [F-01] 创建 pnpm/Turborepo Monorepo 根

- **状态：** `DONE`
- **远程状态：** GitHub Issue #3 已于 2026-08-03 关闭。
- **Labels：** `type:task`、`area:foundation`、`priority:p0`
- **Blocked by：** ISSUE-001、ISSUE-002
- **PR Boundary：** 一个 Root-workspace PR

**目标**

建立最小 Root Workspace，稳定发现并编排 Web、API 与真实 Shared Package。

**工作**

- [x] 加入 pnpm Workspace/Package-manager Constraint、Root Script、Ignore/Editor 约定及唯一 Root Lockfile。
- [x] 为 `format`、`lint`、`typecheck`、`test`、`build` 建立依赖/Output 正确且仅本地 Cache 的 Turbo Task Graph。
- [x] 为 Husky 保留 Root `prepare` Boundary，不创建 Speculative Package。

**审核/验收**

- [x] Root 能发现 `apps/*` 和 `packages/*`，内部包使用 `workspace:`。
- [x] Root Task 执行预期 Package Graph，Cache Hit 不会掩盖缺失 Output。
- [x] 只有一个 pnpm Lockfile，无 npm/yarn Lockfile、Remote Turbo Cache 或含 Secret 的 Cache Config。
- [x] Clean Checkout Install 与 Root Task Discovery 可重复且有文档。

**证据：** 2026-08-02，本地 Node 24.18.0 与 pnpm 11.18.0 符合所选基线。`pnpm install --frozen-lockfile` 在 Working Tree 以及由 Committed HEAD 加本次变更组装的 Disposable Fresh Candidate Tree 中均成功。组合 Turbo Dry Run 与 `pnpm format`、`pnpm lint`、`pnpm typecheck`、`pnpm test`、`pnpm build` 全部成功；F-02/F-03 加入应用前，零个 Package Task 符合预期。Disposable App/Package Fixture 证明了两个 Workspace Glob 的发现、`workspace:*` Resolution、Package Dependency Ordering、将 Cached Output 移出仓库后的 Build-output Restoration，以及 Format Cache Bypass。仓库搜索确认只有一个 Dependency Lockfile，且不存在 npm/yarn Lockfile、Remote-cache Enablement、Cache Credential 或 Speculative Application/Shared-package Scaffold。可重复命令已记录在 `README.md` 及同步跟随版中。

**非目标：** Root Boundary 以外的应用脚手架或 Speculative `common` Package。

### ISSUE-004 — [F-02] 创建 Next.js 应用脚手架

- **状态：** `DONE`
- **远程状态：** GitHub Issue #4 已于 2026-08-03 关闭。
- **Labels：** `type:task`、`area:web`、`priority:p0`
- **Blocked by：** ISSUE-003
- **PR Boundary：** 一个最小 Web Scaffold PR

**目标**

创建可独立构建的 `apps/web` Next.js App Router TypeScript 应用。

**工作**

- [x] 使用 App Router、`src/`、严格 TypeScript、已批准 Root Script 和宿主机 pnpm/Turbo 开发。
- [x] 清理 Demo/Template Asset 与无用依赖。
- [x] 保留计划中的 Route/Feature Boundary，不提前实现 Auth、Navigation 或 Agent。
- [x] 以精确 Next.js 16.2.12 Pin 与原生 ESLint Flat Configuration 将 D-25 应用于已安装 Web Surface。

**审核/验收**

- [x] Root Command 下 Dev、lint、typecheck、生成的 Test（如有）与 Production Build 通过。
- [x] 不引入 Tailwind 或第二套 UI System。
- [x] Client Bundle 不暴露 API Secret/Internal Origin。
- [x] 无假业务行为或未使用的生成示例。

**证据：** 2026-08-03，精确 Next.js 16 Installation、ESLint、Route Type Generation、Strict TypeScript、Turbopack Production Build，以及返回 `200` 和 `Trip Agent` 的 Production `GET /` Smoke 均通过。Next 16 生成其必需的 `react-jsx` Setting 与 Development Route-type Include。F-02 未生成 Test；W-01 后续加入 App-local Vitest Tooling 与一项 Render Regression，进一步 Coverage 仍由后续 Web Test Task 负责。

**非目标：** MUI、Route Group、Form 或认证。

### ISSUE-005 — [F-03] 创建 NestJS 应用脚手架

- **状态：** `DONE`
- **远程状态：** GitHub Issue #5 已按 Completed 关闭；于 2026-08-03 观察到该关闭状态。
- **Labels：** `type:task`、`area:api`、`priority:p0`
- **Blocked by：** ISSUE-003
- **PR Boundary：** 一个最小 API Scaffold PR

**目标**

创建具有明确 Lifecycle Boundary 的严格、可独立构建 NestJS REST 应用。

**工作**

- [x] 建立 `/api/v1`、Domain-module Layout、Test Entry、严格 TypeScript、宿主机开发与 Graceful Shutdown。
- [x] 提供只检查进程的 Liveness。
- [x] 删除默认示例 Controller，或替换为明确 Health Entry。

**审核/验收**

- [x] Root Command 下 Start、lint、typecheck、Unit Test 与 Production Build 通过。
- [x] Liveness 不伪装成 PostgreSQL Readiness。
- [x] 不存在空 `AgentModule`、Database Entity、Auth Bypass 或 Speculative Provider Integration。
- [x] Shutdown 可观察且无挂起 Resource。

**证据：** 2026-08-03，API lint、严格 Typecheck、一个 Unit Test、两个 Supertest HTTP Assertion、组合 Test Entry 与 Production Build 均通过；Root format、lint、typecheck、test、build 与 Frozen Install 也均通过。Development 与编译后的 Production Start 都从 `GET /api/v1/health/live` 返回 `200` 和 `{"status":"ok"}`；已移除的 Starter Root 返回 `404`，两个进程均在一次中断后退出且无挂起。Scope Search 未发现 ORM、Readiness、认证、UsersModule、AgentModule、Provider Integration、嵌套 Lockfile、Starter Example 或无说明 TODO。
**非目标：** ORM、Readiness、认证、UsersModule 或 LangGraph。

### ISSUE-006 — [F-04] 建立共享工程配置

- **状态：** `DONE`
- **远程状态：** 2026-08-05 检查时 GitHub Issue #6 仍为 Open；未获得或执行远程更新授权。
- **Labels：** `type:task`、`area:foundation`、`area:quality`、`priority:p0`
- **Blocked by：** ISSUE-004、ISSUE-005
- **PR Boundary：** 一个 Shared-config PR

**目标**

消除冲突的应用本地规则，同时让 Shared Package 保持窄且有真实复用依据。

**工作**

- [x] 建立统一 Prettier，并在两个应用确有使用时建立共享严格 TypeScript/ESLint Config。
- [x] 标准化 Root/Package Task 名与 Turbo Output。
- [x] 定义 Generated、Secret、Environment、Build、Test 和 Cache Ignore。

**审核/验收**

- [x] Web/API 使用一致适用规则，无 Circular 或 Deep Config Import。
- [x] `format:check`、lint、typecheck、test、build 在 Root 可运行，并会对故意违规失败。
- [x] Generated/Environment File 被忽略，但不隐藏 Source 或 Contract。
- [x] 没有在少于两个 Consumer 时创建 Speculative Utility/Test Package。

**证据：** 2026-08-05，两个应用均通过 `workspace:*` 消费窄范围的 `@trip/config-typescript` 与 `@trip/config-eslint` Package；统一的精确根 Prettier 3.9.6 Policy 与标准化 Root/Package Task 已启用，而 Next.js、Node、Jest 与 Vitest 关注点仍保留在应用本地。精确 Node/pnpm Check、Frozen Install、`format:check`、强制 Lint/Typecheck/Test/Build Task、一个 Web Render Test、一个 API Unit Test、两个 API HTTP Assertion、Production Build、Shared-config Loading、五类故意违规的 Negative Rule Probe、Ignore Allow/Deny Matrix、Package-boundary Audit，以及两次命中的 Local-cache Output-restoration Run 均通过。仓库保持唯一根 Lockfile，Remote Cache 保持关闭，且未发现竞争 Lockfile、Deep/Circular Config Import、推测性 `test-utils`、Probe Residue 或被隐藏的 Source/Contract File。

**非目标：** Feature Code、无关依赖升级或 Remote Cache。

### ISSUE-007 — [F-05] 添加本地 PostgreSQL 与 pgvector

- **状态：** `DONE`
- **Labels：** `type:task`、`area:database`、`area:infrastructure`、`priority:p0`
- **Blocked by：** ISSUE-005
- **PR Boundary：** 一个 Local-infrastructure PR

**目标**

提供可重复的本地 PostgreSQL/pgvector，同时保持 Provisioner、Migrator、Runtime 权限分离。

**工作**

- [x] 加入固定版本 Docker Compose、Health Check、具名开发 Volume 和 `.env.example`。
- [x] 使用不同的非生产 Provisioner/Migrator/Runtime Credential；高权限 Bootstrap 启用并验证 `vector`，记录 `extversion`。
- [x] Web/API 保持宿主机运行，不加入 Redis。

**审核/验收**

- [x] Clean Environment 可预测地启动、健康、验证 pgvector、停止和重启。
- [x] 只有 Provisioner 能管理 Extension/Role；Migration-shaped Transactional DDL Probe 以 Migrator 成功并 Rollback；直接 TCP/SCRAM Runtime Connection 成功，而 Runtime DDL/Extension 操作失败。实际 NestJS/TypeORM Connection/Readiness 仍归 B-01，首个真实 Application Migration 仍归 B-02。
- [x] 不提交、记录或嵌入真实 Credential。
- [x] Test/Command 不依赖已有 Developer Volume。

**证据：** 2026-08-05，精确的 `pgvector/pgvector:0.8.5-pg18-trixie` OCI Index Digest 在新的 Disposable Compose Project 中通过 Loopback 与具名 Volume 达到 Healthy。Executable Bootstrap Assertion 与独立 Report 证明 PostgreSQL `180004`、Vector `0.8.5` Available/Installed 状态、Provisioner-owned Extension/Role 工作、Migrator-owned `app` Schema、三个 TCP/SCRAM Identity、仅 Migrator 可执行且 Rollback 的批准 Application DDL、Runtime/Subordinate 操作以 SQLSTATE `42501` 被拒绝、没有 Persistent Probe Object、Password-failure Log Redaction、真实 Password 不出现在 Log/Image Metadata，以及 Container Recreation 后保持同一 Cluster。Shell/Compose/Scope/Secret Check、Frozen Install、Formatting、Markdown Link，以及强制 Uncached Lint/Typecheck/Test/Build 均通过。

**非目标：** 应用容器、Redis、Vector Schema 或生产数据库选择。

### ISSUE-008 — [W-01] 集成 MUI v9 与 App Router SSR

- **状态：** `DONE`
- **Labels：** `type:task`、`area:web`、`area:ui`、`priority:p0`
- **Blocked by：** ISSUE-004
- **PR Boundary：** 一个 Theme/SSR Integration PR
- **远程状态：** GitHub Issue #8 已按 Completed 关闭；于 2026-08-05 观察到该关闭状态。

**目标**

为开发和生产提供唯一稳定的 MUI v9 Rendering/Theme Boundary。

**工作**

- [x] 加入精确的 `@mui/material@9.2.0`、`@mui/icons-material@9.2.0`、`@mui/material-nextjs@9.1.1` 与已批准 Emotion Dependency；使用官方 `v16-appRouter` Cache Integration。
- [x] 在 Root Layout 建立 `ThemeProvider`、Theme Token、Font 与已选 CSS-variable Strategy。
- [x] 若 MUI `component` Prop 接收 `next/link`，添加 Local Client Component Wrapper；读取 URL 的 Client Control 必须置于布局稳定的 Suspense Boundary 中。
- [x] 加入最小 Render/Build Regression Test。

**审核/验收**

- [x] Dev、Server Render、Hydration、Navigation 和 Production Build 无配置导致的 Style-order/Hydration Warning 或 Flash。
- [x] Theme Token 一致生效并支持 Responsive/Accessibility。
- [x] 不引入第二套 Component System 或散落的 Global Magic Style。

**证据：** 2026-08-05，精确 MUI/Emotion 与所需 Web Render-test Pin 已写入根 Lockfile。Root Layout 使用官方 `v16-appRouter` Cache Provider、唯一 Theme/CSS Baseline Boundary、MUI CSS Variable 与自托管 Roboto。Server Component 页面使用 Theme Spacing 与 Palette Token，同时保留默认 Palette。Frozen Install、Web Vitest Render Regression、Root Lint/Typecheck/Test/Build、Production SSR Style Placement（`head` 中三个 Emotion Style Element，`body` 中为零）与两轮重复 Client-navigation Cycle 均通过，Style Count 稳定且 Browser Console 无相关错误。目前不存在 MUI-to-`next/link` 或读取 URL 的 Client Control，因此 Conditional Wrapper/Suspense 要求通过检查确认满足，无需添加推测性代码。

**非目标：** 最终 Branding、Navigation 或 Auth Form。

### ISSUE-009 — [B-04] 实现 PasswordPolicy 与 PasswordHasher

- **状态：** `TODO`
- **Labels：** `type:security`、`area:api`、`area:auth`、`priority:p0`
- **Blocked by：** ISSUE-005 与 D-08
- **PR Boundary：** 一个隔离的 Password-security PR

**目标**

建立可独立测试的密码创建策略和 Argon2id Boundary，不让 Login 耦合未来创建规则。

**工作**

- [ ] 集中 8–20 ASCII Allowed Set、类别规则和稳定 Failure Code。
- [ ] 加入固定、许可明确、有 Checksum 的本地 Whole-password Blocklist，并记录来源、更新周期及创建时 Fail-closed 行为。
- [ ] 封装并 Benchmark Argon2id Hash/Verify，限制并发成本，记录 Rehash/Future-policy 行为。

**审核/验收**

- [ ] 测试覆盖 7/8/20/21、每个缺失类别、允许字符、Printable-ASCII 补集、Whitespace、Unicode、原样 Paste 和 Common Password。
- [ ] 同一输入产生不同 Salted Hash；正确/错误验证工作；参数满足当前批准 OWASP Floor 与实测 Runtime Budget。
- [ ] 明确保持 Login Compatibility：Hash Verify 不执行当前创建组合规则。
- [ ] Candidate Password、Plaintext、Hash 不进入 Log 或 Remote Password-check Service。

**证据：** Benchmark、Blocklist Provenance/Checksum、Unit Test 与 Redaction Test。  
**非目标：** Sign-up/Login Endpoint、Remote Breach Lookup 或 Database Pepper。

### ISSUE-010 — [B-09] 标准化 API 错误与 Request Correlation

- **状态：** `TODO`
- **Labels：** `type:task`、`area:api`、`area:observability`、`priority:p0`
- **Blocked by：** ISSUE-005
- **PR Boundary：** 在 Sign-up/Login 前完成的一个 Transport/Error-contract PR

**目标**

在 Web 联调前冻结安全、机器可读的 API Success/Error Envelope 与可关联诊断。

**工作**

- [ ] 定义 Stable Code、`fieldErrors` Array、安全英文 Fallback、Safe User Serialization 与 Public/Internal Error 分离。
- [ ] 加入 Global Exception Handling、Request/Correlation ID、Structured Log Redaction、JSON Content-type/Body-size Handling 和 No-store Policy。
- [ ] 记录 Web 可使用且无需解析文案的 Contract。

**审核/验收**

- [ ] 多字段失败稳定可操作；未知错误不暴露 Stack、SQL、内部 Exception 或 Secret。
- [ ] 永不回显密码，Safe User Serialization 不可能包含 `password_hash`。
- [ ] Request ID 能关联 Response 与内部 Log，且不泄漏 Private Data。
- [ ] Auth/Private Cache Header 与 Unsupported Content/Body 行为可直接测试。

**证据：** Contract Example、Filter/Redaction/Correlation/Cache Header 的正负测试。  
**非目标：** 业务 Endpoint 或 Swagger Generation。

### ISSUE-011 — [F-06] 添加 GitHub Actions Pull Request CI

- **状态：** `TODO`
- **Labels：** `type:task`、`area:ci`、`area:security`、`priority:p0`
- **Blocked by：** ISSUE-006、ISSUE-007
- **PR Boundary：** 一个 CI Workflow PR

**目标**

以稳定、最小权限的 `ci-required` 结果作为可信与 Fork Pull Request 的权威 Merge Gate。

**工作**

- [ ] 为 `pull_request`、可信 `main` Push，以及启用 Merge Queue 后的 `merge_group` 添加 Workflow。
- [ ] 在选定并版本固定的 Ubuntu Runner 上，使用 Frozen pnpm Lockfile 与 Turbo 执行 Format、Lint、Typecheck、Test、Build 和文档策略检查。
- [ ] 启动临时、版本固定的 PostgreSQL/pgvector Service，并隔离可信与不可信 Cache。
- [ ] 将 Third-party Actions 固定到完整 SHA；采用 Top-level Read-only Permission、Job-scoped Escalation、显式 Timeout、Concurrency Cancellation 和始终上报的 Aggregate Result。

**审核/验收**

- [ ] 人为制造的 Job Failure 会阻止 `ci-required`；因 Path Filter 跳过的工作不会让 Required Result 永久 Pending。
- [ ] Fork PR 无 Secret 运行；不通过 `pull_request_target` 执行不可信代码，也不写入之后会被 Release Job 信任的 Artifact/Cache。
- [ ] Cache 无法绕过 Frozen-lockfile、Generated-artifact、Migration 或 Documentation-drift Check。
- [ ] PR Job 无法访问 Production Credential 或真实 Provider API。

**证据：** Workflow Permission/Event Review、Fork Simulation、Failure/Path-filter Test、Action SHA Register 与 CI Run Link。  
**非目标：** Deployment、Self-hosted Runner、日常 Alpine CI 或 Remote Turbo Cache。

### ISSUE-012 — [F-07] 添加本地 Hook 与 Commit Convention

- **状态：** `TODO`
- **Labels：** `type:task`、`area:developer-experience`、`area:quality`、`priority:p1`
- **Blocked by：** ISSUE-003、ISSUE-006
- **PR Boundary：** 一个 Hooks/Conventions PR

**目标**

提供快速本地反馈，同时保持 CI——而不是可绕过的 Hook——为 Merge Authority。

**工作**

- [ ] 配置根目录 Husky Installation、`pre-commit` 中的 lint-staged Prettier/ESLint Check，以及 `commit-msg` 中的 commitlint Conventional Commits。
- [ ] 在 CI 验证 Squash PR Title。
- [ ] 记录常规用法、Partial Staging 行为，以及 `--no-verify` 会被权威 CI/Title Check 捕获这一事实。

**审核/验收**

- [ ] 合法 Staged Change/Message 通过，失败信息可操作。
- [ ] Partially Staged File 不会被破坏或意外扩大 Staging 范围。
- [ ] Hook 不包含 Network、Database、Build 或 Full-suite 工作，并在约定的 Fast-feedback Budget 内完成。
- [ ] 常规 Root Install 可激活 Hook，无需 Global Package Dependency。

**证据：** Clean-install Hook Test、Partial-staging Test、合法/非法 Message 示例与 CI Title-check Result。  
**非目标：** 阻止所有本地绕过，或把 Security Gate 移出 CI。

### ISSUE-013 — [B-01] 添加经过验证的 API Configuration 与 TypeORM

- **状态：** `TODO`
- **Labels：** `type:task`、`area:api`、`area:database`、`priority:p0`
- **Blocked by：** ISSUE-005、ISSUE-007
- **PR Boundary：** 一个 Configuration/Database-foundation PR

**目标**

建立 Fail-fast API Configuration、显式 TypeORM Connection Lifecycle，以及分离的 Migration/Runtime Responsibility。

**工作**

- [ ] 在启动时验证 Port、Runtime/Migration Database URL、Proxy Trust、CORS/Trusted Origin、Request Limit 与 JWT/Cookie Input。
- [ ] 安装精确的 `typeorm@1.1.0`、`@nestjs/typeorm@11.0.3` 与已批准 PostgreSQL Driver Pin；至少 Target ES2023，并只使用 `DataSource`/`DataSourceOptions` 与 Instance Repository。
- [ ] 添加 DatabaseModule/ConfigModule Boundary、Dependency-aware Readiness、Graceful Shutdown 与显式 Migration Command/Job。保留 TypeORM 1 Fail-closed `invalidWhereValuesBehavior`；有意匹配 Null 时使用 `IsNull()`。
- [ ] 禁用 Production `synchronize` 和 Application-start Automatic Migration。

**审核/验收**

- [ ] 缺失、格式错误、强度不足或相互矛盾的 Critical Configuration 会在服务流量前失败，且不回显 Secret。
- [ ] Liveness 仅表示 Process；Readiness 会随 PostgreSQL 不可用而失败，并在恢复后恢复。
- [ ] Runtime 使用 Least-privilege Role 连接且不能执行 DDL；Migrator Ownership 明确。
- [ ] Dependency Resolution 证明所选 Nest Adapter/TypeORM/PostgreSQL Version 没有被忽略的 Peer Conflict；不存在已移除的 TypeORM 0.3 API 或 String-based `select`/`relations` Syntax。
- [ ] 测试可注入隔离 Configuration，并能关闭 Connection 而不挂起。

**证据：** Configuration Matrix、Startup Negative Test、Readiness Recovery Test、Role Check 与 Graceful-shutdown Transcript。  
**非目标：** User Schema、Automatic Production Migration 或 Vector Column。

### ISSUE-014 — [W-02] 创建 Route Group 与 Application Shell

- **状态：** `TODO`
- **Labels：** `type:feature`、`area:web`、`area:i18n`、`priority:p0`
- **Blocked by：** ISSUE-008
- **PR Boundary：** 一个 Web Shell PR

**目标**

建立 Public Auth Route、Protected-app Route Structure、空 Route Target 与 English-first Localization Boundary。

**工作**

- [ ] 创建 `(auth)` 与 `(app)` Route Group，包含 Login、Sign Up、Dashboard、Flight Info 和 User Target。
- [ ] Auth Page 不显示 Application Navigation，所有 Protected Target 共享一个 App Shell。
- [ ] 添加 Stable Message Key、English Catalog、Locale-aware Formatter，以及有意设计的 Loading/Error/Not-found Boundary。

**审核/验收**

- [ ] Route-group Name 不出现在 URL；每个 Target 的 Direct Navigation 与 Refresh 均工作。
- [ ] `html lang` 与 Default Locale 为 English，所有用户可见 Shell Copy 均来自 Catalog。
- [ ] Loading/Error/Not-found Boundary 范围清晰且可恢复。
- [ ] 添加另一个 Catalog 不要求重构 Component 或 Route Ownership。

**证据：** Route Matrix、Direct-refresh Test、Message-key Completeness Test 与 Desktop/Narrow Shell Evidence。  
**非目标：** 真实 Session Protection、最终页面内容或 Language Switcher。

### ISSUE-015 — [W-04] 创建 Form Validation 与 API Access Boundary

- **状态：** `TODO`
- **Labels：** `type:task`、`area:web`、`area:auth`、`priority:p0`
- **Blocked by：** ISSUE-008、ISSUE-010，以及决策 D-08/D-16
- **PR Boundary：** 一个 Form/API Foundation PR

**目标**

为 Auth Page 提供统一的 Accessible Form/Schema Boundary 和 Typed、Code-driven API Adapter，同时不暴露 Internal Origin。

**工作**

- [ ] 选择并记录 Form/Schema Approach。
- [ ] 集中管理相对 Browser `/api/v1`、Server-only Internal API Origin、Credential、Timeout、Parsing 与 Stable Error-code Mapping。
- [ ] 通过 Structured Constraint 与 Checklist 表达 Password-policy Intent，而不是散落 Regex；保留 Paste/Autofill。

**审核/验收**

- [ ] Component 不拼接 URL，也不解析 Server Prose。
- [ ] Server-only Origin 与 Configuration 不能进入 Client Bundle。
- [ ] Client Feedback 覆盖长度、大写、小写、数字与 `$#@%`，但 Server 仍为 Authority。
- [ ] Network、Timeout、Invalid Response、Global Error 和 Multiple Field-code Path 保持可区分、可访问。
- [ ] 所有用户可见 Copy 来自 Message Key。

**证据：** Adapter/Schema Test、Bundle/Configuration Exposure Check、Checklist Test 与 Error-mapping Matrix。  
**非目标：** 完整 Sign Up/Login Screen 或 Generated OpenAPI Client。

### ISSUE-016 — [F-08] 建立 GitHub Governance 与 Security Automation

- **状态：** `TODO`
- **Labels：** `type:governance`、`area:github`、`area:security`、`priority:p0`
- **Blocked by：** ISSUE-011、ISSUE-012，以及决策 D-20/D-21/D-23/D-24
- **PR Boundary：** 一个 Repository-files PR，加一个可审计的 Settings Change Set

**目标**

通过可审计的治理保护 Public Repository，同时不创建无法满足的 Self-approval Gate。

**工作**

- [ ] 添加面向 `@Donny-Guo` 的 `CODEOWNERS`、Contribution/Security Guidance、PR/Issue Template 和 pnpm/Actions Dependabot；验证并维护含 `Copyright (c) 2026 Donny-Guo` 的标准 MIT `LICENSE`。
- [ ] 配置 `main`：仅允许 PR、Squash/Linear History、已解决 Conversation、稳定 Required CI、禁止 Force Push/Delete；Bootstrap Approval Requirement 必须可满足，不配置通用 Required-check Bypass，并在存在合格 Reviewer 时要求一个非作者 Owned-path Approval。
- [ ] 验证并启用适用的 Dependency Review、CodeQL/Code Scanning、Secret Scanning 与 Push Protection。
- [ ] 执行已批准的 Manual、Non-required、3 PR 辅助 AI-review Evaluation，且不同时启用重叠 Reviewer。

**审核/验收**

- [ ] Direct Change 与 Required-check Bypass 被阻止；合并必须通过 CI 且已完成 Self-review。
- [ ] `CODEOWNERS` 覆盖 Workflow、Auth/Security、Migration 与 Agent/Tool，但不要求无法完成的 Self-approval。
- [ ] MIT License 被正确识别并含批准 Notice；Contribution/Security Path 清晰。
- [ ] Security Feature 已启用；不可用能力必须记录 Owner、Equivalent Control 与 Risk。
- [ ] AI Review 保持 Advisory、在已记录的 Evaluation Scope 内且不能满足 Approval；记录有效 Finding、False Positive、Miss 与 Latency。

**证据：** Repository-files PR、导出/截图的 Rules/Security Setting、Bypass Test、License Detection 与 AI-review Evaluation Record。

**非目标：** Production Deployment、Automatic 或 Merge-gating AI Review、重叠 Review Bot，或永久 Zero-human-review Policy。

### ISSUE-017 — [B-02] 创建 `users` Migration

- **状态：** `TODO`
- **Labels：** `type:task`、`area:database`、`area:auth`、`priority:p0`
- **Blocked by：** ISSUE-013，以及决策 D-07/D-11/D-17/D-18
- **PR Boundary：** Migration-only PR，包含其 Integration Test

**目标**

创建首个 Race-safe、Least-privilege `users` Schema，不加入推测性的 Account Field。

**工作**

- [ ] 创建 UUID `id`、最多 254 字符的 Canonical ASCII `email`、隐藏的 `password_hash`，以及 UTC `created_at`/`updated_at`。
- [ ] 在 PostgreSQL 强制 Trimmed/Lowercase Canonical Email 与 Uniqueness。
- [ ] 通过 Migrator Role 执行 Forward Migration，并记录 Forward-repair/Down 行为。

**审核/验收**

- [ ] Migration 可从 Empty Database 成功执行，Schema 与 `PLANS.md` 第 7 节完全一致。
- [ ] Direct Noncanonical Write 与 Concurrent Duplicate Canonical Email 被 Database 拒绝。
- [ ] Runtime DDL 失败；Migration 不执行 Extension Work。
- [ ] 不引入 Verification、Status、Role、Vector 或 Refresh-token Column。
- [ ] Repair/Down Guidance 考虑 Destructive Rollback Risk。

**证据：** Clean Migration Output、Schema Snapshot/Query、Concurrency/Constraint Test 与 Role-denial Test。  
**非目标：** ORM Auto-sync、Seed User 或后续 Account Lifecycle Field。

### ISSUE-018 — [B-05] 创建 Access-JWT Session Boundary

- **状态：** `TODO`
- **Labels：** `type:security`、`area:api`、`area:auth`、`priority:p0`
- **Blocked by：** ISSUE-013，以及决策 D-03/D-09/D-14/D-15/D-16
- **PR Boundary：** 一个 Security-boundary PR

**目标**

为第一阶段 Browser Session 建立可复用的 Token Issuance/Verification、Cookie、Provenance 与 Private-cache Control。

**工作**

- [ ] 实现 Allowlisted `HS256`、Required Claim、15-minute TTL、Secret Validation、JWT Guard 与 Shared TokenIssuer。
- [ ] 实现精确的 Production/Local Set/Delete Cookie Profile。
- [ ] 强制 JSON/Body Limit、精确 Trusted Origin 与 Same-origin Referer Fallback、拒绝 Missing/`null`、以 Fetch Metadata 纵深防御，并设置 `no-store`。

**审核/验收**

- [ ] Unexpected Algorithm、Signature、`iss`、`aud`、Claim、Expiry 或 Clock-tolerance Case 均安全失败。
- [ ] Weak/Missing Secret 导致启动失败；Secret 不进入 Log、Source、Response Body 或 Client Storage。
- [ ] 两种 Profile 的 Set/Delete Attribute 完全匹配，且 Browser 无法读取 Token。
- [ ] Untrusted/Missing Provenance、Unsupported Media Type 与 Oversized Body 在 Mutation 前失败。
- [ ] Auth/Private Response 不可缓存。

**证据：** JWT Matrix、Cookie Parity Test、Provenance/Content/Body Negative Test、Startup-secret Test 与 Cache/Redaction Evidence。  
**非目标：** Refresh Token、Redis Revocation、Mobile Auth 或更广 CORS Topology。

### ISSUE-019 — [W-03] 实现可扩展 Navigation

- **状态：** `TODO`
- **Labels：** `type:feature`、`area:web`、`area:ui`、`priority:p1`
- **Blocked by：** ISSUE-014
- **PR Boundary：** 一个 Navigation PR

**目标**

通过 Typed、Extensible Configuration 为 Dashboard、Flight Info 与 User 提供 Semantic、Responsive Navigation。

**工作**

- [ ] 使用 MUI AppBar/Toolbar，并为 Narrow Screen 使用合适的 Drawer/Menu。
- [ ] 从 Typed Configuration 与 Localized Message Key 渲染 Semantic Link。
- [ ] 支持 Active-route State，以及未来 Permission/Feature-flag Filtering。

**审核/验收**

- [ ] Mouse、Keyboard、Touch、Focus Order，以及 Browser Refresh/Direct-route Behavior 均工作。
- [ ] Current Route 可通过程序与视觉识别，且不只依赖颜色。
- [ ] Narrow Layout 不 Overflow 或 Trap Focus；Drawer/Menu 开关会被告知且可通过 Escape 关闭。
- [ ] Filtering Configuration 不会被误认为 API Authorization。

**证据：** Component Test、Keyboard/Manual Accessibility Record 与 Desktop/Narrow Screenshot。  
**非目标：** RBAC Enforcement 或 Flight/User Business Content。

### ISSUE-020 — [B-03] 实现 UsersModule Persistence Boundary

- **状态：** `TODO`
- **Labels：** `type:task`、`area:api`、`area:database`、`area:auth`、`priority:p0`
- **Blocked by：** ISSUE-017
- **PR Boundary：** 一个 UsersModule Persistence PR

**目标**

提供窄范围 User Persistence Operation，严格分离 Safe Public Data 与 Internal Credential Lookup。

**工作**

- [ ] 为 Create 与按 Canonical Email Lookup 添加有意设计的 Entity/Repository/Service Capability。
- [ ] Ordinary Select 默认排除 `password_hash`；Credential Material 仅通过一个 Auth-specific Internal Operation 暴露。
- [ ] 将 Unique Conflict 映射为 Stable Domain Result。

**审核/验收**

- [ ] Controller 或 Ordinary Query 默认均不能 Serialize/Select `password_hash`。
- [ ] Create 与 Canonical-email Lookup 可在真实 PostgreSQL 上工作。
- [ ] Concurrent Uniqueness Conflict 可确定性映射，不依赖 Check-then-create Race Assumption。
- [ ] Module Export 最小化，且不会将 ORM Entity 作为 API Response 泄漏。

**证据：** PostgreSQL Integration Test、Serialization/Selection Negative Test 与 Concurrent Conflict Test。  
**非目标：** Sign-up Orchestration、Password Hashing 或 Profile Management。

### ISSUE-021 — [B-06] 实现 Sign-up 与 Automatic Login API

- **状态：** `TODO`
- **Labels：** `type:feature`、`area:api`、`area:auth`、`priority:p0`
- **Blocked by：** ISSUE-009、ISSUE-010、ISSUE-018、ISSUE-020
- **PR Boundary：** 一个 Sign-up Endpoint PR

**目标**

交付权威 Registration：创建一个 User，并立即建立已批准的 Browser Session。

**工作**

- [ ] 添加 DTO/Global Validation、Canonical Email Normalization、PasswordPolicy/Blocklist Check、Hashing 与 Transactional User Creation。
- [ ] 将 Field、Common-password、Unknown-field 与 Unique-conflict Outcome 映射到冻结 Contract。
- [ ] 复用 TokenIssuer，仅返回 Safe User 与稳定 `messageCode`。

**审核/验收**

- [ ] 合法输入返回 `201`、一条含 Hash 的 Row，以及精确的 HttpOnly Session Cookie。
- [ ] Empty、Malformed、Length/Category/Character/Common-password、Media-type、Body-size 与 Unknown-field Case 返回安全、可操作的 `400`。
- [ ] Duplicate Canonical Email 返回 `409`；两个 Concurrent Registration 中恰好一个成功。
- [ ] Response、Log、Trace、Screenshot 与 Error 不包含 Password、Hash 或 Token。

**证据：** Endpoint Contract/Integration Test、Concurrent Registration Test、Database Row Inspection 与 Redaction Check。  
**非目标：** Email Verification、Refresh Token、Role 或 Public Rate Limiting。

### ISSUE-022 — [B-07] 实现 Login API

- **状态：** `TODO`
- **Labels：** `type:feature`、`area:api`、`area:auth`、`priority:p0`
- **Blocked by：** ISSUE-009、ISSUE-010、ISSUE-018、ISSUE-020
- **PR Boundary：** 一个 Login Endpoint PR

**目标**

验证 Existing User，同时避免 Account Enumeration，且 Password-policy 演进后不会意外锁定用户。

**工作**

- [ ] 验证 Transport Shape 与 1,024-byte Password Transport Cap；仅 Canonicalize Email。
- [ ] 使用原样 Submitted Password 验证 Stored Hash，不应用 Creation Composition Rule。
- [ ] 对 Unknown Account 执行一次固定 Dummy Argon2id Verification，并对两种失败原因返回同一 `INVALID_CREDENTIALS` Contract。
- [ ] 成功时设置已批准的 Access Cookie。

**审核/验收**

- [ ] 合法 Credential 返回 `200`、Safe User Data 与精确 Cookie。
- [ ] Unknown Email 与 Wrong Password 执行预期 Expensive Path，并返回结构完全相同的 `401`；测试不断言脆弱的 Timing Equality。
- [ ] Missing/Invalid Transport Input 返回 `400`；Oversized Input 不进入 Hash Work。
- [ ] 模拟 Creation-policy Change 后，Stored Password 仍可使用。
- [ ] Sensitive Value 不暴露，也不持久化到 Client Side。

**证据：** Endpoint Test、Dummy-path Spy/Evidence、Old-policy Compatibility Test、Cookie Test 与 Log Scan。  
**非目标：** Active Revocation、Password Reset 或暴露 Credential 失败原因。

### ISSUE-023 — [B-08] 添加 Current-user、Logout 与 Authorization Protection

- **状态：** `TODO`
- **Labels：** `type:feature`、`area:api`、`area:auth`、`priority:p0`
- **Blocked by：** ISSUE-010、ISSUE-018、ISSUE-020
- **PR Boundary：** 一个 Session-read/Logout/Guard PR

**目标**

提供第一阶段 Session Restore、Protection 与 End 所需的 API Authority。

**工作**

- [ ] 添加 `GET /api/v1/auth/me`、Idempotent `POST /api/v1/auth/logout`、Reusable JWT Guard、精确 Cookie Deletion 与 No-store Private Response。
- [ ] 仅返回 Safe User Contract。
- [ ] 记录本阶段缺少 Active Server Revocation 的已接受限制。

**审核/验收**

- [ ] 合法 Token 返回 Safe User Data；Missing、Invalid、Wrong-claim 与 Expired Token 返回 `401`。
- [ ] Logout 为 Idempotent，并清除精确 Cookie Tuple。
- [ ] 无论 Web Routing 如何，NestJS Guard 始终是最终 Authorization Boundary。
- [ ] Private Content 与 `Set-Cookie` Response 永不可缓存。

**证据：** Guard/Endpoint Integration Test、Cookie Deletion Parity、Cache Header 与 Safe-serialization Check。  
**非目标：** Refresh-token Storage、Redis、Device Session 或由 Logout 驱动的 Active Revocation。

### ISSUE-024 — [B-10] 添加完整 API Automation

- **状态：** `TODO`
- **Labels：** `type:test`、`area:api`、`area:database`、`area:security`、`priority:p0`
- **Blocked by：** ISSUE-021、ISSUE-022、ISSUE-023
- **PR Boundary：** 一个 API Test-completion PR；可行时 Production Fix 留在其所属 Issue

**目标**

建立隔离、可重复的 API Suite，证明完整 Contract 与 Security Boundary。

**工作**

- [ ] 完成 DTO、Normalization、PasswordPolicy/Argon2id、JWT、Provenance、Error Mapping 与 Redaction 的 Unit Coverage。
- [ ] 完成 Real-PostgreSQL Repository/Migration/Role Test。
- [ ] 完成 `PLANS.md` 中 Sign-up/Login/Me/Logout 的 API Integration/E2E Scenario。

**审核/验收**

- [ ] Coverage 包含所有 7/8/20/21、Category、Character、Blocklist、Email、Unknown-field、Media-type、Body-size、Duplicate/Concurrency、Cookie、Origin/Referer、No-store、JWT、Session、Dummy-hash、Wrong-password、Policy-evolution、Database-role 与 Leakage Case。
- [ ] Test 与顺序无关、使用隔离 Data，且无需真实 Third-party API 或 Developer Volume。
- [ ] Failure Artifact 与 Test Log 不含 Password、Hash、Token 或 Connection Secret。
- [ ] 每个 Security Control 至少有一个直接 Negative Test，不能只依赖 Line Coverage。

**证据：** CI Test Report、Scenario-to-test Traceability Matrix 与 Sanitized Failure Artifact。  
**非目标：** Browser UI Automation，或以任意 Coverage Percentage 替代行为验证。

### ISSUE-025 — [W-05] 恢复 Session、Logout 并保护 Web Route

- **状态：** `TODO`
- **Labels：** `type:feature`、`area:web`、`area:auth`、`priority:p0`
- **Blocked by：** ISSUE-014、ISSUE-023
- **PR Boundary：** 一个 Web Session/Protection PR

**目标**

在 Server Side 保护 `(app)` Route Group，安全恢复 Private Session，并区分 Authentication Failure 与 API Outage。

**工作**

- [ ] 在 Protected Layout 中，通过 Server-only Internal Origin 调用 `/auth/me`，显式转发 Incoming Cookie，并强制 No-store。
- [ ] 仅将真实 `401` Redirect 到 Login；API Outage 渲染 Recoverable State；清理 Same-origin Relative Return Path，并避免 Loop/Private-content Flash。
- [ ] 添加 Logout：API 清除 Cookie 后再清除 Client User State。

**审核/验收**

- [ ] Unauthenticated Direct/Refresh Access 绝不渲染 Private Content。
- [ ] Invalid/Expired Credential 无 Loop 地返回 Login；Outage 不会被误标为 `401`。
- [ ] Open、Protocol-relative 与 Cross-origin Return URL 被拒绝。
- [ ] Browser Code 不能读取 Token，且 Private Response 不缓存。
- [ ] Logout 清除精确 Cookie 与 Local User State。

**证据：** Server-route Test、Redirect Matrix、Outage Test、Cache Evidence 与 Browser Storage Inspection。  
**非目标：** 替代 NestJS Authorization 或实现 Refresh-token Behavior。

### ISSUE-026 — [W-06] 实现 Sign Up Page

- **状态：** `TODO`
- **Labels：** `type:feature`、`area:web`、`area:auth`、`area:accessibility`、`priority:p0`
- **Blocked by：** ISSUE-015、ISSUE-021、ISSUE-025
- **PR Boundary：** 一个 Sign Up Page PR

**目标**

交付 Accessible English Sign Up Experience，使用真实 API Feedback 并自动进入 Dashboard。

**工作**

- [ ] 构建 MUI Email/Password Field、Label、Visibility Control、Requirement Checklist、Loading/Disabled State、Duplicate-submit Prevention、Field Error 与 Form Alert。
- [ ] 映射 Local Validation 与 Stable Server Code，包括 Blocklist 与 Duplicate Email。
- [ ] 支持 Keyboard Submission、Paste、Autofill/Password Manager、Focus Management 与 Announced Error/Success。

**审核/验收**

- [ ] Empty/Invalid Email 与每项 Password Requirement 都获得具体即时反馈，且不只依赖颜色。
- [ ] Server Blocklist/`409`/Network/Outage Response 可区分且可操作。
- [ ] 成功 `201` 会等待 Cookie Response，并且只进入 Dashboard 一次。
- [ ] Password/Token 不进入 URL、Analytics、Log、Persistent State 或 Screenshot Evidence。
- [ ] Narrow 与 Desktop Layout 满足约定的 WCAG 2.2 AA-oriented Check。

**证据：** Component Test、Keyboard/Screen-reader-oriented Manual Record、Automated Accessibility Result 与 Responsive Screenshot。  
**非目标：** Email Verification、Profile Field 或 Language Switcher。

### ISSUE-027 — [W-07] 实现 Login Page

- **状态：** `TODO`
- **Labels：** `type:feature`、`area:web`、`area:auth`、`area:accessibility`、`priority:p0`
- **Blocked by：** ISSUE-015、ISSUE-022、ISSUE-025
- **PR Boundary：** 一个 Login Page PR

**目标**

交付 Accessible English Login Experience，保持 Generic Credential Failure 与 Password-policy Compatibility。

**工作**

- [ ] 构建 MUI Email/Password Field，以及完整 Idle/Loading/Success/Validation/Credential/Outage State。
- [ ] 对两种失败原因都将 `INVALID_CREDENTIALS` 映射到同一 Message。
- [ ] 只验证 Email/Transport Shape；不把 Sign-up Composition Rule 应用于 Login。
- [ ] 防止 Duplicate Request，并支持 Keyboard、Paste 与 Autofill。

**审核/验收**

- [ ] Empty/Invalid Email Feedback 在本地提供且可访问。
- [ ] Unknown Email 与 Wrong Password 在视觉和结构上不可区分。
- [ ] 一个违反后续 Creation Rule 的 Test Password 仍可提交。
- [ ] 成功 Login 仅进入 Dashboard 一次；Outage 与 `401` Behavior 可区分。
- [ ] Password/Token 不进入 URL、Log、Analytics 或 Persistent Client State。

**证据：** Component/Request-state Test、Credential-equivalence Test、Compatibility Test、Accessibility Result 与 Responsive Screenshot。  
**非目标：** Forgot Password、MFA 或 Account-status Message。

### ISSUE-028 — [W-08] 添加 Web Component 与 Accessibility Automation

- **状态：** `TODO`
- **Labels：** `type:test`、`area:web`、`area:accessibility`、`priority:p0`
- **Blocked by：** ISSUE-019、ISSUE-026、ISSUE-027
- **PR Boundary：** 一个 Web Test-completion PR

**目标**

证明 Web Behavior、Responsive Navigation、Message Completeness 与 Accessible Form Interaction，且不过度绑定 Implementation Detail。

**工作**

- [ ] 测试 Form State、Checklist Transition、API-code Mapping、Duplicate-submit Prevention、Navigation State 与 Locale-message Completeness。
- [ ] 添加 Automated Accessibility Check 与有记录的 Keyboard/Focus Manual Check。
- [ ] 覆盖代表性的 Desktop 与 Narrow Layout。

**审核/验收**

- [ ] 测试查询 Semantic Role/Name 与 Observable Behavior，而不是 Internal Component Structure。
- [ ] 不保留 Serious Automated Accessibility Violation；Exception 必须有 Owner 与 Justification。
- [ ] Error 已关联、可找到、会被告知且不只依赖颜色；Focus 不丢失或被困。
- [ ] Navigation 在 Keyboard、Touch 与 Narrow Viewport 下均可用。

**证据：** Web Test Report、Accessibility Output、Keyboard Checklist 与 Responsive Snapshot。  
**非目标：** 仅凭 Automation 声称完全 WCAG Conformance。

### ISSUE-029 — [I-01] 集成 Registration Path

- **状态：** `TODO`
- **Labels：** `type:integration`、`area:web`、`area:api`、`area:database`、`priority:p0`
- **Blocked by：** ISSUE-021、ISSUE-026
- **PR Boundary：** 一个 Registration-integration PR/Configuration Change

**目标**

验证真实 Web → Same-origin Gateway → API → PostgreSQL Registration Behavior 与 Trust Boundary。

**工作**

- [ ] 覆盖 Proxy Trust、Exact Origin/Referer、Media/Body Limit、Environment Routing、Error Code、Email Normalization、Password Boundary、Cookie 与 Cache Header。
- [ ] 覆盖 Success、Validation/Category/Character/Blocklist、Duplicate Email、Provenance Failure 与 API Outage。
- [ ] 检查 Persistence 与 Browser-visible State。

**审核/验收**

- [ ] 合法 Registration 创建一条 Hashed Row、设置不可读 Cookie 并进入 Dashboard。
- [ ] 所有 Negative Path 匹配冻结 Contract，且不创建 Partial Row。
- [ ] Gateway 绝不缓存 Private 或 `Set-Cookie` Response，也不能削弱 Provenance Check。
- [ ] Database 无 Plaintext Password，Web 无法读取 JWT。

**证据：** Integration Transcript/Test、Database Inspection、Browser Storage/Cookie Evidence 与 Gateway Cache-header Result。  
**非目标：** Public Internet Exposure 或 Provider Integration。

### ISSUE-030 — [I-02] 集成 Login 与 Session Path

- **状态：** `TODO`
- **Labels：** `type:integration`、`area:web`、`area:api`、`area:auth`、`priority:p0`
- **Blocked by：** ISSUE-022、ISSUE-025、ISSUE-027
- **PR Boundary：** 一个 Login/Session-integration PR

**目标**

跨 Web/API 验证真实 Login、Restore、Expiry、Logout、Error、Cache 与 Policy-evolution Behavior。

**工作**

- [ ] 覆盖 Valid/Wrong/Unknown Credential、Dummy-hash Path、Cookie Set/Delete Parity、No-store Restore、Expiry、Redirect、Outage 与 Logout。
- [ ] 模拟 Creation-policy Change，并重新尝试 Previously Stored Credential。
- [ ] 验证 Same-origin Return Path 与 Gateway Behavior。

**审核/验收**

- [ ] 成功进入 Dashboard；Refresh 可恢复 Session，且不产生 Write 或 Shared Cache。
- [ ] 两种 Invalid-credential 原因在外部保持完全一致。
- [ ] Expiry 无 Loop/Private Flash 地返回 Login；Outage 为 Recoverable Non-`401` State。
- [ ] Logout 清除 Cookie Tuple 与 Client State。
- [ ] Login 时 Existing Stored Credential 绕过新的 Creation-policy Check。

**证据：** Cross-layer Integration Test、Redirect/Outage Matrix、Cookie/Cache Proof、Dummy-path Proof 与 Policy-change Regression。  
**非目标：** Refresh Rotation 或 Active Token Revocation。

### ISSUE-031 — [E2E-01] 自动化关键 Browser Journey

- **状态：** `TODO`
- **Labels：** `type:test`、`area:e2e`、`area:auth`、`priority:p0`
- **Blocked by：** ISSUE-019、ISSUE-029、ISSUE-030
- **PR Boundary：** 一个 Critical-path Browser Automation PR

**目标**

以适合 CI、可重复且隔离的 Browser Automation 保护 Main User Journey。

**工作**

- [ ] 自动化 Sign Up → Automatic Dashboard → Dashboard/Flight Info/User Navigation → Refresh Restore → Logout → Login。
- [ ] 覆盖 Duplicate Registration、Password-policy Failure、Wrong Credential 与 Unauthenticated Protected Access。
- [ ] 隔离 Database State，并清理 Screenshot、Video、Trace 与 Log。

**审核/验收**

- [ ] 测试在 CI 中重复通过，不依赖顺序、不用 Retry 掩盖缺陷、不用 Production Data 或真实 External Provider。
- [ ] Locator 使用 Accessible Role/Name，Assertion 验证 User-observable State。
- [ ] Failure Artifact 不含 Entered Password、Cookie/Token Value 或 Connection Secret。
- [ ] 故意破坏其底层 Contract 时，每个 Critical Transition 都会明确失败。

**证据：** Repeated CI Run、Test-to-journey Map 与 Sanitized Failure-artifact Inspection。  
**非目标：** Exhaustive Browser/Device Coverage 或 Public Load Testing。

### ISSUE-032 — [Q-01] 执行完整 Quality 与 Security Review

- **状态：** `TODO`
- **Labels：** `type:quality-gate`、`area:security`、`priority:p0`
- **Blocked by：** ISSUE-016、ISSUE-024、ISSUE-028、ISSUE-031，以及所有 Transitive First-slice Work
- **PR Boundary：** Evidence/Review Issue；Fix 保留为链接回本 Issue 的聚焦 PR

**目标**

判断 Local Auth Vertical Slice 是否适合 Handoff，但不暗示已达到 Public-release Readiness。

**工作**

- [ ] 运行所有 Local/CI Format、Lint、Type、Unit、Integration、Component、E2E 与 Production-build Gate。
- [ ] 审计 Dependency、Action Pin、Workflow Permission/Event/Cache Trust、Required Check、Rule、Ownership、Proxy/CORS/Origin、Cookie/Cache、Database Privilege、Log/Response、Environment File、Password Dataset/Policy、Accessibility 与 English Catalog。
- [ ] 记录 Risk、Owner、Remediation Issue 与任何 Accepted Limitation。

**审核/验收**

- [ ] 所有 Authoritative Check 通过，且 Required Result 不会因 Path Skip 永久 Pending。
- [ ] 不存在 Skipped Test、Mutable Workflow Dependency、Hard-coded Secret、Unexplained TODO 或 Unresolved High-severity Supported Scan Finding。
- [ ] Security/Privacy/Accessibility Finding 均有 Evidence 与 Owner。
- [ ] Review 明确说明只授权 Local Handoff；D-19/R-14 仍阻止 Public Exposure。

**证据：** Signed Checklist、CI/Security Scan Link、Risk Register 与 Remediation Issue Link。  
**非目标：** Production Approval，或为进度豁免 Failed Gate。

### ISSUE-033 — [H-01] 同步文档并移交当前 Slice

- **状态：** `TODO`
- **Labels：** `type:docs`、`area:documentation`、`priority:p0`
- **Blocked by：** ISSUE-032
- **PR Boundary：** 一个 Documentation/Status Closeout PR

**目标**

为 New Engineer 与 Future Session 留下唯一、最新、可复现的 Implemented Local Slice 描述。

**工作**

- [ ] 在权威英文文档中更新 Actual Version、Structure、Command、Environment Variable、Migration、Contract、Test、Risk 与 Status。
- [ ] 同步每个已有 `_ZH.md` 跟随版，包括 Task/Decision/Issue ID 与 Dependency。
- [ ] 删除或解释 Stale Statement/Residue，并保持 Public-release Gate 明确关闭。

**审核/验收**

- [ ] 使用 English Docs，Clean-checkout Developer 即可启动并验证系统。
- [ ] 文档与 Code、Migration、Runtime Behavior 和 GitHub Check 一致。
- [ ] Local Link、English-primary Check、Stable ID/Status Parity 与 Follower Structure 通过。
- [ ] 不在无 Evidence 时声称存在 Implementation Artifact，且不遗留 Temporary Handoff Residue。

**证据：** Clean-start Transcript、Documentation Validation Output、Synchronized Status Diff 与 Residual-risk List。  
**非目标：** Public Deployment 或静默关闭后续 Backlog。

## 6. Post-MVP Issue 规格

这些草案仍在 First-slice Implementation Authority 之外。开始标记为 `Epic` 的条目前，必须创建并链接 Outcome-sized Child Issue；每个 Child Issue 都需要自己的 Test、Rollback Boundary 与 Acceptance Evidence。

### ISSUE-034 — [R-01] 建立 Swagger/OpenAPI 与 Generated Client

- **状态：** `TODO (later)`
- **Labels：** `type:feature`、`area:api`、`area:web`、`area:contract`、`scope:post-mvp`
- **Blocked by：** ISSUE-033
- **PR Boundary：** 先建立 Contract Foundation，再采用 Generated Client；若 Diff 无法连贯审核则拆分

**目标**

让 OpenAPI 成为可复现 REST Contract Source，并移除 Web 中手工重复的 Response Model。

**工作**

- [ ] 记录当前 Schema、Cookie Authentication、Error Code、Response Header 与 Safe Example。
- [ ] 确定性生成 `packages/api-client`，并添加 CI Drift Detection。
- [ ] 定义 Breaking Change 与 Generation-tool Upgrade 的 Review/Version/Migration Policy。

**审核/验收**

- [ ] Generated Output 可从 Clean Checkout 复现，且永不手工编辑。
- [ ] Web 对已迁移 Endpoint 使用 Generated Contract，并删除重复 Manual Model。
- [ ] Auth Cookie、`no-store`、Error 与 Sensitive-field Exclusion 被准确表示。
- [ ] Contract/Generated Drift 会使 CI 失败；Breaking Change 包含 Migration Guidance。

**证据：** Generation Command/Output Hash、Drift Negative Test、Contract Test 与 Web Adoption Proof。  
**非目标：** 仅为迁就 Generator 改变 Endpoint Semantics。

### ISSUE-035 — [R-02] 添加 Public-exposure Authentication Control

- **状态：** `TODO (later)`
- **Labels：** `type:epic`、`area:security`、`area:api`、`area:redis`、`scope:post-mvp`
- **Blocked by：** ISSUE-033；建议以 ISSUE-034 为 Contract Prerequisite
- **PR Boundary：** Epic；将 Rate Limiting、Header/Proxy、Audit、Outage Behavior 与 Runbook 拆成 Child Issue

**目标**

在任何 Public/Shared Authentication Endpoint 存在前，补齐强制 Abuse-resistance 与 Operational Gap。

**工作**

- [ ] 为 Auth 与未来 Mail Endpoint 添加 Redis-backed Distributed Limit，包含已批准 Dimension、Threshold、Override、Privacy-safe Identifier 与 Operator Runbook。
- [ ] 添加 Safe Audit Event、Security Header、显式 Proxy-trust Validation 与有记录的 Abuse Response。
- [ ] 定义并测试跨 Replica 的 Redis/Network Outage Fail-open/Fail-closed Behavior。

**审核/验收**

- [ ] Limit 跨 Replica 工作，且不能通过伪造 Forwarding Header 或简单 Key Variation 绕过。
- [ ] Audit/Log Data 不含 Credential、Token 或不必要 Personal Data，并有 Retention/Access Ownership。
- [ ] Header、Proxy Topology、Override Control 与 Degraded Behavior 均有真实 Integration Test 和 Operational Evidence。
- [ ] 本 Epic 与所有 Mandatory Child 必须在 R-14 前关闭。

**证据：** Distributed Integration/Load Test、Spoofing Test、Outage Exercise、Header Scan、Audit Sample 与 Runbook Drill。  
**非目标：** 宣称整个产品已 Production-ready，或在 Production 使用 In-memory Limit。

### ISSUE-036 — [R-03] 添加 Refresh-token Rotation 与 Revocation

- **状态：** `TODO (later)`
- **Labels：** `type:epic`、`area:security`、`area:auth`、`area:database`、`area:redis`、`scope:post-mvp`
- **Blocked by：** ISSUE-033、ISSUE-035 与已批准 Session/Device Semantics；建议先完成 ISSUE-034
- **PR Boundary：** Epic，包含 Design、Persistence、API、Web 与 Security-test Child

**目标**

支持可 Rotation、Replay Detection 与 Revocation 的 Longer Session，同时不削弱 Cookie/CSRF Control。

**工作**

- [ ] 批准 Session/Device/Family Semantics、Hashed Refresh Record、TTL、Key Rotation、Reuse Detection、Family Revocation 与 Redis/Database Responsibility。
- [ ] 实现 Rotation Concurrency、Logout/Security-event Revocation、Cookie Transport 与 Degraded-state Behavior。
- [ ] 添加 Migration、Cleanup、Operator 与 Incident Runbook。

**审核/验收**

- [ ] Refresh Secret 不以可恢复形式存储，也不暴露给 JavaScript/Log。
- [ ] Replay Old Refresh Token 会撤销预期 Family；Concurrent Legitimate Refresh Behavior 为确定性。
- [ ] Logout/Security Event 会撤销 Session，Key/Redis/Database Outage 有经过测试的安全行为。
- [ ] Cookie、Origin/CSRF、TTL、Cleanup、Migration 与 Rollback Evidence 与 Approved Design 一致。

**证据：** Approved Design、Threat Model、Migration Test、Replay/Concurrency Suite、Outage Exercise 与 Revocation Demonstration。

**非目标：** OAuth/Social Login，或静默改变 Access-token Contract。

### ISSUE-037 — [R-04] 添加 Mail Foundation 与 Email Verification

- **状态：** `TODO (later)`
- **Labels：** `type:epic`、`area:auth`、`area:mail`、`area:database`、`scope:post-mvp`
- **Blocked by：** ISSUE-034、ISSUE-035，以及已批准 Provider/Domain/Bounce/Template Design
- **PR Boundary：** Epic，包含 Provider Foundation、Schema/Token、API、Template 与 E2E Child

**目标**

通过 Privacy-safe、Observable、Single-use Delivery 验证 Email Ownership，且不泄露 Account Existence。

**工作**

- [ ] 决定 Unverified-user Permission、Provider/Local Capture、Sender Domain、Bounce Handling、Template、Retention 与 Delivery Observability。
- [ ] 添加 `email_verified_at`、Hashed Random One-time Token、TTL、Resend Throttle、Verify/Resend API、Audit Event 与 Migration。
- [ ] 自动化 Registration-to-verification 与 Failure Path。

**审核/验收**

- [ ] Raw Token 无法从 Storage/Log 恢复；Expired、Replayed 与 Forged Token 均安全失败。
- [ ] Resend 与 Public Response 不暴露 Account Existence，并跨 Replica Rate-limit。
- [ ] Delivery/Bounce Failure 可观测、可操作，且不记录 Sensitive Content。
- [ ] Migration/Backfill、Template Accessibility/Localization Boundary 与 Full Automation 通过。

**证据：** Threat Model、Migration/Token Test、Mail-capture E2E、Enumeration Comparison、Delivery Dashboard 与 Runbook。  
**非目标：** Marketing Email 或 Password Reset。

### ISSUE-038 — [R-05] 添加 Forgot/Reset Password

- **状态：** `TODO (later)`
- **Labels：** `type:feature`、`area:auth`、`area:mail`、`area:security`、`scope:post-mvp`
- **Blocked by：** ISSUE-035、ISSUE-036、ISSUE-037
- **PR Boundary：** 如有需要拆分 Request 与 Reset Completion；两者均关闭后才关闭本 Issue

**目标**

允许安全 Password Recovery，同时避免 Account Enumeration、Reusable Token 或 Compromised Session 继续有效。

**工作**

- [ ] 添加 Generic Request Response、Hashed Random Single-use Short-TTL Reset Token、Rate Limit、Notification Mail、Audit 与 Secure Password Replacement。
- [ ] 应用届时 Current PasswordPolicy，并在成功后撤销之前 Session。
- [ ] 定义 Delivery Failure、Concurrency、Replay 与 Operator Behavior。

**审核/验收**

- [ ] Unknown/Existing-account Request Response 在外部一致。
- [ ] Token 不被记录或恢复，且 Use/Expiry 后不能 Replay。
- [ ] New Password 遵循 Current Policy；Old Password 与 Prior Session 停止工作。
- [ ] Rate-limit、Delivery、Audit、Concurrency 与 Abuse Case 均有 Automated Coverage。

**证据：** Enumeration/Replay Test、Mail E2E、Session-revocation Proof、Audit Sample 与 Rate-limit Test。  
**非目标：** Support-agent Password Assignment 或 Security-question Recovery。

### ISSUE-039 — [R-06] 建立 Account Lifecycle Status

- **状态：** `TODO (later)`
- **Labels：** `type:feature`、`area:domain`、`area:auth`、`area:data-governance`、`scope:post-mvp`
- **Blocked by：** ISSUE-033 与已批准 Business/Operations Semantics
- **PR Boundary：** Design/Domain/Migration 优先；Behavior 可拆为 Child Issue

**目标**

只引入具有明确 Business Transition、Authorization、Retention、Recovery 与 Operations 支撑的 Lifecycle State。

**工作**

- [ ] 决定 `active`、`suspended`、`deactivated` 与 `deleted` 是否真正不同且必要。
- [ ] 定义 Transition Authority、Login/Session Effect、Data Retention/Deletion、Recovery、Audit、Migration/Backfill 与 Repair。
- [ ] 实现 Typed Domain Service 与 Guard，而不是 Free-form Conditional。

**审核/验收**

- [ ] 不存在 Ambiguous/Free-form State；每个 State/Transition 都有一个已记录 Meaning 与 Owner。
- [ ] Unauthorized Transition 与 Bypassed Login/Session Path 被拒绝并测试。
- [ ] Audit、Retention、Recovery、Default/Backfill、Repair 与 Compatibility Behavior 一致。
- [ ] UI Copy 不暴露 Sensitive Suspension/Security Detail。

**证据：** Approved Design/State Diagram、Permission Matrix、Migration Test、Transition Suite、Audit Sample 与 Operations Runbook。

**非目标：** 在无已批准 Restricted Operation 时实现 RBAC，或默认 Irreversible Hard Deletion。

### ISSUE-040 — [R-07] 建立 RBAC 与 Authorization

- **状态：** `TODO (later)`
- **Labels：** `type:epic`、`area:authorization`、`area:api`、`area:web`、`scope:post-mvp`
- **Blocked by：** ISSUE-033、一个已批准 Restricted Operation/Use Case；仅在依赖 Status 时要求 ISSUE-039
- **PR Boundary：** Epic，包含 Matrix/Schema、API Enforcement、Administration、UI 与 Test Child

**目标**

从真实 Operation 推导并强制 Deny-by-default Permission Model，而不是推测 Role Name。

**工作**

- [ ] 批准 Permission Matrix 与 Role/Permission/Assignment Schema，包含 Administration/Audit Boundary。
- [ ] 在 Business/API Boundary 实现 NestJS Authorization，并可选进行 Web Navigation Filtering。
- [ ] 添加 Migration、Least-privilege Administration、Escalation、Stale-session 与 Change-propagation Behavior。

**审核/验收**

- [ ] API 独立拒绝 Unauthorized 与 Privilege-escalation Attempt；隐藏 Navigation 永不视为 Security。
- [ ] Permission Matrix、Schema、Guard/Policy、Management Endpoint 与 Test 一致。
- [ ] Role/Permission Change 经授权、被审计，并按已批准 Session/Cache Semantics 生效。
- [ ] 不存在 Default Wildcard 或 Owner Bypass。

**证据：** Permission Matrix、Threat Model、Migration Test、Negative Authorization Suite、Audit Sample 与 UI/API Comparison。  
**非目标：** 在没有真实 Restricted Operation 时创建 Role。

### ISSUE-041 — [R-08] 添加简体中文 Product Localization

- **状态：** `TODO (later)`
- **Labels：** `type:feature`、`area:web`、`area:i18n`、`area:accessibility`、`scope:post-mvp`
- **Blocked by：** ISSUE-014、ISSUE-033
- **PR Boundary：** 一个 Locale Framework/Preference Change，加 Reviewed Catalog Content

**目标**

添加 `zh-CN`，不重复 Component Logic，也不破坏 Routing、Formatting、Accessibility 或 Narrow Layout。

**工作**

- [ ] 根据 SEO 与 Preference Requirement 决定 Locale URL/Persistence。
- [ ] 添加 Switcher、`zh-CN` Catalog、Fallback、Date/Time/Number/Currency Formatting 与 Translation QA Workflow。
- [ ] 在 CI 强制 Missing/Extra Key Parity。

**审核/验收**

- [ ] English 与 `zh-CN` Catalog 完整，Component Code 不按复制 Prose 分支。
- [ ] Preference 可跨 Refresh 保留，Server/Client Locale Output 不产生 Hydration 差异。
- [ ] Date/Number/Currency 与 `lang` Attribute 符合 Locale。
- [ ] Keyboard/Screen-reader Behavior 与 Narrow Layout 均适配两种语言。

**证据：** Key-parity Test、Locale Persistence/SSR Test、Bilingual Screenshot 与 Translation/Accessibility Review。  
**非目标：** 其他 Locale，或未经 Human QA 的 Automated Translation。

### ISSUE-042 — [R-10] 完成 Privacy、Data Governance 与 Threat Modeling

- **状态：** `TODO (later)`
- **Labels：** `type:epic`、`area:security`、`area:privacy`、`area:governance`、`scope:post-mvp`
- **Blocked by：** ISSUE-033；每次引入 Provider 或新 Sensitive Data Class 时重新审视
- **PR Boundary：** Epic，包含 Inventory、Threat Model、Provider Review、Lifecycle 与 Incident/Runbook Child

**目标**

在 External Travel/Model Provider 或 Public Exposure 前建立已批准的 Data 与 Trust-boundary Baseline。

**工作**

- [ ] 盘点 Personal、Travel、Payment-adjacent、Log/Trace、Prompt、Tool 与 Provider Data Flow。
- [ ] 定义 Purpose/Consent、Minimization、Retention/Deletion/Export、Regional/Vendor Constraint、Access、Redaction 与 Incident Handling。
- [ ] 对 Prompt Injection、Tool Authorization、Cross-user/Tenant Isolation、Provider Data Use 与 Abuse Case 建立 Threat Model。

**审核/验收**

- [ ] 每个 Sensitive Field 都有 Purpose、Owner、Source、Destination、Retention、Access 与 Deletion/Export Path。
- [ ] Trust Boundary 与 Provider Contractual/Configuration Posture 获得明确批准。
- [ ] High-risk Abuse Case 有 Tested Mitigation 或 Executable Runbook。
- [ ] Log/Trace/Evaluation 使用最小化或 Synthetic Data，并演示 Deletion Behavior。

**证据：** Data-flow Diagram、Inventory、Threat Model、Provider Review、Retention/Deletion Test 与 Incident Tabletop。  
**非目标：** 仅凭 Engineering Documentation 提供 Legal Guarantee。

### ISSUE-043 — [R-09] Containerize 并建立 GitHub Delivery/Operations

- **状态：** `TODO (later)`
- **Labels：** `type:epic`、`area:infrastructure`、`area:delivery`、`area:operations`、`priority:p0`、`scope:post-mvp`
- **Blocked by：** ISSUE-033，以及已批准 Platform、Region、Registry、Environment、Domain/TLS、Ownership、RPO/RTO/SLO Input
- **PR Boundary：** Epic；必须包含 Image Benchmark、Image、Trusted Build/Publish、Staging、Production Gate、Migration、Observability、Backup/Restore 与 Rollback Child

**目标**

一次构建可复现 Non-root Web/API Image，并将相同 Verified Digest 安全、可观测地 Promote 到各 Environment。

**工作**

- [ ] 对版本固定的 LTS Debian Slim 与 Alpine Candidate 进行 Benchmark，覆盖 `glibc`/`musl`、Native Addon、Next Artifact、Architecture、Update Latency、Cold/Warm Build、Size、Startup、Scan 与 Smoke Behavior。
- [ ] 创建 Minimal Multi-stage Image，具有 Filtered Artifact、Frozen Install、Safe Cache、Read-only Runtime Posture、Health/Shutdown Behavior，且不含 Build Tool/Secret。
- [ ] 从 Trusted Commit 出发，执行 Scan、SBOM、Attest、发布 Immutable Digest，并用 Scoped OIDC 与显式 Migration Job 将同一 Digest Promote 到 Protected Environment。
- [ ] 建立 Smoke、Rollback、Backup/Restore Exercise、Log/Redaction、Dashboard、SLO/Alert、Concurrency、Approval 与 On-call Runbook。

**审核/验收**

- [ ] Base-image 选择基于实测 Compatibility/Value，绝不只看 Size。
- [ ] Image 可复现、Digest-pinned、Non-root、通过 Architecture Test，且不含 Development Dependency、Cache、Toolchain 或 Secret。
- [ ] PR Code 不能访问 Deployment Credential/Production；OIDC 按 Ref/Environment 限定 Scope。
- [ ] Staging/Production 运行同一 Approved Digest；Web/API 可独立 Deploy 与 Rollback。
- [ ] Restore 满足已批准 RPO/RTO；Health、Shutdown、Migration Ownership、SLO、Alert、Approval 与 Concurrency Control 均经过演练。

**证据：** Child-issue Closure、Benchmark 与 Selection Rationale、Image Inventory/Scan/SBOM/Attestation、OIDC Policy、Deployment/Rollback Log、Restore Report、Dashboard 与 Runbook Drill。

**非目标：** Input 获批前选择 Platform，或把 Production Data 存入 Application Container。

### ISSUE-044 — [R-11] 设计并验证 Vector Retrieval

- **状态：** `TODO (later)`
- **Labels：** `type:epic`、`area:agent`、`area:database`、`area:retrieval`、`scope:post-mvp`
- **Blocked by：** ISSUE-042，以及已批准 Use Case、Corpus、Embedding Model/Version、Privacy Class 与 Evaluation Metric
- **PR Boundary：** Design/Evaluation 优先；获批后再创建 Schema/Ingestion/Query Child

**目标**

添加任何 Vector Schema/Index 前，证明 Retrieval Quality、Privacy、Lifecycle 与 Cost。

**工作**

- [ ] 在 `PLANS.md` 中记录并批准 Vector Design，覆盖 Extension Provisioning、Schema Ownership、Chunking、Metadata/Tenant Isolation、Dimension、Distance、Index、Filter、Versioning/Re-embedding 与 Deletion。
- [ ] 为 Recall/Quality、Latency 与 Cost 建立 Offline Representative Evaluation。
- [ ] 设计 Migration、Ingestion、Delete、Re-embed 与 Rollback Path。

**审核/验收**

- [ ] Approved Design/Evaluation 前不创建 Vector Table/Column/Index。
- [ ] Representative Quality/Latency/Cost Threshold 通过，Model/Corpus Version 可复现。
- [ ] Cross-user/Tenant 与 Sensitive-data Isolation 有直接 Negative Test。
- [ ] Delete/Re-embed 与 Schema/Index Change 由 Migration 驱动且可观测。

**证据：** Approved Plan、Versioned Evaluation Dataset/Result、Isolation Test、Migration Plan 与 Cost Record。

**非目标：** 仅因已安装 pgvector 就使用 Vector。

### ISSUE-045 — [R-12] 实现首个 Travel-agent Vertical Slice

- **状态：** `TODO (later)`
- **Labels：** `type:epic`、`area:agent`、`area:api`、`area:web`、`priority:p1`、`scope:post-mvp`
- **Blocked by：** ISSUE-042，以及已批准 Travel Use Case/Provider/Tool/Streaming/Human-approval/Evaluation Input；仅在需要 Retrieval 时依赖 ISSUE-044
- **PR Boundary：** Epic，包含 Graph、各 Tool Adapter、Streaming/API、Web Consumption、Safety 与 Evaluation Child

**目标**

通过 Backend-only LangGraph Boundary 交付一个可测量 Travel-agent Use Case，不向 Browser 提供 Model Credential 或 Tool Authority。

**工作**

- [ ] 创建真实 NestJS `AgentModule`、Typed State/Graph/Node Routing、Tool Port 与 Authenticated Streaming Contract。
- [ ] 添加 Strict Tool Schema、Authorization、Cancellation、Timeout、Bounded Retry、Idempotency/Compensation、Cost Limit 与 Provider Degradation Behavior。
- [ ] 添加 Web Progress/Result Consumption、包含 User/Thread/Run/Correlation ID 的 Privacy-safe Tracing，以及对 Risky Side Effect 的显式 Human Approval。

**审核/验收**

- [ ] Browser 无 Model Key 或直接 Privileged Tool Access；NestJS Authorization 为最终 Authority。
- [ ] Prompt-injection/Tool-output Validation、Cross-user Isolation、Retry/Idempotency、Cancellation、Timeout、Side-effect 与 Cost-limit Test 通过。
- [ ] Deterministic Graph Test、Recorded/Mock Provider Contract 与 Independent Evaluation 达到已批准 Threshold。
- [ ] 记录 Persistence/Recovery/Streaming Semantics，以及提取 `apps/agent` 的 Trigger。

**证据：** 已关闭 Child Issue、Architecture/Sequence Diagram、Test/Evaluation Report、Trace/Redaction Sample、Safety Review 与 Cost/Degradation Exercise。  
**非目标：** Generic Autonomous Platform、Unbounded Tool 或仅依赖 Process Memory 的 Production Recovery。

### ISSUE-046 — [R-13] 基于 Evidence 重审 Password Policy

- **状态：** `TODO (later)`
- **Labels：** `type:research`、`area:auth`、`area:security`、`area:ux`、`scope:post-mvp`
- **Blocked by：** ISSUE-033，以及已批准 Usage/Support Evidence 或新 Compliance/MFA Requirement
- **PR Boundary：** Decision/Contract 优先；获批后才 Implementation

**目标**

在不暴露 Password Data 或破坏 Existing Login 的前提下，决定是否放宽最初 8–20 Composition Policy。

**工作**

- [ ] 审查 Privacy-safe Abandonment/Support Evidence 与适用 Current Guidance。
- [ ] 比较更长 Maximum、更广 Character、Passphrase 与移除 Composition Rule，同时保留 Blocklist 与 Argon2id。
- [ ] 若 Change 获批，则更新唯一 Policy、UI/API Contract、Message、Test 与同步文档。

**审核/验收**

- [ ] Evidence 不含 Password 或 Reversible Derivative，并支持一个 Documented Decision。
- [ ] Sign-up/Reset/Change Behavior 与 Message 匹配 Approved Policy。
- [ ] Login Compatibility 证明 Existing Hash/User 仍有效。
- [ ] Validation-only Change 不引入不必要的 User-table/Data Migration。

**证据：** Privacy-reviewed Analysis、Decision Record、Boundary Test、Compatibility Test 与 Synchronized Contract Docs。  
**非目标：** 静默强迫 Existing User Rotation，或从 Hash 推断 Old-password Compliance。

### ISSUE-047 — [R-14] 审核并授权 Public Exposure

- **状态：** `BLOCKED (later)`
- **Labels：** `type:release-gate`、`area:security`、`area:operations`、`priority:p0`、`scope:public-release`
- **Blocked by：** ISSUE-032、ISSUE-033、ISSUE-035、ISSUE-042、ISSUE-043，以及 Intended Release 包含的所有 Feature
- **PR Boundary：** Evidence/Sign-off Gate；Fix 使用独立 Issue/PR

**目标**

让 Public Exposure 成为显式、Evidence-backed Owner Decision，而不是 Local Completion 的意外结果。

**工作**

- [ ] 冻结 Release Scope，并执行 Release Threat Model、External-surface/Configuration/Secret Scan、Load/Abuse Test、Accessibility Review、Backup/Restore Review、Observability/Incident Drill 与 Rollback Rehearsal。
- [ ] 验证每个 Environment、Migration、Provider、Privacy、Security、SLO、Ownership 与 On-call Prerequisite。
- [ ] 仅在所有 Blocking Evidence 通过后，由 Owner 明确授权 Public Release。

**审核/验收**

- [ ] 每个 Release Criterion 都有 Current Evidence 与 Accountable Owner。
- [ ] 不存在 Open High-severity Finding、Failed Restore/Rollback、Unknown Secret Source 或 Unowned Alert。
- [ ] Production Approval、OIDC、Concurrency、Migration、Smoke、Rollback 与 Incident Path 均已演练。
- [ ] `@Donny-Guo` 明确批准 Public Exposure；Local Handoff 或 Green Feature PR 不能满足本 Gate。

**证据：** Signed Release Checklist、Scan/Load/Accessibility Report、Restore/Rollback/Incident Drill Record、Dependency Closure 与 Explicit Authorization。  
**非目标：** Schedule-based Waiver，或将 AI Review 视为 Release Approval。
