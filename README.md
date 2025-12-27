# Avion

A professional AI career toolkit — resume builder, cover letters, interview prep, and more.

## Overview

Avion is a Next.js application that provides AI-powered career tools including an intelligent resume builder, cover letter generator, ATS scanner, adaptive interview practice, and other utilities to help users prepare for and land jobs.

### Key features
- Intelligent resume builder and resume templates
- AI-generated cover letters and LinkedIn content
- Adaptive interview practice with analytics
- ATS scanner for parsing and improving resumes
- Additional utilities: GitHub roast, negotiation helper, onboarding flows, and dashboards

## Tech stack

- Next.js 16
- React 19
- Tailwind CSS
- Prisma (database migrations in `prisma/`)
- Inngest (background functions)
- Clerk (authentication)
- Server-side & client-side AI integrations (see dependencies in `package.json`)

## Skills & Tech Stack

This project demonstrates practical experience across modern full-stack web development, AI integrations, and production-ready tooling. Key skills showcased:

- Frontend: Advanced Next.js 16 and React 19 patterns (app directory, server/client components), responsive UI with Tailwind CSS, accessibility-aware components
- Backend & Data: Prisma schema design and migrations, relational DB usage (Postgres-compatible), server-side route handlers and API integrations
- Authentication & Security: Clerk for authentication and session management, secure env var handling for API keys and `DATABASE_URL`
- AI & Integrations: Google Generative AI integration, server/client AI prompts and streaming responses, resume/cover-letter generation workflows
- Background Processing: Inngest for serverless background functions and event-driven processing
- Developer Experience: ESLint, Prettier, modular component architecture, reusable UI primitives, and testing-ready structure
- DevOps & Deployment: Vercel-friendly Next.js deployment, environment variable management, Prisma migrations in CI/CD
- Observability & Performance: Client-side performance optimizations, image optimization, and attention to bundle size and caching strategies

Badges & quick facts

- Language: JavaScript (ES2023)
- Framework: Next.js 16 (React 19)
- Styling: Tailwind CSS
- ORM: Prisma
- Background Jobs: Inngest
- Auth: Clerk
- AI: Google Generative AI (configurable)

## Repository layout

- `app/` — Next.js app routes and pages (features live under `app/(main)/`)
- `components/` — UI components and static data (`components/data/faqs.js`)
- `lib/` — helpers, Inngest client, Prisma client, utilities
- `prisma/` — Prisma schema and migrations
- `actions/` — server actions and API helpers
- `public/` — static assets

## Prerequisites

- Node.js 18+ and npm or pnpm
- A database supported by Prisma (e.g., PostgreSQL) and a `DATABASE_URL` environment variable
- Clerk account and keys (for authentication)
- Google generative AI credentials if you intend to use the generative features

## Quick Start (local)

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file at the project root and add required environment variables. At minimum you'll likely need:

- `DATABASE_URL` — Prisma database connection string
- Clerk environment variables (see Clerk dashboard)
- Any API keys required for AI integrations (e.g., Google generative AI)

3. Run Prisma migrations (if you have a local DB configured)

```bash
npx prisma migrate dev
```

4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## Scripts (from `package.json`)

- `dev` — Start Next.js dev server
- `build` — Build the app for production
- `start` — Start the production server
- `lint` — Run ESLint

## Deploy

This project deploys well on Vercel (recommended for Next.js), or any platform that supports Node.js apps. Ensure all environment variables (database, Clerk, AI keys) are configured in your provider.

## Database & Migrations

See `prisma/schema.prisma` and the `prisma/migrations` folder. Use the Prisma CLI to apply or create migrations.

## Contributing

1. Fork the repo and create a feature branch
2. Run and test locally
3. Submit a pull request with a clear description of changes

## Notes

- The project name in `package.json` has been updated to `avion`.
- Check `components/data/faqs.js` and `components/hero.jsx` for content and upstream links that reference the project name.

## License

Add a license file if you plan to open-source this project.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

