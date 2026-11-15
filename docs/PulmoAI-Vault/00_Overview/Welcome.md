---
title: Welcome to PulmoAI
tags: [overview, pulmoai]
---

# Welcome to PulmoAI

**PulmoAI** is an AI-assisted pulmonary health advisory and records platform, built as a final-year project at the University of Management and Technology (UMT), Lahore. It gives patients, doctors and administrators their own web portal for respiratory care, with a focus on asthma, COPD, pneumonia, tuberculosis and bronchitis.

> [!WARNING] Medical disclaimer
> PulmoAI is an educational project. It does not provide medical advice, diagnosis or treatment. AI-generated output is preliminary and advisory only and must be reviewed by a qualified healthcare professional.

## What this vault covers

This vault documents the **web client** (the `pulmo-ai` Next.js repository). The server (API, database, AI services) lives in a separate backend repository, so backend topics are described here only from the client's point of view. See [[Architecture]] for the split.

| Section | Start here |
|---|---|
| Overview | [[Architecture]] · [[Tech-Stack]] |
| Portals | [[Patient-Portal]] · [[Doctor-Portal]] · [[Admin-Portal]] |
| Services and API | [[API-Client]] · [[Authentication-Service]] · [[Medical-Records-Service]] · [[Patient-Services]] · [[Doctor-Services]] · [[Admin-Services]] · [[API-Endpoint-Reference]] |
| Components | [[Common-Components]] · [[Modals-Library]] · [[Layouts-And-Navigation]] |
| Data | [[TypeScript-Interfaces]] · [[PostgreSQL-Prisma-Schema]] |
| DevOps and security | [[CI-CD-Workflow]] · [[Security-And-RBAC]] · [[Setup-And-Configuration]] |

## The three portals at a glance

- **Patient**: AI chatbot, symptom tracker, medical history, prescriptions, appointments, clinic finder, medicine identifier. See [[Patient-Portal]].
- **Doctor**: patients, appointments, consultation notes, prescriptions, recommended tests, consultation hours. See [[Doctor-Portal]].
- **Admin**: analytics, user management, doctor verification, clinics, security alerts, reports, notifications. See [[Admin-Portal]].

## Implementation status

> [!NOTE] Early development
> Most screens are connected to the backend. The items below are known gaps and are tracked in the project roadmap.

| Area | Status |
|---|---|
| Role-based sign-in/sign-up (patient, doctor, admin) | Built. See [[Authentication-Service]] |
| Doctor/Admin/Patient dashboards and CRUD screens | Built and calling the API |
| AI chatbot | Calls backend endpoints for sessions, analysis and doctor recommendation. Model quality depends on the backend AI service |
| Symptom tracker analysis | Sends fixed placeholder predictions from the client; real model integration pending. See [[Patient-Services]] |
| Chest X-ray upload and analysis screen | Planned |
| Automated tests | Planned. CI currently runs type-check and build only. See [[CI-CD-Workflow]] |
| Route protection and token hardening | Needs strengthening before production. See [[Security-And-RBAC]] |

## Safety rule built into the product

If the AI assessment returns an urgency of **High**, the interface must prominently prompt the patient to book an appointment. See [[Patient-Portal]] and [[Security-And-RBAC]].
