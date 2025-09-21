<center>

<img src="./logo.png" width="50%" />

</center>

# <center>ElectronJS-template</center>


<p align="center">

<!-- ===== GitHub Stats ===== -->
<a href="https://github.com/XXanderWP/ElectronJS-template/blob/main/LICENSE">
  <img src="https://img.shields.io/github/license/XXanderWP/ElectronJS-template?style=for-the-badge" />
</a>
<a href="https://github.com/XXanderWP/ElectronJS-template">
  <img src="https://img.shields.io/github/created-at/XXanderWP/ElectronJS-template?style=for-the-badge" />
</a>
<a href="https://github.com/XXanderWP/ElectronJS-template/releases">
  <img src="https://img.shields.io/github/downloads/XXanderWP/ElectronJS-template/total?style=for-the-badge" />
</a>
<a href="https://github.com/XXanderWP/ElectronJS-template/actions">
  <img src="https://img.shields.io/github/actions/workflow/status/XXanderWP/ElectronJS-template/build.yml?style=for-the-badge" />
</a>
<a href="https://github.com/XXanderWP/ElectronJS-template/graphs/contributors">
  <img src="https://img.shields.io/github/contributors/XXanderWP/ElectronJS-template?style=for-the-badge" />
</a>
<a href="https://github.com/XXanderWP/ElectronJS-template/commits/main">
  <img src="https://img.shields.io/github/last-commit/XXanderWP/ElectronJS-template?style=for-the-badge" />
</a>
<a href="https://github.com/XXanderWP/ElectronJS-template/issues">
  <img src="https://img.shields.io/github/issues/XXanderWP/ElectronJS-template?style=for-the-badge" />
</a>
<a href="https://github.com/XXanderWP/ElectronJS-template/stargazers">
  <img src="https://img.shields.io/github/stars/XXanderWP/ElectronJS-template?style=for-the-badge" />
</a>
<a href="https://github.com/XXanderWP/ElectronJS-template/network/members">
  <img src="https://img.shields.io/github/forks/XXanderWP/ElectronJS-template?style=for-the-badge" />
</a>

<br><br>

<!-- ===== Tech Stack ===== -->
<img src="https://img.shields.io/badge/ElectronJS-47848F?logo=electron&logoColor=white&style=for-the-badge" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
<img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge" />
<img src="https://img.shields.io/badge/Webpack-8DD6F9?logo=webpack&logoColor=black&style=for-the-badge" />
<img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white&style=for-the-badge" />
<img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge" />

</p>



A starter template for building desktop applications with Electron, TypeScript, React and Webpack.
This repository provides a working example app, build scripts and recommended editor settings for ESLint + Prettier.

Important: This project is intended to be used via GitHub "Use this template" feature (not only cloning).

Features
- Electron main (backend) + React renderer (frontend) using TypeScript and Webpack.
- Pre-configured IPC preload bridge and typings.
- Example UI (titlebar) and basic window control handlers.
- ESLint and Prettier integration for consistent code style.
- Support for worker bundles and packaging with electron-builder.
- Persistent storage controller with IPC synchronization between main and renderer processes (see [`src/shared/storage.ts`](src/shared/storage.ts:1), [`src/backend/modules/storage.ts`](src/backend/modules/storage.ts:1), [`src/frontend/modules/storage.tsx`](src/frontend/modules/storage.tsx:1)).
- Storage replication across worker processes — IPC-driven synchronization keeps in-memory storage consistent between main and forked workers (see [`src/backend/workers/worker.main.ts`](src/backend/workers/worker.main.ts:1) and [`src/backend/workers/worker.inside.ts`](src/backend/workers/worker.inside.ts:1)).
- Unified translation layer (i18n) with centralized language files and helpers for backend and frontend (see [`src/lang/core.ts`](src/lang/core.ts:1), [`src/backend/modules/lang.ts`](src/backend/modules/lang.ts:1), [`src/frontend/modules/lang.ts`](src/frontend/modules/lang.ts:1)).

Project structure
- [`src/shared`](src/shared:1) — shared utilities and common code.
- [`src/backend`](src/backend:1) — Electron main process, modules, pages and workers.
- [`src/frontend`](src/frontend:1) — React renderer, entry HTML and styles.
- [`src/preload`](src/preload:1) — preload scripts and IPC bridge exposed with `contextBridge`.
- [`src/lang`](src/lang:1) — Language module.
- [`src/types`](src/types:1) — TypeScript global declarations.

Build & output
- Compiled bundles are emitted to `./dist`.
- Packaged installers/artifacts are produced in `./out` by `electron-builder`.
- Webpack configs are split for frontend, backend and workers.

NPM scripts
- `npm run watch` — run Webpack in watch mode for development.
- `npm run build` — build all bundles (Webpack).
- `npm run build:frontend` — build frontend bundle only (uses [`webpack.config.frontend.mjs`](webpack.config.frontend.mjs:1)).
- `npm run build:backend` — build backend (main) bundle only (uses [`webpack.config.backend.mjs`](webpack.config.backend.mjs:1)).
- `npm run build:workers` — build worker bundles only (uses [`webpack.config.workers.mjs`](webpack.config.workers.mjs:1)).
- `npm run build:electron` — package the app with `electron-builder`.
- `npm run start` — run Electron loading `./dist/main.bundle.js`.
- `npm run lint` — run ESLint and attempt to fix issues automatically.
- `npm run test` — run lint and jest tests.
- `npm run next-patch|next-minor|next-major` — bump package version.

How to use this repository as a template
- On GitHub, press "Use this template" to create a new repository pre-populated with this template.
- After creating the new repository, update `package.json` metadata (name, author, productName, appId) and adjust build settings before packaging.

IPC / preload (brief)
- The preload bridge exposes a small set of safe helpers to the renderer (see [`src/preload/ipc-api.ts`](src/preload/ipc-api.ts:1)).
- Renderer code can call `window.ipcAPI` (types in [`src/types/global.d.ts`](src/types/global.d.ts:1)).
- Add main-process handlers under [`src/backend`](src/backend:1) and expose only safe methods through the preload API.

VSCode, ESLint and Prettier
- ESLint and Prettier configs are included; run `npm run lint` to enforce code style.
- Recommended: install ESLint and Prettier extensions and enable "Format on Save" in VSCode workspace.

Packaging notes
- Ensure `npm run build` produces a valid `./dist/main.bundle.js` referenced by `main` in [`package.json`](package.json:1).
- `electron-builder` settings live in the `build` field of [`package.json`](package.json:1).

Contributing / extending
- This repository is a template. Structure your new app by keeping main logic in [`src/backend`](src/backend:1), UI in [`src/frontend`](src/frontend:1) and shared utilities in [`src/shared`](src/shared:1).

Changelog / Recent notable changes
- feat(storage): add persistent storage with IPC sync — introduced a shared StorageController with persistent JSON file storage and IPC handlers that keep renderer processes in sync. Relevant files:
  - [`src/shared/storage.ts`](src/shared/storage.ts:1) — StorageController implementation, events (OnLoad, OnChange, OnChangeKey, OnSave), auto-save logic.
  - [`src/backend/modules/storage.ts`](src/backend/modules/storage.ts:1) — backend module persisting storage to disk and forwarding changes via IPC.
  - [`src/frontend/modules/storage.tsx`](src/frontend/modules/storage.tsx:1) — frontend integration, listens to IPC events and exposes `useStorage()` hook.
  - Minor frontend updates: [`src/frontend/App.tsx`](src/frontend/App.tsx:1) and [`src/frontend/index.tsx`](src/frontend/index.tsx:1).
- feat(storage): replicate state across worker processes — added IPC-driven synchronization between main and forked workers so in-memory Storage stays consistent:
  - [`src/backend/workers/worker.main.ts`](src/backend/workers/worker.main.ts:1) — worker bootstrap modifications: optional storage sync flag, forwarding Storage.OnLoad and OnChangeKey to workers.
  - [`src/backend/workers/worker.inside.ts`](src/backend/workers/worker.inside.ts:1) — worker-side storage controller and IPC handlers to receive initial load and sync updates.
  - Storage change deduplication improved in [`src/shared/storage.ts`](src/shared/storage.ts:1) to avoid redundant updates.
- feat(i18n): add unified translation layer — provide a single source of truth for localized strings and helpers, available to both backend and frontend:
  - [`src/lang/core.ts`](src/lang/core.ts:1) — core language registry, helpers (langString, langStringSystem, GetUserLanguage) and utilities to resolve languages and nested placeholders.
  - [`src/backend/modules/lang.ts`](src/backend/modules/lang.ts:1) — backend-side language detection and LangString helper for main process usage.
  - [`src/frontend/modules/lang.ts`](src/frontend/modules/lang.ts:1) — frontend helper `LangString` for renderer usage.
  - Language resources: [`src/lang/en.json`](src/lang/en.json:1), [`src/lang/ru.json`](src/lang/ru.json:1), [`src/lang/uk.json`](src/lang/uk.json:1), [`src/lang/shared.json`](src/lang/shared.json:1).
  - Types and config: [`src/types/lang.d.ts`](src/types/lang.d.ts:1) and a tsconfig paths update to include `_lang/*`.

License
- MIT — see [`LICENSE`](LICENSE:1).

Useful files and configs
- [`package.json`](package.json:1) — scripts and build settings.
- [`webpack.common.mjs`](webpack.common.mjs:1), [`webpack.config.frontend.mjs`](webpack.config.frontend.mjs:1), [`webpack.config.backend.mjs`](webpack.config.backend.mjs:1), [`webpack.config.workers.mjs`](webpack.config.workers.mjs:1).
- [`tsconfig.json`](tsconfig.json:1), ESLint and Prettier config files.
- Storage & sync related:
  - [`src/shared/storage.ts`](src/shared/storage.ts:1)
  - [`src/backend/modules/storage.ts`](src/backend/modules/storage.ts:1)
  - [`src/frontend/modules/storage.tsx`](src/frontend/modules/storage.tsx:1)
  - [`src/backend/workers/worker.main.ts`](src/backend/workers/worker.main.ts:1)
  - [`src/backend/workers/worker.inside.ts`](src/backend/workers/worker.inside.ts:1)

End of README.