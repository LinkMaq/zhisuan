# Session Context

Last updated: 2026-04-24

## Project state

- Project path: `/Volumes/datas/破晓石科技/客户信息/绵阳项目/标书文件/PAI/演示前端`
- This is a static frontend prototype for an enterprise intelligent-computing platform.
- Stack: `React + Vite + TypeScript + Tailwind CSS v4`
- No backend is used. All business flows, status changes, logs, progress, and audit records are simulated in frontend state.

## Delivered implementation

- A unified console SPA has been implemented.
- Main dashboard plus 8 demo modules are available:
  - compute quota and resource specs
  - model encryption workflow
  - sensitive-word policy orchestration
  - remote development instance flow
  - fine-tuning workflow
  - model app space lifecycle
  - cloud-native app deployment
  - model tiered publishing
- The current UI is Chinese, neutral branding, and enterprise-console style.

## Key files

- `src/App.tsx`: app structure, routes, page modules, simulated state flows
- `src/styles.css`: visual system, layout, responsive behavior
- `src/main.tsx`: app entry
- `package.json`: scripts and dependencies

## Current behavior

- Route mode is `HashRouter`.
- Main preview URL: `http://localhost:5173/#/`
- The in-app browser was last on: `http://localhost:5173/#/publish`
- Route switches reset scroll to top via `ScrollToTop` in `src/App.tsx`.

## Verification already completed

- `npm install` completed successfully
- `npm run build` passed
- All 9 routes rendered without browser console errors:
  - `/`
  - `/compute`
  - `/encryption`
  - `/safety`
  - `/dev`
  - `/finetune`
  - `/space`
  - `/cloud`
  - `/publish`
- Primary action buttons across all 8 module pages were exercised once and completed without runtime errors

## Important assumptions

- No real encryption, VS Code launch, Kubernetes deployment, or external service integration is performed.
- Security, token, upload, deployment, and scaling flows are product-level simulations only.
- `dist/` exists from the last successful build.
- `node_modules/` exists locally from the last install.
- A root `README.md` now exists for handoff and startup.

## Recommended next-start procedure

1. Read this file first.
2. If needed, run `npm run dev -- --port 5173`.
3. Open `http://localhost:5173/#/`.
4. Continue from `src/App.tsx` for feature changes or `src/styles.css` for visual changes.

## Likely next tasks

- refine visual density and typography
- split `src/App.tsx` into smaller modules if the file becomes harder to maintain
- continue improving dashboard-level storytelling and production-facing density
