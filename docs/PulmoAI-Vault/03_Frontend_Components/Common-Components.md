---
title: Common Components
tags: [components, ui]
---

# Common Components (`src/components/common/`)

Shared, presentational building blocks used across the [[Patient-Portal]], [[Doctor-Portal]] and [[Admin-Portal]]. Props are defined in `src/types/common.types.ts` ([[TypeScript-Interfaces]]). Dialogs are documented in [[Modals-Library]].

## Layout and dashboard

| Component | Purpose | Key props |
|---|---|---|
| `DashboardCard` | Titled container with icon, optional "view all" link and action | `title`, `icon`, `viewAllLink`, `actionText`, `onAction`, `children` |
| `MetricCard` | KPI tile with value and trend | `title`, `value`, `trend`, `trendColor`, `icon`, `iconBgColor` |
| `FeatureCard` | Marketing/feature tile, optional badge or step number | `icon`, `title`, `description`, `badge`, `isPopular`, `stepNumber` |
| `TestimonialCard` | Landing-page quote | `quote`, `name`, `role`, `avatarInitial` |

## Clinical and patient cards

| Component | Purpose | Key props |
|---|---|---|
| `MedicalRecordCard` | One EHR entry: date, diagnosis, symptoms, confidence, urgency, recommendations | `onViewDetails`, `onDownloadReport` |
| `PrescriptionCard` | Medicine, doctor, date, dosage, duration | `onDownload`, `onViewFull` |
| `ProfilePrescriptionItem` | Compact prescription row for profiles | `medicine`, `prescribedDate`, `status` |
| `SymptomCard` | Symptom with severity (`Mild`/`Moderate`/`Severe`) and trend arrow | `trendIcon: right|down|up`, `onViewHistory` |
| `PreviousAppointmentCard` | Past appointment summary | `doctor`, `specialty`, `clinic`, `status`, `notes`, `onChat` |
| `AvailableDoctorCard` | Bookable doctor | `name`, `specialty`, `nextAvailable`, `onBook` |
| `DoctorClinicCard` | Directory entry for a doctor or clinic | `title`, `subtitle`, `rating`, `availability`, `onActionClick` |
| `ChatHistoryItem` | Chatbot session row | `title`, `date`, `isActive`, `onClick` |

## Forms and settings

| Component | Purpose |
|---|---|
| `ProfileField` | Icon, label and value row |
| `SettingSectionCard` | Settings group with icon and title |
| `SettingToggleItem` | Labelled on/off switch (`enabled`, `onToggle`) |
| `MedicineShapeCard`, `MedicineColorCard` | Selectable tiles for [[Patient-Portal]] "Know Your Medicine" |

## Conventions

- Every component is a typed React function component styled with Tailwind utility classes.
- Icons come from Lucide (`LucideIcon` or any `ReactNode`).
- Callbacks (`onX`) keep components stateless so pages own data and API calls ([[Architecture]]).

> [!NOTE]
> `MedicalRecordDetailsModalProps.tsx` is the file name of a dialog component, not a props type. See [[Modals-Library]].
