<!-- # 🫁 PulmoAI — Intelligent Healthcare & Pulmonary Management Platform

PulmoAI is a modern healthcare platform designed to improve pulmonary care and simplify clinic management. It provides dedicated portals for administrators, doctors, and patients, with features for healthcare analytics, appointment management, medical records, AI-assisted symptom tracking, and medicine identification.

## 🚀 Key Features

### 🛠️ Admin Portal
- **Dashboard & Analytics:** View platform activity, daily queries, and health trends.
- **Healthcare Analytics:** Track symptom patterns, pulmonary conditions such as COPD, asthma, and pneumonia, seasonal health metrics, and user engagement.
- **Clinic & Hospital Management:** Review, verify, approve, or suspend healthcare facilities.
- **User & Role Management:** Manage patient, doctor, and administrator accounts and permissions.
- **Security Center:** Monitor threats, review vulnerabilities, track severity levels, and manage security alerts.
- **Reports & Notifications:** Export administrative reports in PDF, CSV, XLSX, and JSON formats and manage system notifications.
- **Account Settings:** Configure account preferences, security options, two-factor authentication, session timeout, notifications, language, and theme.

### 🩺 Doctor Portal
- **Doctor Dashboard:** View important information and manage daily clinical activities.
- **Patient Records:** Review patient details, medical histories, and consultation notes.
- **Prescriptions & Diagnostic Tests:** Create digital prescriptions and recommend pulmonary diagnostic tests.
- **Appointment Management:** View and manage upcoming patient consultations.
- **Profile & Settings:** Manage professional information and account preferences.

### 👤 Patient Portal
- **AI Symptom Tracker:** Record symptoms and receive AI-assisted guidance.
- **AI Chatbot:** Interact with a chatbot for preliminary health information and symptom guidance.
- **Know Your Medicine:** Identify medicines using pill-related information and access medicine safety details.
- **Clinic & Specialist Finder:** Discover pulmonary specialists and find clinics.
- **Appointment Management:** Manage medical appointments.
- **Medical History:** Access available medical records, prescriptions, and previous visit summaries.
- **Personal Dashboard:** View relevant health information and patient activities.

> **Medical Disclaimer:** PulmoAI is intended to support healthcare management and provide health information. AI-generated guidance is not a substitute for professional medical advice, diagnosis, or treatment. Medicine identification results should be verified by a qualified healthcare professional.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) | React framework and application routing |
| [React](https://react.dev/) | User interface development |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe application development |
| [Tailwind CSS](https://tailwindcss.com/) | Responsive styling |
| [Lucide React](https://lucide.dev/) | Icons |
| [Turbopack](https://turbo.build/pack) | Development build tooling through Next.js |

## 📂 Project Structure

```text
pulmo-ai/
├── public/                     # Static assets and icons
├── src/
│   ├── app/
│   │   ├── admin/              # Admin portal pages
│   │   │   ├── analytics/
│   │   │   ├── clinics/
│   │   │   ├── dashboard/
│   │   │   ├── notifications/
│   │   │   ├── reports/
│   │   │   ├── security/
│   │   │   ├── settings/
│   │   │   └── users/
│   │   ├── auth/               # Role-based authentication pages
│   │   │   ├── admin/
│   │   │   ├── doctor/
│   │   │   └── patient/
│   │   ├── doctor/             # Doctor portal pages
│   │   ├── patient/            # Patient portal pages
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── admin/              # Admin-specific components
│   │   ├── common/             # Shared UI components
│   │   ├── doctor/             # Doctor-specific components
│   │   ├── landing/            # Landing page components
│   │   └── paitient/           # Patient-specific components
│   └── store/                  # Application state management
├── .gitignore
├── AGENTS.md
├── ARCHITECTURE.md
├── CLAUDE.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

*Note: This structure summarizes the main folders. Some files may be omitted for readability. The `paitient` folder name matches the structure provided and can be renamed to `patient` if desired.*

## 🏁 Getting Started

Follow these steps to run PulmoAI locally.

### Prerequisites

Make sure you have the following installed:

- **Node.js:** Version 18 or later
- **npm:** Installed with Node.js
- **Git:** Required to clone the repository

### 1. Clone the Repository

```bash
git clone https://github.com/muhammad-zaeem-sheikh/PulmoAI.git
```

### 2. Navigate to the Project Directory

```bash
cd PulmoAI/pulmo-ai
```

If the repository already opens directly into the `pulmo-ai` directory, navigate to that directory instead.

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open the Application

Visit the following URL in your browser:

[http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

The following are common Next.js scripts. Confirm their exact names in `package.json`.

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs linting, if configured |

## 🔐 Environment Variables

If the project uses external APIs, a backend service, or other environment-based configuration, create a `.env.local` file in the application root.

For example:

```env
# Add the environment variables required by your project
# NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Use the actual values required by your application. Never commit API keys, passwords, tokens, or other secrets to Git.

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome.

1. Fork the repository.
2. Create a new branch for your changes.
3. Make and test your changes.
4. Commit your work with a clear commit message.
5. Open a pull request describing your updates.

For bugs or feature requests, visit the [PulmoAI GitHub repository](https://github.com/muhammad-zaeem-sheikh/PulmoAI).

## 📄 License

This project is intended to be available under the MIT License. Make sure a `LICENSE` file containing the MIT License is included in the repository before describing the project as officially licensed under it.

---

**PulmoAI** — Supporting better pulmonary care through technology. -->
