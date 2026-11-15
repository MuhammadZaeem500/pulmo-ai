---
title: CI/CD Workflow
tags: [devops, github-actions]
---

# CI/CD Workflow

Defined in `.github/workflows/ci-cd.yml` (workflow name **Frontend CI**). Related: [[Setup-And-Configuration]] · [[Tech-Stack]] · [[Security-And-RBAC]].

## Triggers

- `push` to `main`
- `pull_request` targeting `main`

## Job: `build-and-test` (ubuntu-latest)

| Step | Command | Purpose |
|---|---|---|
| Checkout | `actions/checkout@v4` | Fetch the code |
| Node setup | `actions/setup-node@v4`, Node 20 | Match the runtime |
| Install | `npm install` | Install dependencies |
| Type check | `npx tsc --noEmit` | Catch TypeScript errors |
| Build | `npm run build` | Confirm a production build succeeds |

```mermaid
flowchart LR
  P[Push or PR to main] --> C[Checkout] --> N[Node 20] --> I[npm install] --> T[tsc --noEmit] --> B[next build]
```

> [!NOTE] What this pipeline is not
> Despite the file name, it performs **continuous integration only**. There is no deployment step, no linting step (`npm run lint` is available locally) and no automated tests yet. Tests are on the roadmap ([[Welcome]]).

## Suggested improvements

1. Add `npm run lint` and a test step.
2. Use `npm ci` for reproducible installs.
3. Add a deployment job (for example to Vercel or a container host) with environment-specific API URLs. See [[API-Client]].
4. Add dependency and secret scanning.
