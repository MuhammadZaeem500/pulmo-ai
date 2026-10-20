# PulmoAI Frontend Architecture (Next.js & React Redux)

## 1. Directory Structure
```
pulmoai-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── patient/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── chatbot/page.tsx
│   │   │   ├── records/page.tsx
│   │   │   └── clinics/page.tsx
│   │   ├── doctor/
│   │   │   ├── dashboard/page.tsx
│   │   │   └── consultations/page.tsx
│   │   ├── admin/
│   │   │   └── dashboard/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/               # Reusable atomic components
│   │   ├── chat/             # Chatbot interface components
│   │   └── portals/          # Portal-specific layout wrappers
│   ├── store/
│   │   ├── hooks.ts          # Typed useDispatch & useSelector
│   │   ├── store.ts          # Redux store configuration
│   │   └── slices/
│   │       ├── authSlice.ts  # User session & role management
│   │       └── chatSlice.ts  # Symptom analysis & chatbot state
│   ├── services/
│   │   └── api.ts            # Axios/Fetch client targeting backend API
│   └── types/
│       └── index.ts          # Shared TypeScript interfaces
├── tailwind.config.ts
└── package.json
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