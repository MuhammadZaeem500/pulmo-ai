---
title: API Client
tags: [services, axios]
---

# API Client (`src/services/api.ts`)

Part of [[Architecture]]. Used by every service note: [[Authentication-Service]], [[Medical-Records-Service]], [[Patient-Services]], [[Doctor-Services]], [[Admin-Services]].

## Shared Axios instance

```ts
const api = axios.create({ baseURL: 'http://localhost:3000' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

| Behaviour | Detail |
|---|---|
| Base URL | Hard-coded to `http://localhost:3000` |
| Token source | `localStorage`, key `accessToken` or `token` (the sign-in flow writes `token`) |
| Header | `Authorization: Bearer <JWT>` added to every request |
| Response handling | Callers read `response.data`; some endpoints wrap payloads in `data.data` |

## Services that bypass the shared client

Some modules build their own requests with `axios` or `fetch` and read `NEXT_PUBLIC_API_URL` (default `http://localhost:3000`), or hard-code the URL:

| Module | Mechanism |
|---|---|
| `medical-records.service.ts`, `symptom.service.ts` | `axios` + `NEXT_PUBLIC_API_URL`, manual Bearer header |
| Chatbot, patient appointments, clinics directory, Know Your Medicine pages | `fetch` with hard-coded `http://localhost:3000` |
| `prescription`, `consultation`, `doctor` services | Shared client plus a redundant manual auth header |

> [!WARNING] Configuration risk
> Because the base URL is hard-coded in several places, deploying to any host other than localhost requires changing each location. The README suggests running the backend on another port and setting `NEXT_PUBLIC_API_URL`, but `api.ts` itself ignores that variable. Centralising on `api.ts` with `process.env.NEXT_PUBLIC_API_URL` is the recommended fix. See [[Setup-And-Configuration]].

> [!NOTE] Security
> Storing JWTs in `localStorage` is readable by any script on the page. See [[Security-And-RBAC]].

Full route list: [[API-Endpoint-Reference]].
