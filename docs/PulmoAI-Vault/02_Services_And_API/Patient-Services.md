---
title: Patient Services
tags: [services, patient]
---

# Patient Services

Used by the [[Patient-Portal]]. Base client: [[API-Client]]. Records: [[Medical-Records-Service]].

## `symptomService` (`symptom.service.ts`)

| Method | Request |
|---|---|
| `getAssessments()` | `GET /patient/symptoms` |
| `createAssessment(dto)` | `POST /patient/symptoms` |
| `deleteAssessment(id)` | `DELETE /patient/symptoms/:id` |

The tracker submits `symptomText`, `urgency`, `recommendedSpecialist`, `modelName`, `modelVersion` and a `predictions` array of `{ condition, confidence, rank }`.

> [!WARNING] Placeholder predictions
> The screen currently sends fixed model name, version and prediction values. Replace these with backend-generated results once the ML service is connected.

## `prescriptionService` (patient side)

| Method | Request |
|---|---|
| `getMyPrescriptions()` | `GET /patient/prescriptions` |
| `getPrescriptionById(id)` | `GET /patient/prescriptions/:id` |

Doctor-side methods are in [[Doctor-Services]].

## `patientProfileService` (`profile.service.ts`)

`getProfile()` → `GET /patient/profile`; `updateProfile(dto)` → `PATCH /patient/profile` with `fullName`, `phoneNumber`, `gender`, `address`, `dateOfBirth`, `bloodGroup`.

## `settingsService` (`settings.service.ts`)

| Method | Request |
|---|---|
| `getPreferences()` / `updatePreferences()` | `GET`/`PATCH /patient/settings/preferences` (email notifications, appointment reminders, health tips, language, time zone, dark mode) |
| `changePassword(current, next)` | `POST /patient/settings/change-password` |
| `deleteAccount()` | `DELETE /patient/settings/account` |

## Direct `fetch` calls inside pages

These features call the API from the page component rather than a service module:

- Chatbot: `/patient/chatbot/sessions`, `/messages`, `/analyze-and-recommend`
- Appointments: `/patient/appointments`, `/patient/directory/doctors`
- Directory: `/patient/directory/clinics`, `/patient/directory/doctors`
- Medicine identifier: `/medicines/identify`

See [[API-Endpoint-Reference]].
