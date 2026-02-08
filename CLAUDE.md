# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Next.js dev server (localhost:3000)
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- `npx prettier --check .` — Check formatting
- `npx prettier --write .` — Fix formatting
- `docker compose up -d` — Start Postgres (localhost:5432, db: `pace_progress`, user/pass: `postgres/postgres`)

## Architecture

- **Next.js 16** with App Router, React 19, TypeScript (strict mode)
- **Tailwind CSS v4** via PostCSS (uses `@import "tailwindcss"` and `@theme inline` in `globals.css`)
- **PostgreSQL 15** via Docker Compose (no ORM or database client configured yet)
- Path alias: `@/*` maps to project root

## Code Style

- Prettier: double quotes, semicolons, trailing commas (es5), 2-space indent, 80 char width
- ESLint: Next.js core-web-vitals + TypeScript rules, with eslint-config-prettier to avoid conflicts
