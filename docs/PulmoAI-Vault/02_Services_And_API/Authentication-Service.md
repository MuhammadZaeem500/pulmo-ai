---
title: Authentication Service
tags: [services, auth]
---

# Authentication Service (`auth.service.ts`)

Uses [[API-Client]]. Pages: `src/app/auth/{patient,doctor,admin}/{sign-in,sign-up}/page.tsx`. Context: [[Security-And-RBAC]].

## Methods

| Method | Endpoint | Notes |
|---|---|---|
| `login(data)` | `POST /auth/sign-in` | One shared endpoint for all roles. Stores `accessToken` as `token` in `localStorage` |
| `signupPatient(data)` | `POST /auth/patient/sign-up` | Full name, email, phone, gender (`MALE`/`FEMALE`/`OTHER`), blood group, password |
| `signupDoctor(data)` | `POST /auth/doctor/sign-up` | Client maps form fields to the API payload (see below) |
| `signupAdmin(data)` | `POST /auth/admin/sign-up` | Admin registration form data |

## Sign-in flows

```mermaid
flowchart TD
  A[Role-specific sign-in page] --> B[POST /auth/sign-in]
  B -->|accessToken| C[Save token in localStorage]
  C --> D{Role page}
  D -->|patient| E[/patient/dashboard]
  D -->|doctor| F{role == DOCTOR?}
  F -->|yes| G[/doctor/dashboard]
  F -->|no| H[Show access denied]
  D -->|admin| I[/admin/dashboard]
```

- **Patient** and **Admin** pages call `login` and redirect to their dashboard.
- **Doctor** page also checks `response.user.role` and rejects anyone who is not `DOCTOR` with the message that the portal is for doctors only.
- Patient sign-up shows a confirmation that an email-verification step follows, then redirects to sign-in.

## Doctor sign-up mapping

| Form field | API field |
|---|---|
| `firstName` + `lastName` | `fullName` |
| `pmdcNumber` | `licenseNumber` |
| `specialty` | `specialty` and `specialization` |
| `hospital`, `qualifications`, `experience` (number) | same names |
| `email`, `phone`, `password` | same names |

Doctors then wait for admin approval. See [[Admin-Portal]].

## Sign-out behaviour

| Portal | What Logout does today |
|---|---|
| Doctor | Clears `localStorage`, then redirects to doctor sign-in |
| Patient | Redirects to patient sign-in only. The stored token is **not** removed |
| Admin | A link to admin sign-in. The stored token is **not** removed |

> [!WARNING] Hardening notes
> - Patient and admin sign-out should also remove the token (for example `localStorage.removeItem('token')`) so a shared browser cannot reuse the session.
> - Role checks happen on the client for doctors only. The backend must remain the authority for all roles.
> - The admin sign-in page pre-fills an example email address, which should be removed for production.
> See [[Security-And-RBAC]] and [[Layouts-And-Navigation]].
