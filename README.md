# PulmoAI 

Web client for **PulmoAI**, an AI-assisted pulmonary health advisory and records platform built as a final-year project at the University of Management and Technology (UMT), Lahore. It provides separate Patient, Doctor and Admin portals for respiratory care, focused on asthma, COPD, pneumonia, tuberculosis and bronchitis.

> **Medical disclaimer:** PulmoAI is an educational project. It does not provide medical advice, diagnosis or treatment, and AI-generated output is preliminary and advisory only. Always consult a qualified healthcare professional.

**Backend repository:** [PulmoAI Backend](<https://github.com/MuhammadZaeem500/pulmo-ai-backend>)

## Status

Early development. The three portals, role-based sign-in and sign-up flows, and most screens are built. Some screens still use placeholder data, and the AI features (symptom analysis, chatbot) are not yet connected to a model. See the [Roadmap](#roadmap).

## Features

### Patient portal
- Dashboard, profile and settings
- Symptom tracker
- Appointments and clinic/specialist finder
- Medical history and prescriptions
- Know Your Medicine: identify a medicine by colour and shape
- Chatbot interface (UI only for now)

### Doctor portal
- Dashboard, patient list and appointments
- Consultation notes
- Prescriptions and recommended diagnostic tests
- Profile, consultation hours and settings

### Admin portal
- Dashboard, analytics and reports
- User management and doctor verification
- Clinic management
- Security alerts and notifications
- Settings

## Tech stack

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) 16 (App Router) | Framework and routing |
| [React](https://react.dev/) 19 | UI |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) 4 | Styling |
| [MUI](https://mui.com/) | UI components and icons |
| [Lucide](https://lucide.dev/) | Icons |
| [Axios](https://axios-http.com/) | API requests |

## Project structure

```text
.
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── admin/          # analytics, clinics, dashboard, doctor-verification,
│   │   │                   # notifications, reports, security, settings, users
│   │   ├── auth/           # admin/, doctor/, patient/ (sign-in and sign-up each)
│   │   ├── doctor/         # appointments, dashboard, notes, patients,
│   │   │                   # prescriptions, profile, settings, tests
│   │   ├── patient/        # appointments, chatbot, clinics-specialists, dashboard,
│   │   │                   # know-your-medicine, medical-history, prescriptions,
│   │   │                   # profile, settings, symptom-tracker
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   ├── admin/          # Sidebar, modals, auth banner
│   │   ├── common/         # Shared cards, modals and form pieces
│   │   ├── doctor/         # Sidebar, auth stepper, auth banner
│   │   ├── landing/        # Landing page sections
│   │   └── patient/        # Sidebar, auth banner
│   ├── services/           # Axios client (api.ts) and one service per feature
│   └── types/              # Shared TypeScript types
├── AGENTS.md               # Guidelines for AI coding assistants
├── ARCHITECTURE.md         # Architecture notes
├── CLAUDE.md               # Guidelines for AI coding assistants
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## Getting started

### Prerequisites

- Node.js 20 or later
- npm
- The [PulmoAI backend](<https://github.com/MuhammadZaeem500/pulmo-ai-backend>) running locally

### Installation

```bash
git clone <this-repo-url>
cd <repo-folder>
npm install
```

### Configuration

The frontend and backend both default to port 3000, so run the backend on a different port (for example `PORT=4000`) and point the frontend at it. Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Authentication

Signing in returns a JWT from the backend. The Axios client in `src/services/api.ts` attaches it as a `Bearer` token on every request. Pages are separated by role: `patient`, `doctor` and `admin`.

## Roadmap

- [ ] Connect the chatbot to the backend
- [ ] Connect symptom analysis to the NLP/ML service
- [ ] Replace remaining placeholder data with API calls
- [ ] Chest X-ray upload and analysis screen
- [ ] Improve responsiveness and accessibility across all portals
- [ ] Add tests

## Contributing

Issues and pull requests are welcome.

1. Fork the repository
2. Create a branch for your change
3. Run `npm run lint` and make sure the app builds
4. Open a pull request describing what you changed and why

## License

Copyright (c) 2026 PulmoAI contributors. All rights reserved.

This code is shared for viewing only. See [LICENSE](LICENSE) for details.

## Acknowledgements

Built by <UMTians> as a final-year project at the University of Management and Technology, Lahore.