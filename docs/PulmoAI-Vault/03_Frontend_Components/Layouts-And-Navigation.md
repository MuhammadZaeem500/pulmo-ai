---
title: Layouts and Navigation
tags: [components, layout]
---

# Layouts and Navigation

Part of [[Architecture]]. Each portal wraps its pages in a role layout with a sidebar and a header containing a notification bell and initials avatar.

| Portal | Layout | Sidebar |
|---|---|---|
| Patient | `patient/layout.tsx` (fetches `/patient/profile` for initials) | `PatientSidebar` |
| Doctor | `doctor/layout.tsx` (fetches the doctor profile for initials) | `DoctorSidebar` |
| Admin | `admin/layout.tsx` (static header label, collapsible sidebar) | `AdminSidebar` |

## Navigation items

- **Patient**: Dashboard, Chatbot, Medical History, Symptom Tracker, Prescriptions, Know Your Medicine, Clinics and Specialists, Appointments, Profile, Settings. See [[Patient-Portal]].
- **Doctor**: Dashboard, Patients, Appointments, Notes, Prescriptions, Tests, Profile, Settings. See [[Doctor-Portal]].
- **Admin**: Dashboard, Clinics and Hospitals, Doctor Verification, Users, Healthcare Analytics, Security Center, Reports, Notifications, Settings. See [[Admin-Portal]].

All sidebars collapse into a mobile drawer opened from the header menu button.

## Auth pages

Each role has an `AuthHeroBanner`, and doctors use `AuthStepper` for multi-step sign-up. See [[Authentication-Service]].

## Landing page (`src/components/landing/`)

`HeroSection`, `PowerfulFeatures`, `HowItWorks`, `WhyChooseUs`, `NearbySpecialists`, `Testimonials`, `CtaSection` and `Footer`, assembled in `src/app/page.tsx`. They reuse [[Common-Components]] such as `FeatureCard` and `TestimonialCard`.

## Other app files

- `src/app/layout.tsx`: root layout and global styles (`globals.css`).
- `src/app/not-found.tsx`: custom 404 page.

> [!NOTE]
> Layouts do not currently verify the signed-in role before rendering. Route protection is discussed in [[Security-And-RBAC]].
