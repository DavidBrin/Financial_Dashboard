# Financial Command Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a polished, responsive financial command-center demo with interactive management flows, real-but-unhandled HTTP commands, connector ABC skeletons, automated tests, and a Vercel Hobby runbook.

**Architecture:** A Vite React SPA renders deterministic read models behind domain types. Mutations pass through a typed fetch gateway that stages failed requests locally. A separate `connectors/` TypeScript project holds server-side provider abstractions and never enters the browser bundle.

**Tech Stack:** React 19, TypeScript, Vite, Wouter, Lucide, authored CSS, Vitest, Testing Library, Playwright, ESLint.

## Global Constraints

- Build from `origin/dev` on `agent/financial-command-center`; never commit implementation to `main` or `dev`.
- Primary routes are `/`, `/manage/cash`, `/manage/investments`, `/manage/subscriptions`, `/manage/property`, `/manage/credit`, `/manage/insurance`, and `/manage/business`.
- Every dashboard rail has a visible `Manage …` route and keyboard-operable previous/next controls; rails never auto-advance.
- Every card exposes its details on hover, focus, and explicit click/tap.
- Every mutation sends a real `fetch` request under `/api/v1`, uses an idempotency key, validates JSON responses, and stages an intelligible demo result when no backend receives it.
- Browser code never imports the root-level `connectors/` package.
- The design uses Ledger Ink `#10363D`, Fog `#EEF3F1`, Porcelain `#FAFCFB`, Copper Signal `#E77745`, Seagrass `#4B7D70`, Berry `#B64F5A`, and Slate `#587078`.
- Responsive layouts support 320 CSS pixel viewports, visible focus, 44px touch targets, reduced motion, and mobile bottom navigation.
- Vercel deploys `npm run build` output from `dist/`; the README documents Hobby restrictions and both dashboard and CLI deployment.

---

### Task 1: Application foundation and executable test harness

**Files:**
- Create: `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `index.html`
- Create: `src/main.tsx`, `src/test/setup.ts`, `src/styles/tokens.css`, `src/styles/global.css`
- Create: `playwright.config.ts`, `tests/e2e/`

**Interfaces:**
- Produces scripts `dev`, `build`, `preview`, `lint`, `typecheck`, `test`, and `test:e2e`.
- Produces a `@/*` alias for `src/*`.

- [ ] Create the Vite React/TypeScript configuration and install exact dependencies with npm.
- [ ] Add a smoke test that imports the future router and fails because it does not exist; run it and observe the expected module failure.
- [ ] Add the minimal router shell needed for the smoke test to pass, then run it green.
- [ ] Commit the foundation so independent worktrees can branch from one stable base.

### Task 2: Domain fixtures and dashboard experience

**Files:**
- Create: `src/domain/finance.ts`, `src/data/demoData.ts`, `src/lib/format.ts`, `src/lib/format.test.ts`
- Create: `src/app/router.tsx`, `src/app/AppShell.tsx`, `src/pages/DashboardPage.tsx`
- Create: `src/components/OverviewHero.tsx`, `src/components/FinanceRail.tsx`, `src/components/FinanceRail.test.tsx`, `src/components/FinanceCard.tsx`, `src/components/FinanceCard.test.tsx`, `src/components/icons.tsx`
- Create: `src/styles/app.css`, `src/styles/dashboard.css`

**Interfaces:**
- Produces `FinanceSection`, `FinanceItem`, `DetailRow`, `AttentionItem`, `dashboardSections`, and tested `formatCurrency`, `formatCompactCurrency`, `formatPercent`, `formatDate`.
- `FinanceRail` consumes `{ section: FinanceSection }` and routes to `/manage/${section.slug}`.

- [ ] Write literal unit expectations for currency, percent, and date formatting; run them red before adding formatters.
- [ ] Write component tests proving disclosure works by keyboard/click and a rail reaches its management route; run them red before implementation.
- [ ] Implement realistic fixtures for all seven domains, including recent cash transactions, investment holdings, renewal information, equity, debt utilization, policy renewal, and business invoices.
- [ ] Implement the app shell, airy overview, attention queue, seven labeled rails, receipt drawers, desktop side rail, and mobile bottom nav.
- [ ] Run focused tests, refactor after green, and commit.

### Task 3: Command gateway and staged demo mutations

**Files:**
- Create: `src/data/commands.ts`, `src/data/commands.test.ts`, `src/hooks/useDemoCommand.ts`

**Interfaces:**
- Produces `DemoCommand`, `CommandResult`, `CommandGateway`, `FetchCommandGateway`, `stageCommand`, `listStagedCommands`, and `useDemoCommand`.
- `FetchCommandGateway.send(path, method, payload, signal?)` returns `{ status: 'sent' | 'staged'; requestId: string; message: string }`.

- [ ] Write tests for the exact URL, HTTP method, JSON body, `Content-Type`, `X-Idempotency-Key`, JSON success envelope, network fallback, and non-JSON `200` fallback.
- [ ] Run those tests and confirm they fail because the gateway does not exist.
- [ ] Implement the smallest gateway and local staging store that satisfy the contract, including abort timeout and local-storage failure fallback.
- [ ] Add the React hook with duplicate-submit protection and status reset, run the focused suite green, and commit.

### Task 4: Management pages and subscription cancellation flow

**Files:**
- Create: `src/pages/ManageSectionPage.tsx`, `src/pages/ManageSectionPage.test.tsx`, `src/pages/NotFoundPage.tsx`
- Create: `src/components/ManagementRow.tsx`, `src/components/ConfirmDialog.tsx`, `src/components/ToastRegion.tsx`
- Create: `src/styles/management.css`
- Modify: `src/app/router.tsx`

**Interfaces:**
- Consumes `FinanceSection`, fixture data, and `useDemoCommand`.
- Produces management views for all seven slugs and staged cancellation/undo behavior for subscriptions.

- [ ] Write route tests for every management slug and behavior tests for subscription filtering, confirmation, pending state, staged success with request ID, and undo; run them red.
- [ ] Implement a shared spacious management layout with totals, search/filter, sync health, responsive rows, and contextual action buttons.
- [ ] Implement `POST /api/v1/subscriptions/:id/cancellation-requests` with confirmation and staged/undo UI; wire generic refresh, hide, reconnect, and update actions to appropriate `/api/v1` endpoints.
- [ ] Add the useful not-found state, run focused tests green, and commit.

### Task 5: Connector ABC package

**Files:**
- Create: `connectors/package.json`, `connectors/tsconfig.json`
- Create: `connectors/src/core/types.ts`, `connectors/src/core/errors.ts`, `connectors/src/core/connector.ts`
- Create: `connectors/src/categories/*.ts`, `connectors/src/index.ts`
- Create: `connectors/src/testing/InMemoryBankConnector.ts`, `connectors/src/connector.test.ts`

**Interfaces:**
- Produces `BaseConnector`, typed capability declarations, normalized results, `ConnectorError`, and abstract banking, brokerage, subscription, property, business, insurance, and credit connectors.
- All asynchronous operations accept `AbortSignal`; sync uses a cursor and returns freshness/source metadata.

- [ ] Write a fake-connector test proving connect, health, cursor sync, normalized money, abort propagation, and typed error normalization; run it red.
- [ ] Implement shared contracts and category abstractions with no browser imports or raw secret persistence.
- [ ] Implement the in-memory fake, export the public surface, run connector tests and typecheck green, and commit.

### Task 6: Vercel runbook and integrated browser verification

**Files:**
- Modify: `README.md`
- Create: `vercel.json`
- Create: `tests/e2e/dashboard.spec.ts`, `tests/e2e/management.spec.ts`
- Create: `docs/evidence/desktop-dashboard.png`, `docs/evidence/mobile-dashboard.png`

**Interfaces:**
- Vercel rewrites application routes to `index.html` while the command gateway rejects HTML API fallbacks.

- [ ] Add README sections for scope, local setup, scripts, demo behavior, connector package, mock reset, future API base URL, Vercel Hobby eligibility, dashboard import, CLI deploy, and SPA rewrites.
- [ ] Add `vercel.json` with a static-asset-safe SPA catch-all rewrite.
- [ ] Write Playwright cases for desktop dashboard, all management routes, real failed API cancellation followed by staged state and undo, keyboard disclosure, horizontal rail controls, 390px mobile layout, and deep-link refresh.
- [ ] Run lint, application and connector typechecks, all unit tests, production build, and Playwright tests.
- [ ] Capture desktop and mobile full-page screenshots, inspect them, correct visual issues, and repeat verification.

### Task 7: Final current-diff review and publication

**Files:**
- Review all files changed from `origin/dev`.

**Interfaces:**
- Produces one current-diff Claude review record, one feature-branch commit series, and one draft pull request targeting `dev`.

- [ ] Inspect `git diff origin/dev...HEAD`, dependency changes, and repository status.
- [ ] Run the complete verification suite again and read every result.
- [ ] Send the safety-filtered final diff to Claude once with the authorized default model and `$50.00` cap; verify every finding locally and fix any confirmed blocker.
- [ ] If fixes occur, rerun the complete suite; do not make a second Claude call.
- [ ] Commit only in-scope files, push `agent/financial-command-center`, and open a draft PR to `dev` with research, verification, screenshots, Linear issue, and Claude-review provenance.
