---
title: Medical Records Service
tags: [services, ehr]
---

# Medical Records Service (`medical-records.service.ts`)

Powers the patient EHR screen. See [[Patient-Portal]] and [[Modals-Library]] (`AddMedicalRecordModal`, `MedicalRecordDetailsModal`).

| Method | Request | Purpose |
|---|---|---|
| `getMyRecords()` | `GET /medical-records/my-records` | Records created by the patient |
| `getCompleteHistory()` | `GET /medical-records/complete-history` | Unified history (used by the Medical History page) |
| `createRecord(dto)` | `POST /medical-records/intake` | New record |
| `updateRecord(id, dto)` | `PATCH /medical-records/records/:id` | Edit |
| `deleteRecord(id)` | `DELETE /medical-records/records/:id` | Delete |

## Record payload (form fields)

| Field | Type / default |
|---|---|
| `primarySymptom` | string |
| `durationInDays` | number, default 1 |
| `diagnosis` | string |
| `symptomsDiscussed` | string |
| `recommendations` | string |
| `confidenceScore` | number 0 to 1, default 0.95 |
| `urgencyLevel` | `Low` / `Medium` / `High`, default `Medium` |
| `medicalHistory` | string |

> [!NOTE]
> This module builds Axios calls itself rather than using [[API-Client]], reading `NEXT_PUBLIC_API_URL` and `localStorage.token`.

> [!IMPORTANT]
> `High` urgency must trigger the appointment prompt described in [[Patient-Portal]].

Types are loosely typed (`any`) today. See [[TypeScript-Interfaces]].
