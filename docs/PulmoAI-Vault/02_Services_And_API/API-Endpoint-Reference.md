---
title: API Endpoint Reference
tags: [services, api, reference]
---

# API Endpoint Reference

Every endpoint the client calls, grouped by role. Base URL defaults to `http://localhost:3000` ([[API-Client]]). All routes except sign-in/up expect a Bearer token.

## Authentication ([[Authentication-Service]])
`POST /auth/sign-in` · `POST /auth/patient/sign-up` · `POST /auth/doctor/sign-up` · `POST /auth/admin/sign-up`

## Shared
`GET /medical-records/my-records` · `GET /medical-records/complete-history` · `POST /medical-records/intake` · `PATCH|DELETE /medical-records/records/:id` ([[Medical-Records-Service]])

## Patient ([[Patient-Services]])
| Area | Routes |
|---|---|
| Profile | `GET|PATCH /patient/profile` |
| Settings | `GET|PATCH /patient/settings/preferences`, `POST /patient/settings/change-password`, `DELETE /patient/settings/account` |
| Symptoms | `GET|POST /patient/symptoms`, `DELETE /patient/symptoms/:id` |
| Prescriptions | `GET /patient/prescriptions`, `GET /patient/prescriptions/:id` |
| Appointments | `GET|POST /patient/appointments`, `GET /patient/appointments/doctors/:id/available-slots` |
| Directory | `GET /patient/directory/doctors`, `GET /patient/directory/clinics` |
| Chatbot | `GET /patient/chatbot/sessions`, `GET /patient/chatbot/sessions/:id/messages`, `PATCH|DELETE /patient/chatbot/sessions/:id`, `POST /patient/chatbot/analyze-and-recommend` (multipart) |
| Medicine | `GET /medicines/identify?...` |

## Doctor ([[Doctor-Services]])
`GET /doctor/dashboard` · `GET|PATCH /doctor/profile` · `GET /doctor/patients` · `GET /doctor/patient-select` · `GET /doctor/appointments` · `PATCH /doctor/appointments/:id/status` · `/doctor/consultation-notes` (CRUD) · `/doctor/prescriptions` (list, create, delete) · `/doctor/tests` (list, create, delete) · `GET|PATCH /doctor/settings/profile` · `GET|PATCH /doctor/settings/preferences` · `POST /doctor/settings/change-password`

## Admin ([[Admin-Services]])
`GET /admin/dashboard/metrics` · `GET /admin/analytics/healthcare` · `GET /admin/users` · `PATCH /admin/users/:id/status` · `GET /admin/doctors` · `PATCH /admin/doctors/:id/verify` · `/admin/clinics` (CRUD + status) · `GET /admin/security/dashboard` · `GET /admin/security/audit-logs` · `GET /admin/reports/dashboard` · `/admin/notifications` (list, read, read-all, delete) · `GET|PATCH /admin/profile` · `PATCH /admin/settings`

> [!NOTE]
> This reference is derived from the frontend. The backend repository is the source of truth for request and response schemas. See [[PostgreSQL-Prisma-Schema]].
