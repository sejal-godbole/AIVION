<!-- Copilot / AI agent instructions for contributors and coding agents -->
# Aivion — Copilot Instructions

Purpose: quick, actionable guidance so an AI coding agent can be productive immediately.

1) Project snapshot
- Framework: Next.js (App Router) — top-level `app/` contains routes and layouts.
- UI: Tailwind + shadcn-style components under `components/` and `components/ui/`.
- Auth: Clerk (`@clerk/nextjs`) — authentication hooks and providers live in `app/(auth)`.
- DB: Prisma — schema at `prisma/schema.prisma`, migrations under `prisma/migrations/`.
- Background / webhooks: Inngest integration: `lib/inngest/` and `app/api/inngest/route.js`.
- AI & features: server-side logic lives in `actions/` (e.g., `generateCoverLetter.js`, `resume.js`, `roastGithub.js`) and helpers in `lib/`.

2) Developer workflows & commands
- Start dev server: `npm run dev` (maps to `next dev`).
- Build: `npm run build`; Start production server: `npm run start`.
- Lint: `npm run lint` (eslint configured in repo).
- Prisma: use the `prisma` CLI from devDependencies (e.g., `npx prisma migrate dev`).

3) Important files to read first (examples)
- UI entry and routing: `app/page.jsx`, `app/layout.js` and nested routes under `app/(main)/`.
- Feature entry points that call AI/backends: `app/(main)/ai-cover-letter/page.jsx` -> `actions/generateCoverLetter.js`.
- Background/async handlers: `lib/inngest/client.js`, `app/api/inngest/route.js`.
- Database model & migrations: `prisma/schema.prisma`, `prisma/migrations/`.
- Shared helpers: `lib/helper.js`, `lib/schema.js`, `lib/utils.js`.

4) Conventions and patterns (concrete, repo-specific)
- App Router: prefer route-level `layout.jsx` + `page.jsx` under `app/` for pages. Follow existing pattern when adding features.
- Component placement: reusable UI primitives in `components/ui/*`; page-specific widgets placed in `app/.../_components/`.
- Server logic: long-running or external calls are implemented in `actions/` or `lib/` and invoked from server components or via Inngest endpoints.
- Naming: feature actions use kebab/camel-like names matching pages (e.g., `generateCoverLetter.js` ↔ `ai-cover-letter`).
- Client vs Server: files with `layout.js/jsx` and `page.jsx` are server components by default — add `"use client"` at the top of a component file when making it a client component.

5) Integration & external dependencies to be aware of
- Clerk for auth: check `app/(auth)` routes and `@clerk/nextjs` usage.
- Google generative AI SDK: `@google/generative-ai` is included — search `actions/` to find usage.
- Inngest: background jobs and webhooks; keep idempotency and small payloads for event handlers.
- PDF and resume tools: libraries like `pdfjs-dist`, `html2canvas`, `jspdf` are used — watch for SSR constraints.

6) Testing & debugging notes (what I could discover)
- No test runner is present in package.json — expect manual testing via `npm run dev`.
- Use browser at `http://localhost:3000` and inspect network calls to `app/api/*` routes and Inngest webhooks.

7) Patch / PR guidance for AI agents
- Make minimal, focused changes and include linked files in the PR description.
- When adding server-side credentials or API keys, do NOT hardcode — follow env var patterns and update `.env` locally.
- If editing Prisma models, run migrations and mention the migration file created under `prisma/migrations/`.

8) Helpful search patterns for common tasks
- Find feature server code: `actions/*` and `lib/*`.
- Find route handlers: `app/**/route.js` and `app/api/**`.
- Prisma models & migrations: `prisma/schema.prisma` and `prisma/migrations/**`.

9) If uncertain — ask the user these quick clarifying questions
- Which environment variables hold API keys for generative models and Inngest?
- Are there any expected CI checks (not present in repo) the agent should be aware of?

---
If anything here looks wrong or you'd like more detail (examples for a specific feature, or CI/DevOps workflows), tell me which area to expand.
