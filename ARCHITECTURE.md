# PulmoAI Frontend Architecture (Next.js & React Redux)

## 1. Directory Structure
```
pulmo-ai
├── .gitignore
├── AGENTS.md
├── ARCHITECTURE.md
├── CLAUDE.md
├── Folder Structure Script.sh
├── README.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── favicon.ico
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   │   ├── admin
│   │   │   ├── analytics
│   │   │   │   └── page.tsx
│   │   │   ├── clinics
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── notifications
│   │   │   │   └── page.tsx
│   │   │   ├── reports
│   │   │   │   └── page.tsx
│   │   │   ├── security
│   │   │   │   └── page.tsx
│   │   │   ├── settings
│   │   │   │   └── page.tsx
│   │   │   └── users
│   │   │       └── page.tsx
│   │   ├── auth
│   │   │   ├── admin
│   │   │   │   ├── sign-in
│   │   │   │   │   └── page.tsx
│   │   │   │   └── sign-up
│   │   │   │       └── page.tsx
│   │   │   ├── doctor
│   │   │   │   ├── sign-in
│   │   │   │   │   └── page.tsx
│   │   │   │   └── sign-up
│   │   │   │       └── page.tsx
│   │   │   └── patient
│   │   │       ├── sign-in
│   │   │       │   └── page.tsx
│   │   │       └── sign-up
│   │   │           └── page.tsx
│   │   ├── doctor
│   │   │   ├── appointments
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── notes
│   │   │   │   └── page.tsx
│   │   │   ├── patients
│   │   │   │   └── page.tsx
│   │   │   ├── prescriptions
│   │   │   │   └── page.tsx
│   │   │   ├── profile
│   │   │   │   └── page.tsx
│   │   │   ├── settings
│   │   │   │   └── page.tsx
│   │   │   └── tests
│   │   │       └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── patient
│   │       ├── appointments
│   │       │   └── page.tsx
│   │       ├── chatbot
│   │       │   └── page.tsx
│   │       ├── clinics-specialists
│   │       │   └── page.tsx
│   │       ├── dashboard
│   │       │   └── page.tsx
│   │       ├── know-your-medicine
│   │       │   └── page.tsx
│   │       ├── layout.tsx
│   │       ├── medical-history
│   │       │   └── page.tsx
│   │       ├── prescriptions
│   │       │   └── page.tsx
│   │       ├── profile
│   │       │   └── page.tsx
│   │       ├── settings
│   │       │   └── page.tsx
│   │       └── symptom-tracker
│   │           └── page.tsx
│   ├── components
│   │   ├── admin
│   │   │   ├── AddClinicModal.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AuthHeroBanner.tsx
│   │   │   ├── SecurityAlertModal.tsx
│   │   │   └── UserDetailsModal.tsx
│   │   ├── common
│   │   │   ├── AvailableDoctorCard.tsx
│   │   │   ├── ChatHistoryItem.tsx
│   │   │   ├── DashboardCard.tsx
│   │   │   ├── DoctorClinicCard.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── MedicalRecordCard.tsx
│   │   │   ├── MedicineColorCard.tsx
│   │   │   ├── MedicineShapeCard.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── PrescriptionCard.tsx
│   │   │   ├── PreviousAppointmentCard.tsx
│   │   │   ├── ProfileField.tsx
│   │   │   ├── ProfilePrescriptionItem.tsx
│   │   │   ├── SettingSectionCard.tsx
│   │   │   ├── SettingToggleItem.tsx
│   │   │   ├── SymptomCard.tsx
│   │   │   └── TestimonialCard.tsx
│   │   ├── doctor
│   │   │   ├── AuthHeroBanner.tsx
│   │   │   ├── AuthStepper.tsx
│   │   │   └── DoctorSidebar.tsx
│   │   ├── landing
│   │   │   ├── CtaSection.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── NearbySpecialists.tsx
│   │   │   ├── PowerfulFeatures.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── WhyChooseUs.tsx
│   │   └── paitient
│   │       ├── AuthHeroBanner.tsx
│   │       └── PatientSidebar.tsx
│   └── store
└── tsconfig.json
```

## 2. Redux Store Configuration (`store.ts`)
```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## 3. Key Frontend Modules to Implement First
1. **Authentication & RBAC Wrapper:** Guarding patient, doctor, and admin routes based on Redux auth state.
2. **AI Symptom Chatbot Interface:** Interactive chat stream managing symptoms input, displaying predicted confidence scores, and enforcing the high-urgency appointment prompt.
3. **Clinic Finder & EHR Viewer:** Tables and cards for medical history and Google Maps integrated facility listing.