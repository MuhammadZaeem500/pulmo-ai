---
title: Doctor Services
tags: [services, doctor]
---

# Doctor Services

Used by the [[Doctor-Portal]]. Base client: [[API-Client]].

| Service | Method | Request |
|---|---|---|
| `doctorService` | `getPatients(search)` | `GET /doctor/patients?search=` |
| `doctorPortalService` | `getProfile()` | `GET /doctor/profile` |
| `doctorDashboardService` | `getDashboardData()` | `GET /doctor/dashboard` |
| `doctorSettingsService` | `getProfile` / `updateProfile` | `GET`/`PATCH /doctor/settings/profile` |
| | `changePassword` | `POST /doctor/settings/change-password` |
| | `getPreferences` / `updatePreferences` | `GET`/`PATCH /doctor/settings/preferences` |
| `profileService` | `getProfile` / `updateProfile` | `GET`/`PATCH /doctor/profile` (includes `consultationHours`) |
| `appointmentService` | `getAppointments()` | `GET /doctor/appointments` |
| | `updateStatus(id, status)` | `PATCH /doctor/appointments/:id/status` |
| `consultationService` | `getNotes`, `createNote`, `updateNote`, `deleteNote` | `/doctor/consultation-notes[/:id]` |
| `prescriptionService` | `getPrescriptions`, `createPrescription`, `deletePrescription` | `/doctor/prescriptions[/:id]` |
| `testService` | `getTests`, `createTest`, `deleteTest` | `/doctor/tests[/:id]` |

Search-enabled lists use a `?search=` query and a 300 ms debounce in the page.

The modals that feed these services also call `GET /doctor/patient-select` to populate the patient dropdown. See [[Modals-Library]].

> [!IMPORTANT]
> Prescription creation is restricted to verified doctors. This is enforced server-side. See [[Security-And-RBAC]].

Patient counterparts: [[Patient-Services]].
