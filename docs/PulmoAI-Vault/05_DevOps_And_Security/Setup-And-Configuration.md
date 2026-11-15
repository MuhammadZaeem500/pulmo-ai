---
title: Setup and Configuration
tags: [devops, setup]
---

# Setup and Configuration

Related: [[Tech-Stack]] · [[CI-CD-Workflow]] · [[API-Client]]

## Prerequisites

- Node.js 20 or later and npm
- The PulmoAI backend running locally (separate repository)

## Install and run

```bash
git clone https://github.com/MuhammadZaeem500/pulmo-ai
cd pulmo-ai
npm install
npm run dev     # http://localhost:3000
```

## Ports and environment

The frontend and the backend both default to port 3000. Run the backend on another port (for example `PORT=4000`) and create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> [!WARNING] Known mismatch
> `src/services/api.ts` and several pages still hard-code `http://localhost:3000`, so they ignore this variable. Until they are updated, either run the backend on 3000 and the frontend on another port (`npm run dev -- -p 3001`), or update those files. Details in [[API-Client]].

## Scripts

`npm run dev`, `npm run build`, `npm run start`, `npm run lint`.

## Project guideline files

`ARCHITECTURE.md`, `AGENTS.md` and `CLAUDE.md` in the repo root describe conventions for developers and AI coding assistants. See [[Architecture]] and [[Security-And-RBAC]].

## Licence

All rights reserved; shared for viewing only (see `LICENSE`).
