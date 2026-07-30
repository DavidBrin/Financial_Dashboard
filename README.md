# Financial Command Center

A responsive personal-finance command-center demo covering cash, investments, subscriptions, property, credit, insurance, and business finances. It uses deterministic mock read data and believable management workflows, but it is not connected to a financial institution and does not move money, trade, cancel services, or change real accounts.

## Local development

Requires Node.js 22.12 or newer and npm.

```bash
npm install
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173`. The connector SDK is intentionally a separate package; install its dependencies when working on it:

```bash
npm --prefix connectors install
```

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check the app and build production files into `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Type-check the browser application. |
| `npm test` | Run application unit and component tests once. |
| `npm run test:watch` | Run application tests in watch mode. |
| `npm run test:e2e` | Run Playwright browser tests. |
| `npm run test:connectors` | Run connector SDK tests. |
| `npm run typecheck:connectors` | Type-check the connector SDK. |

## Demo behavior and reset

Read data is fixed mock data, so reloading the page restores the original displayed records. Mutations send real HTTP requests to same-origin `/api/v1/...` endpoints with an idempotency key. This repository supplies no API backend. A network error, missing route, or non-JSON response is therefore treated as an unhandled request and staged in browser storage. The UI reports that staging with a request ID; it never claims the provider completed the operation.

To reset the demo completely, open the browser's developer tools for the site, choose **Application** (Chrome/Edge) or **Storage** (Firefox), clear the site's local storage/site data, and reload. This removes staged commands and restores the deterministic fixtures. Clearing site data affects only the selected local or deployed origin.

`VITE_API_BASE_URL` switches the command gateway to a future hosted command service while keeping the same `/api/v1` contracts. Leave it unset for the frontend-only demo. To attach a backend, add a public origin such as `VITE_API_BASE_URL=https://api.example.com` to `.env.local` for development and to the relevant Vercel environment, then rebuild. Vite variables are embedded in the public browser bundle and must never contain credentials or secrets.

## Connector SDK

`connectors/` is an independently tested and type-checked TypeScript package of server-side, read-oriented provider abstractions. It includes category contracts and an in-memory example, but no live provider integration. Browser code must not import this package. Provider tokens, raw login details, private keys, and other credentials belong in a secure backend or secret store—not in this repository, `VITE_*` variables, mock data, commits, or the Vercel frontend project.

## Deploy to Vercel Hobby

This project is eligible for a Vercel Hobby deployment when used as a personal, non-commercial demo. Hobby is subject to Vercel's current fair-use policy and account limits, has no production SLA, and is not appropriate for a real financial product, regulated data, paid/commercial use, or a credential-bearing API. Check the current [Hobby plan documentation](https://vercel.com/docs/plans/hobby) and [fair-use policy](https://vercel.com/docs/limits/fair-use-guidelines) before deploying. Do not add real financial data or credentials.

The committed `vercel.json` uses Vercel's standard SPA catch-all rewrite. Static files are served before the rewrite; application paths and unimplemented `/api/...` paths fall back to `index.html`. The command gateway validates the response content type, so rewritten HTML is staged as an unhandled demo request instead of being mistaken for API success. Direct visits and refreshes such as `/manage/subscriptions` therefore work.

### GitHub dashboard import

1. Push the repository to GitHub without credentials, `.env` files, or real financial data.
2. In the [Vercel dashboard](https://vercel.com/new), select the personal Hobby scope, choose **Add New → Project**, and import the GitHub repository. Authorize the Vercel GitHub app if prompted.
3. Confirm **Framework Preset: Vite** and **Root Directory: `.`**.
4. Override or confirm **Build Command: `npm run build`**, **Output Directory: `dist`**, and **Install Command: `npm install`**.
5. Leave environment variables empty for this frontend-only demo. Add `VITE_API_BASE_URL` only when a compatible command service is deployed; use the service's public origin and keep every secret on that backend.
6. Select **Deploy**. After the build finishes, open `/`, then directly open and refresh `/manage/subscriptions` to verify the SPA rewrite.
7. Trigger a demo action and confirm it reports a staged request. It must not report a real institutional change.

Vercel will create preview deployments for later GitHub branches or pull requests and update the production deployment from the configured production branch. Confirm that branch in **Project Settings → Git** before relying on it.

### CLI deployment

From the repository root, authenticate and create or link the project:

```bash
npx vercel@latest login
npx vercel@latest
```

Choose the personal Hobby scope, link to an existing project or create a new one, keep the source directory as `.`, and accept the detected Vite settings. If detection asks for explicit values, use build command `npm run build`, output directory `dist`, and install command `npm install`. The first command creates a preview deployment.

After verifying the preview URL and a refreshed management deep link, deploy the same project to production:

```bash
npx vercel@latest --prod
```

For an already-created dashboard project, `npx vercel@latest link` links the local checkout before preview or production deployment. Keep `.vercel/` uncommitted; it contains local project linkage metadata.
