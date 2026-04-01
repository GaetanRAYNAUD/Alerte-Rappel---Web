# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Alerte Rappel is a French consumer product recall alert web application. It allows users to search for product recalls by alert number, barcode (including barcode scanning via camera), or free-text search. The app is in French by default with English i18n support.

## Commands

- `npm run dev` — Start dev server on https://localhost:3000 (with self-signed SSL)
- `npm run build` — Production build
- `npm run start` — Serve production build
- `npm run typecheck` — Run type generation + TypeScript compiler check
- `npm run lint` — ESLint with auto-fix

## Architecture

- **Framework**: React Router v7 in SPA mode (`ssr: false`), using Vite
- **UI**: MUI (Material UI) v7 with Emotion
- **State/Data**: Redux Toolkit with RTK Query (`app/store/alertesApi.ts`) for API calls
- **i18n**: react-intl with JSON message files in `app/i18n/messages/`
- **Routing**: Manual route config in `app/routes.ts` (not file-based)

### Provider Stack (root.tsx)

ReduxProvider → AppIntlProvider → ThemeProvider (MUI with auto dark/light mode) → MainLayout → Outlet

### API Layer

RTK Query api defined in `app/store/alertesApi.ts` hits a backend configured via `VITE_API_BASE_URL` env var (dev: `http://localhost:9090`). Endpoints: get alert by ID, get alert by barcode, get latest alerts, search alerts. See `docs/alert-example.json` for a full API response example.

### Search

The header SearchBar (`app/components/SearchBar/SearchBar.tsx`) navigates to `/recherche?q=...` on submit. The search page (`app/routes/recherche.tsx`) reads `q` and `page` from URL search params and calls the `searchAlertes` RTK Query endpoint. When refetching, existing results stay visible (dimmed) with a `LinearProgress` bar — never replace content with a full-screen spinner.

### Path Alias

`~/` maps to `./app/` (configured in tsconfig.json and resolved by vite-tsconfig-paths).

## Code Style (enforced by ESLint)

- 2-space indentation
- Single quotes, semicolons required
- No trailing commas
- Max line length: 135 chars
- Imports: grouped (external then internal) and alphabetically sorted
- Unused imports are errors
