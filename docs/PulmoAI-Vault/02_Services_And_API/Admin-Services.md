---
title: Admin Services
tags: [services, admin]
---

# Admin Services

Used by the [[Admin-Portal]].

## `admin.service.ts`

| Function | Request |
|---|---|
| `fetchSecurityDashboardData()` | `GET /admin/security/dashboard` |
| `fetchAdminReportsData()` | `GET /admin/reports/dashboard` |
| `fetchAdminNotifications()` | `GET /admin/notifications` |

## Calls made directly in admin pages

| Page | Requests |
|---|---|
| Dashboard | `GET /admin/dashboard/metrics`, `/admin/security/audit-logs`, `/admin/notifications` |
| Analytics | `GET /admin/analytics/healthcare` |
| Users | `GET /admin/users`, `PATCH /admin/users/:id/status` |
| Doctor verification | `GET /admin/doctors`, `PATCH /admin/doctors/:id/verify` |
| Clinics | `GET/POST /admin/clinics`, `PATCH /admin/clinics/:id`, `PATCH /admin/clinics/:id/status`, `DELETE /admin/clinics/:id` |
| Notifications | `PATCH /admin/notifications/read-all`, `PATCH /:id/read`, `DELETE /:id` |
| Settings | `GET/PATCH /admin/profile`, `PATCH /admin/settings` |

All use [[API-Client]]. Complete list: [[API-Endpoint-Reference]]. Security context: [[Security-And-RBAC]].
