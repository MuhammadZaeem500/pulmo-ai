---
title: Admin Portal
tags: [portal, admin]
---

# Admin Portal

Routes live under `src/app/admin/`. Shell: `admin/layout.tsx` with a collapsible sidebar. See [[Layouts-And-Navigation]]. Sign-in: `/auth/admin/sign-in`.

Related: [[Patient-Portal]] · [[Doctor-Portal]] · [[Admin-Services]] · [[Security-And-RBAC]]

## Screens

| Route | Purpose | Endpoints |
|---|---|---|
| `/admin/dashboard` | Key metrics, recent audit log entries, notifications, shortcuts | `/admin/dashboard/metrics`, `/admin/security/audit-logs`, `/admin/notifications` |
| `/admin/analytics` | Healthcare analytics | `/admin/analytics/healthcare` |
| `/admin/users` | List users, suspend or reactivate | `/admin/users`, `/admin/users/:id/status` |
| `/admin/doctor-verification` | Approve or reject doctor applications | `/admin/doctors`, `/admin/doctors/:id/verify` |
| `/admin/clinics` | Add, edit, activate/deactivate, delete clinics | `/admin/clinics*` |
| `/admin/security` | Security alerts with severity and status | `/admin/security/dashboard` |
| `/admin/reports` | Downloadable reports (PDF, CSV, XLSX) | `/admin/reports/dashboard` |
| `/admin/notifications` | Read, mark all read, delete notifications | `/admin/notifications*` |
| `/admin/settings` | Admin profile and system settings | `/admin/profile`, `/admin/settings` |

## Doctor verification

Pending doctor requests show name, email, licence number, specialization and request date. The admin chooses **APPROVED** or **REJECTED**, sent as `PATCH /admin/doctors/:id/verify { status }`. This gate is how the platform keeps unverified clinicians out of the Doctor portal.

## User management and RBAC

The user table shows name, email, role, registration date, last login and status (`Active`, `Pending`, `Suspended`). The detail dialog lets an admin toggle suspension. Role separation (`patient`, `doctor`, `admin`) is described in [[Security-And-RBAC]].

## Security centre

Alerts carry a severity (`Critical`, `High`, `Medium`, `Low`) and a status (`Open`, `Investigating`, `Resolved`). `SecurityAlertModal` shows details and a resolve action. See [[Modals-Library]] and [[TypeScript-Interfaces]].

## Reports and notifications

Reports list title, last generated date, file size, status and recent downloads. Notifications are typed `Verification`, `Security`, `System` or `Update`, may be urgent, and track read state.

> [!NOTE]
> The admin header currently shows a static "Admin User / Super Admin" label. Dynamic identity is a future improvement.
