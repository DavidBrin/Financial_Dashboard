# Financial Command Center Design

## Goal

Build a visibly complete, responsive personal-finance command center that gives one person a calm overview of every meaningful financial domain and lets them enter believable management flows. The site is a demo facade: it uses deterministic mock reads, sends real HTTP mutation requests to future-ready endpoints, and stages failed commands locally without pretending an institution completed them.

## Research brief

Connected-finance products consistently center four needs: total net worth, near-term cash visibility, control of recurring obligations, and long-term planning. Plaid's account model covers deposits, credit, loans, investments, mortgages, crypto, retirement, HSAs, annuities, and trusts; Akoya extends this picture to insurance and tax documents. Quicken and NerdWallet support adding property, vehicles, mortgages, loans, and business assets, while Rocket Money validates a dedicated subscription cancellation workflow.

The product therefore covers seven primary domains: banking and cash; investments and retirement; subscriptions and recurring bills; property and real estate; credit and debt; insurance and protection; and business finances. Goals, alerts, cash flow, and net worth connect those domains rather than becoming another dense section.

Sources:

- [Plaid accounts API](https://plaid.com/docs/api/accounts/)
- [Plaid personal financial insights](https://plaid.com/use-cases/personal-financial-insights/)
- [Akoya open-finance API stack](https://akoya.com/blog/the-open-finance-api-stack-securely-access-financial-data-with-akoya)
- [Quicken net-worth dashboard](https://info.quicken.com/sim/net-worth-dashboard)
- [Rocket Money subscriptions](https://www.rocketmoney.com/feature/manage-subscriptions)
- [W3C 320px horizontal panel technique](https://www.w3.org/WAI/WCAG22/Techniques/general/G225)
- [WAI carousel guidance](https://www.w3.org/WAI/tutorials/carousels/)
- [Vercel Vite deployment](https://vercel.com/docs/frameworks/frontend/vite)

## Architecture options

1. **Vite React single-page application — selected.** A typed component model, quick static build, straightforward routing, and inexpensive Vercel hosting fit a facade whose data is local today but whose boundaries must be real tomorrow.
2. **Next.js application.** Server routes and SSR would be useful for an actual financial platform, but they create unnecessary runtime and deployment complexity for this static demo and obscure the intentionally unhandled requests.
3. **Vanilla static site.** It would minimize dependencies but make seven routed management surfaces, mutation states, accessible disclosures, and connector-ready types harder to maintain and test.

The selected stack is React, TypeScript, Vite, Wouter, Lucide, Vitest, Testing Library, and Playwright. Styling uses authored CSS and explicit design tokens rather than a component framework. Wouter supplies the small client-route contract without the server/RSC surface and current audit findings of React Router. The connector SDK is a separate root-level TypeScript project and is never imported into the browser bundle because provider secrets belong on a server.

## Visual direction: private ledger, modern instrument

The page feels like a precisely made financial instrument rather than a generic blue-gradient fintech panel. The palette is cool and mineral: Ledger Ink `#10363D`, Fog `#EEF3F1`, Porcelain `#FAFCFB`, Copper Signal `#E77745`, Seagrass `#4B7D70`, Berry `#B64F5A`, and Slate `#587078`. Geologica carries headings, Source Sans 3 carries interface copy, and Spline Sans Mono carries money and metadata.

The signature interaction is a receipt drawer inside each account card. At rest, a card shows one dominant figure and one health signal. Hover, keyboard focus, or a touch disclosure slides a fixed-height drawer upward without moving neighboring content. A thin cash-flow tide line crosses the overview and echoes as a ledger tick on each card. Motion lasts 200ms and disappears under `prefers-reduced-motion`.

The desktop shell uses a slim left navigation rail. Mobile uses a compact header and fixed bottom navigation. Horizontal account rails reveal the edge of the next card, support native touch/trackpad scrolling, expose previous/next buttons, use scroll snap, never auto-advance, and keep each card within a 320 CSS pixel reading width on small screens.

## Information architecture

The dashboard opens with a greeting, sync status, net worth, monthly cash flow, upcoming obligations, goal progress, and a small attention queue. It then presents seven generous rails:

1. Banking and cash
2. Investments and retirement
3. Subscriptions and recurring bills
4. Property and real estate
5. Credit and debt
6. Insurance and protection
7. Business and taxes

Every rail has a `Manage …` link and cards backed by realistic mock data. The route `/manage/:section` shares a consistent title, aggregate summary, filters, connection health, responsive rows, and contextual actions. Subscription management receives the deepest workflow: active/needs-review/canceled filters, renewal and price-change details, cancellation confirmation, pending state, staged result, and undo. Other sections expose sync, hide, reconnect, remove, update, and inspect actions appropriate to their records.

## Data and command flow

Read models come from deterministic fixtures through a small repository module. User mutations go through a `CommandGateway`:

```text
click → confirm → pending → fetch('/api/v1/...', idempotency key)
      → network / 404 / non-JSON failure → stage command locally
      → visible “Demo mode: request staged” result + request ID
```

The gateway validates response content type so Vercel's SPA rewrite cannot turn an API miss into a false HTML `200` success. Commands have a unique request ID, timestamp, action, resource type, resource ID, payload, and `pending | sent | staged | failed` status. Duplicate submission is disabled while pending. The demo never claims that cancellation, money movement, trading, or account deletion was completed by an institution.

## Connector SDK

`connectors/` is an independently type-checked package. Shared contracts define provider metadata, capabilities, consent-safe authentication metadata, health checks, cursor sync, normalized money and timestamps, abort support, freshness, and typed retryable errors. Abstract category connectors cover banking, brokerage, subscriptions, property, business accounting, insurance, and credit/liabilities.

Connectors are read-oriented skeletons. Trading, money movement, raw credential persistence, and irreversible cancellation execution are non-goals. A sample in-memory connector proves the abstractions are implementable without embedding any provider secret.

## Boundaries and failure handling

- Pages depend on domain records and UI components, never concrete institution connectors.
- Shared UI imports no feature module.
- `connectors/` imports only connector core contracts.
- Missing routes render a useful not-found view.
- Empty lists invite a connection action.
- Requests show pending, staged, and error states with a live region.
- Local storage failure falls back to in-memory state and a non-blocking notice.
- Currency, dates, and percentages are formatted through tested utilities.

## Accessibility and responsive behavior

All controls are semantic, focus-visible, keyboard operable, and at least 44px on touch surfaces. Receipt content is available through focus and click, not hover alone. Rails are labeled regions with visible controls and do not trap focus or vertical gestures. Status never relies on color alone. Body text targets 4.5:1 contrast. Management tables become stacked records below 720px. The dashboard remains usable at 320 CSS pixels and supports reduced motion.

## Test strategy

Unit/component tests cover formatting, rail boundaries, disclosure behavior, routing, subscription filters, exact command method/URL/headers/body, non-JSON and network fallback, staging, undo, and connector error normalization. Playwright covers the dashboard, every management route, a real aborted API request followed by staged UI, cancellation and undo, keyboard navigation, mobile layout, horizontal scrolling, and screenshots. Completion requires lint, typecheck (app and connector SDK), unit tests, production build, and browser-driven end-to-end tests.

## Delivery and hosting

The app builds to `dist/`. `vercel.json` rewrites all non-file routes to `index.html`, enabling management-route refreshes. The README will include local commands, Vercel Hobby limitations, dashboard import and CLI deployment, exact build/output settings, mock-data reset, and the future `VITE_API_BASE_URL` switch. No credentials belong in this frontend.

## Work streams

1. Application foundation: Vite configuration, domain models, fixtures, utilities, router, and test harness.
2. Experience layer: shell, overview, rails, cards, responsive styling, and all management routes.
3. Command workflow: request gateway, staging, subscription cancellation, generic management actions, and user feedback.
4. Connector SDK and delivery: abstract connector package, tests, README/Vercel runbook, and deployment configuration.
5. Integrated verification: lint, typecheck, unit, build, desktop/mobile browser flows, and screenshot evidence.
