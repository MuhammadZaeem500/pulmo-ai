---
title: Patient Portal
tags: [portal, patient]
---

# Patient Portal

Routes live under `src/app/patient/`. The shell (sidebar, header, initials avatar) is `patient/layout.tsx`. See [[Layouts-And-Navigation]]. Sign-in: `/auth/patient/sign-in` ([[Authentication-Service]]).

Related: [[Doctor-Portal]] · [[Admin-Portal]] · [[Patient-Services]] · [[Medical-Records-Service]]

## Screens

| Route | Purpose | Data source |
|---|---|---|
| `/patient/dashboard` | Quick-access cards to chatbot, history, appointments, prescriptions, symptom tracker | Navigation cards ([[Common-Components]]) |
| `/patient/chatbot` | AI symptom chat with history, file attachments and doctor recommendations | `/patient/chatbot/*` |
| `/patient/symptom-tracker` | Log symptoms, review assessments, delete entries | `/patient/symptoms` |
| `/patient/medical-history` | Unified EHR timeline, add/edit/delete records | `/medical-records/*` |
| `/patient/prescriptions` | Prescriptions issued by doctors | `/patient/prescriptions` |
| `/patient/appointments` | Book appointments and view previous ones | `/patient/appointments`, `/patient/directory/doctors` |
| `/patient/clinics-specialists` | Directory of clinics and specialists | `/patient/directory/clinics` and `/doctors` |
| `/patient/know-your-medicine` | Identify a medicine by colour and shape | `/medicines/identify` |
| `/patient/profile` | Personal details (name, phone, gender, address, date of birth, blood group) | `/patient/profile` |
| `/patient/settings` | Notification and language preferences, change password, delete account | `/patient/settings/*` |

## AI chatbot

1. The patient describes symptoms (optionally attaching a file).
2. The client sends `symptomText`, optional `sessionId` and `file` as multipart form data to `POST /patient/chatbot/analyze-and-recommend`.
3. The reply carries the assistant message, the session id, an optional attachment and a list of recommended doctors with a specialization.
4. For each recommended doctor the client loads available slots and lets the patient book an appointment directly in the chat.
5. Sessions can be listed, renamed, deleted and reopened.

> [!WARNING] Advisory only
> AI output is preliminary. Every medical result must keep the advisory framing and point to physician review.

> [!IMPORTANT] High-urgency rule
> When an assessment has `urgencyLevel = "High"`, the UI must prominently encourage booking an appointment.

## Symptom tracker

Each assessment records symptom text, urgency, a recommended specialist, and ranked condition predictions with confidence values. The current client submits fixed placeholder predictions and model metadata, so real model output still needs to be wired through the backend. See [[Patient-Services]].

## Medical history (EHR)

Records contain primary symptom, duration in days, diagnosis, symptoms discussed, recommendations, a confidence score, an urgency level and free-text history. Cards come from [[Common-Components]]; add/edit/detail dialogs come from [[Modals-Library]].

## Know Your Medicine

The patient picks a shape and a colour from selectable cards. The client calls `GET /medicines/identify` with those filters and lists matches.

## Appointments and directory

- Browse doctors and clinics, then book from the Appointments tab.
- Previous appointments show doctor, specialty, date, clinic, status and notes, with a chat shortcut.

> [!NOTE] Security
> Patients should only ever see their own data. Enforcement is the backend's job. See [[Security-And-RBAC]].
