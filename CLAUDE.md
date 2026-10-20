# Claude.md — Developer Guidelines & Instructions for PulmoAI (Next.js)

## 1. Project Context & Objectives
You are assisting in building **PulmoAI**, an undergraduate Final Year Project at UMT Lahore. The system targets pulmonary healthcare diagnostics, triage, and record management in Pakistan.

## 2. Coding Standards & Conventions
- **Language & Types:** Write strictly in TypeScript (`.tsx` / `.ts`). Avoid `any` types; define explicit interfaces or types for all state slices, API requests, and responses.
- **Next.js Best Practices:** 
  - Leverage Server Components by default; use Client Components (`'use client'`) only when interactive state (Redux hooks, event listeners) is required.
  - Use Next.js App Router conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- **State Management:** Use **React Redux (Redux Toolkit)** for global client-side state (e.g., active user session, UI toggles, chat state) and React Query/Server Actions for asynchronous data fetching.
- **Database & ORM:** All data persistence must go through **PostgreSQL** managed via **Prisma ORM**. Maintain strict relational integrity across users, consultations, prescriptions, and medical records.
- **Styling:** Use Tailwind CSS utility classes. Ensure mobile responsiveness across mobile, tablet, and desktop viewports.
- **Error Handling & Validation:** Validate all form inputs using **Zod** schemas combined with React Hook Form. Return clean, user-friendly error boundaries and toast notifications.

## 3. Core Domain Rules to Enforce
- **Role-Based Access Control (RBAC):** Ensure routes are strictly guarded by user roles (`patient`, `doctor`, `admin`).
- **Prescription Constraint:** Prescriptions can *only* be created or updated by verified Doctors attached to a consultation record in PostgreSQL.
- **High-Urgency Rule:** If the AI Symptom Analyzer returns `urgencyLevel = "High"`, the UI *must* prominently display an immediate prompt encouraging the patient to schedule an appointment.