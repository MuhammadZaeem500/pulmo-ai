---
title: Doctor Portal
tags: [portal, doctor]
---

# Doctor Portal

Routes live under `src/app/doctor/`. Shell: `doctor/layout.tsx`, which loads the doctor's profile to display initials. See [[Layouts-And-Navigation]]. Sign-in: `/auth/doctor/sign-in`.

Related: [[Patient-Portal]] · [[Admin-Portal]] · [[Doctor-Services]]

## Onboarding and verification

Doctors register through a stepped sign-up (`AuthStepper`) supplying name, contact details, PMDC licence number, specialty, hospital, qualifications and years of experience. An **admin must approve** the doctor before full use. See [[Authentication-Service]] and [[Admin-Portal]] (Doctor Verification).

## Screens

| Route | Purpose | Service |
|---|---|---|
| `/doctor/dashboard` | Summary metrics and recent activity | `GET /doctor/dashboard` |
| `/doctor/patients` | Search and view assigned patients | `doctorService.getPatients` |
| `/doctor/appointments` | View appointments, mark as Completed | `appointmentService` |
| `/doctor/notes` | Consultation notes: search, create, edit, delete | `consultationService` |
| `/doctor/prescriptions` | Issue, search and delete prescriptions | `prescriptionService` |
| `/doctor/tests` | Recommend diagnostic tests, search, delete | `testService` |
| `/doctor/profile` | Professional profile and **consultation hours** | `profileService` |
| `/doctor/settings` | Account details, password, notification preferences | `doctorSettingsService` |

## Clinical workflows

- **Consultation notes**: choose a patient, enter diagnosis, primary symptom, urgency and history. Dialog: `AddConsultationNoteModal`.
- **Prescriptions**: medication name, dosage, frequency, duration and instructions for a selected patient. Dialog: `AddPrescriptionModal`.
- **Recommended tests**: test name, description and status (default `Pending`). Dialog: `AddTestModal`.
- All three dialogs load the patient dropdown from `GET /doctor/patient-select`. See [[Modals-Library]].

> [!IMPORTANT] Prescription rule
> Prescriptions may only be created or updated by verified doctors attached to a consultation. The backend must enforce this. See [[Security-And-RBAC]].

## Schedule and consultation hours

`ConsultationHoursModal` lets a doctor switch each weekday on or off and set opening and closing times (default Monday to Friday, 09:00 to 17:00). The modal returns a formatted string saved through `profileService.updateProfile({ consultationHours })`. Patients later see slots derived from these hours when booking.
