---
title: TypeScript Interfaces
tags: [types]
---

# TypeScript Interfaces (`src/types/`)

Companion to [[Common-Components]], [[Modals-Library]] and [[PostgreSQL-Prisma-Schema]].

## `admin.types.ts`

| Type | Key fields |
|---|---|
| `Clinic` | `id`, `name`, `phone`, `location`, `status` (`Verified`/`Pending`/`Suspended`), `specialists`, `type`, `since` |
| `DoctorRequest` | `userId`, `email`, `createdAt`, optional `profile { fullName, licenseNumber, specialization }` |
| `User` | `id`, `name`, `email`, `role`, `registered`, `lastLogin`, `status` (`Active`/`Pending`/`Suspended`), `avatarBg`, `initials` |
| `SecurityAlert` | `id`, `title`, `severity` (`Critical`/`High`/`Medium`/`Low`), `status` (`Open`/`Investigating`/`Resolved`), `description`, `date`, `icon` |
| `Notification` | `id`, `title`, `description`, `time`, `type` (`Verification`/`Security`/`System`/`Update`), `isRead`, `isUrgent`, styling fields |
| `ReportItem`, `RecentDownload` | Report metadata and download history (`PDF`/`CSV`/`XLSX`) |
| `AdminSidebarProps`, `AddClinicModalProps` | Component props |

Used by [[Admin-Portal]].

## `common.types.ts`

Props for shared UI: `DashboardCardProps`, `MetricCardProps`, `MedicalRecordCardProps`, `PrescriptionCardProps`, `SymptomCardProps`, `AvailableDoctorCardProps`, `DoctorClinicCardProps`, `PreviousAppointmentCardProps`, `ChatHistoryItemProps`, `ProfileFieldProps`, `SettingSectionCardProps`, `SettingToggleItemProps`, `FeatureCardProps`, `TestimonialCardProps`, `MedicineColorCardProps`, `MedicineShapeCardProps`, `ProfilePrescriptionItemProps`. See [[Common-Components]].

## `modal.types.ts`

`BaseModalProps`, `ModalProps`, `ActionModalProps`, `AddMedicalRecordModalProps`, `ConsultationNoteModalProps`, `EditNoteModalProps`, `SecurityAlertModalProps`, `UserDetailsModalProps`. See [[Modals-Library]].

## `doctor.types.ts` and `patient.types.ts`

- `AuthStepperProps { currentStep }`, `DoctorSidebarProps` ([[Doctor-Portal]])
- `ItemData` (directory entry) and `SidebarProps` ([[Patient-Portal]])

## Chatbot types (declared in the page)

`Slot`, `Doctor`, `Attachment`, `Message { role: user|assistant, content, doctors?, attachment? }`, `ChatSessionItem`.

> [!WARNING] Typing gaps
> API payloads and responses are mostly typed `any`, and `SecurityAlert` and `User` are declared twice in `admin.types.ts`. The project guidelines require explicit request and response interfaces, so adding DTO types for each service in [[API-Endpoint-Reference]] is a recommended cleanup.
