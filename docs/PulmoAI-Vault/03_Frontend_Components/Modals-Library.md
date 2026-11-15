---
title: Modals Library
tags: [components, modals]
---

# Modals Library

Dialog components live in `src/components/common/` (shared) and `src/components/admin/` (admin only). Prop types are in `src/types/modal.types.ts` ([[TypeScript-Interfaces]]). Cards that open them: [[Common-Components]].

## Base primitives

| Component | Description |
|---|---|
| `Modal` | Generic dialog: `isOpen`, `onClose`, `title`, `children`, optional `maxWidth` |
| `AdminModal` | Admin-styled dialog wrapper |

All dialogs extend `BaseModalProps { isOpen, onClose }`.

## Clinical dialogs

| Component | Used by | Fields | Service |
|---|---|---|---|
| `AddMedicalRecordModal` | Patient history | primary symptom, duration, diagnosis, symptoms discussed, recommendations, confidence, urgency, history | [[Medical-Records-Service]] (create or update) |
| `MedicalRecordDetailsModalProps` | Patient history | Read-only details, download, delete | `medicalRecordsService.deleteRecord` |
| `AddPrescriptionModal` | Doctor prescriptions | patient, medication, dosage, frequency, duration, instructions | `prescriptionService.createPrescription` ([[Doctor-Services]]) |
| `AddTestModal` | Doctor tests | patient, test name, description, status (`Pending`) | `testService.createTest` |
| `AddConsultationNoteModal` | Doctor notes | patient, diagnosis, primary symptom, urgency (`Stable` default), history. Supports edit via `noteToEdit` | `consultationService` |
| `ConsultationHoursModal` | Doctor profile | Per-day on/off with open and close times | `profileService.updateProfile` |

The three doctor dialogs fetch patients from `GET /doctor/patient-select` when opened.

## Admin dialogs

| Component | Purpose |
|---|---|
| `AddClinicModal` | Create a clinic (name, location, phone, specialists, type). See [[Admin-Portal]] |
| `UserDetailsModal` | View a user and toggle suspension |
| `SecurityAlertModal` | View an alert and mark it resolved |

## Behaviour notes

- A dialog returns `null` when `isOpen` is false and resets its form when reopened.
- On success it calls `onSave(result)` so the parent page can refresh its list.
- Errors are currently surfaced with browser `alert()` in several dialogs. A toast component would be a UX improvement.
