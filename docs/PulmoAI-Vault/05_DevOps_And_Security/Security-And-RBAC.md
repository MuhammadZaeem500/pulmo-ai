---
title: Security and RBAC
tags: [security, rbac]
---

# Security and RBAC

Related: [[Authentication-Service]] · [[API-Client]] · [[Admin-Portal]] · [[CI-CD-Workflow]]

> [!WARNING] Healthcare data
> PulmoAI handles sensitive health information. Any production use requires compliance review (for example HIPAA-style safeguards or local data-protection law) beyond the scope of this academic build.

## Roles

| Role | Portal | Capabilities |
|---|---|---|
| `patient` | `/patient/*` | Own profile, records, symptoms, prescriptions, appointments |
| `doctor` | `/doctor/*` | Patients, notes, prescriptions, tests, schedule. Must be admin-approved |
| `admin` | `/admin/*` | Users, doctor verification, clinics, security, reports |

## How access works today

1. Sign-in returns a JWT stored as `token` in `localStorage` ([[API-Client]]).
2. Every API request carries it as a Bearer token.
3. The backend is expected to verify the token and role on each route (`/patient`, `/doctor`, `/admin`).
4. The Doctor sign-in page additionally rejects non-doctor accounts client-side.
5. Admin approval gates doctors ([[Admin-Portal]]).

## Domain rules

- Prescriptions are only created or updated by verified doctors attached to a consultation.
- A `High` urgency AI result must prompt the patient to book an appointment.
- AI output is advisory and must not be presented as a diagnosis.

## Known gaps and recommendations

| Area | Current state | Recommendation |
|---|---|---|
| Client route guards | Role layouts render without checking the signed-in role | Enforce role guards in `middleware.ts` and layouts; redirect mismatched roles |
| Token storage | JWT in `localStorage`, readable by page scripts | Prefer HttpOnly, Secure, SameSite cookies |
| Sign-out | Doctor clears storage; patient and admin do not remove the token | Clear the token and call a backend logout on all roles ([[Authentication-Service]]) |
| API URL | Hard-coded `http://localhost:3000` in several files | Use `NEXT_PUBLIC_API_URL` and HTTPS in production |
| Admin sign-in | Example admin email pre-filled | Remove default value |
| Input validation | Basic form handling | Add Zod schemas and server-side validation |
| Account deletion and password change | Present for patients and doctors | Require re-authentication and audit logging |
| Secrets | `.env.local` is in the repo folder | Keep it out of version control and never pack it into shared exports |

> [!IMPORTANT]
> The backend is the security boundary. Client checks only improve user experience. Every protected route must authorise by role and ownership on the server.

## Admin security tooling

The Security Center lists alerts by severity and status, and the dashboard shows audit-log entries from `GET /admin/security/audit-logs`. See [[Admin-Services]].
