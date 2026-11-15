---
title: Tech Stack
tags: [overview, stack]
---

# Tech Stack

Back to [[Welcome]] · See also [[Architecture]]

## Frontend (this repository)

Versions come from `package.json`.

| Technology | Version | Purpose |
|---|---|---|
| Next.js (App Router) | 16.2.x | Framework, routing, build |
| React | 19.2.x | UI library |
| TypeScript | 5.9.x | Static typing |
| Tailwind CSS | 4 (via `@tailwindcss/postcss`) | Utility-first styling |
| Axios | 1.x | HTTP client. See [[API-Client]] |
| MUI (`@mui/material`, icons) with Emotion | 9.x | Selected UI components and icons |
| Lucide React | 1.x | Primary icon set |
| ESLint | 9 (`eslint-config-next`) | Linting |
| Node.js | 20 (CI) | Runtime for build and tooling |

## Backend (separate repository)

The backend is not part of this codebase. Based on the project guidelines (`AGENTS.md`, `CLAUDE.md`) it uses:

| Technology | Purpose |
|---|---|
| NestJS | REST API framework |
| PostgreSQL | Relational database |
| Prisma ORM | Schema and data access. See [[PostgreSQL-Prisma-Schema]] |
| JWT | Authentication tokens. See [[Security-And-RBAC]] |

> [!NOTE]
> The NestJS and Prisma details are taken from the project brief and guideline files. Confirm exact versions in the backend repository.

## Target conventions not yet installed

The guideline files name these tools, but they are not in `package.json` at this time:

- Redux Toolkit for global state
- Zod with React Hook Form for validation
- React Query for server state

`react-router-dom` is installed but the app routes with the Next.js App Router.

## Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

Continue to [[Setup-And-Configuration]] and [[CI-CD-Workflow]].
