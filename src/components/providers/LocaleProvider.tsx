"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type AppLanguage = "English" | "English (US)" | "Spanish" | "French" | "German";
export type AppDateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";

const LANG_CODE_MAP: Record<string, string> = {
  English: "en",
  "English (US)": "en",
  Spanish: "es",
  French: "fr",
  German: "de",
};

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    // Common
    settings: "Settings",
    settingsSubtitle: "Manage your account preferences and privacy settings",
    saveChanges: "Save Changes",
    saving: "Saving...",
    notifications: "Notifications",
    dashboard: "Dashboard",
    logout: "Logout",
    welcome: "Welcome back! Here's your health overview",
    // Dashboard Cards
    startChat: "Start a chat about respiratory symptoms",
    openAIChatbot: "Open AI Chatbot",
    noConsultationHistory: "No consultation history recorded yet",
    viewHistory: "View History",
    noUpcomingAppointments: "No upcoming appointments scheduled",
    viewDetails: "View Details",
    noRecentPrescriptions: "No recent prescriptions found",
    viewAll: "View All",
    noSymptomsLogged: "No symptoms logged yet",
    trackSymptoms: "Track Symptoms",
    // Patient Nav
    patientPortal: "Patient Portal",
    symptomTracker: "Symptom Tracker",
    aiChatbot: "AI Symptom Chatbot",
    medicalHistory: "Medical History",
    prescriptions: "Prescriptions",
    appointments: "Appointments",
    clinicsSpecialists: "Clinics & Specialists",
    knowYourMedicine: "Know Your Medicine",
    profile: "Profile",
    // Doctor Nav
    doctorPortal: "Doctor Portal",
    patients: "Patients",
    consultationNotes: "Consultation Notes",
    diagnosticTests: "Diagnostic Tests",
    messages: "Messages",
    // Admin Nav
    adminPortal: "PulmoAI Admin",
    clinicsHospitals: "Clinics & Hospitals",
    doctorVerification: "Doctor Verification",
    users: "Users",
    healthcareAnalytics: "Healthcare Analytics",
    securityCenter: "Security Center",
    reports: "Reports",
    // Settings Sections
    accountSettings: "Account Settings",
    securitySettings: "Security Settings",
    notificationPreferences: "Notification Preferences",
    languageRegion: "Language & Region",
    themePreferences: "Theme Preferences",
    preferences: "Preferences",
    language: "Language",
    timeZone: "Time Zone",
    dateFormat: "Date Format",
    darkMode: "Dark Mode",
    changePassword: "Change Password",
    deleteAccount: "Delete Account",
  },
  es: {
    settings: "Configuración",
    settingsSubtitle: "Administra tus preferencias de cuenta y privacidad",
    saveChanges: "Guardar cambios",
    saving: "Guardando...",
    notifications: "Notificaciones",
    dashboard: "Panel",
    logout: "Cerrar sesión",
    welcome: "¡Bienvenido! Aquí está tu resumen de salud",
    // Dashboard Cards
    startChat: "Comienza una conversación sobre síntomas respiratorios",
    openAIChatbot: "Abrir Chatbot IA",
    noConsultationHistory: "Sin historial de consultas registrado aún",
    viewHistory: "Ver Historial",
    noUpcomingAppointments: "Sin citas próximas programadas",
    viewDetails: "Ver Detalles",
    noRecentPrescriptions: "Sin recetas recientes encontradas",
    viewAll: "Ver Todo",
    noSymptomsLogged: "Sin síntomas registrados aún",
    trackSymptoms: "Registrar Síntomas",
    patientPortal: "Portal del Paciente",
    symptomTracker: "Registro de Síntomas",
    aiChatbot: "Chatbot de Síntomas IA",
    medicalHistory: "Historial Médico",
    prescriptions: "Recetas",
    appointments: "Citas",
    clinicsSpecialists: "Clínicas y Especialistas",
    knowYourMedicine: "Conoce tu Medicina",
    profile: "Perfil",
    doctorPortal: "Portal del Médico",
    patients: "Pacientes",
    consultationNotes: "Notas de Consulta",
    diagnosticTests: "Pruebas Diagnósticas",
    messages: "Mensajes",
    adminPortal: "Admin PulmoAI",
    clinicsHospitals: "Clínicas y Hospitales",
    doctorVerification: "Verificación de Médicos",
    users: "Usuarios",
    healthcareAnalytics: "Analítica de Salud",
    securityCenter: "Centro de Seguridad",
    reports: "Informes",
    accountSettings: "Configuración de Cuenta",
    securitySettings: "Configuración de Seguridad",
    notificationPreferences: "Preferencias de Notificación",
    languageRegion: "Idioma y Región",
    themePreferences: "Preferencias de Tema",
    preferences: "Preferencias",
    language: "Idioma",
    timeZone: "Zona Horaria",
    dateFormat: "Formato de Fecha",
    darkMode: "Modo Oscuro",
    changePassword: "Cambiar Contraseña",
    deleteAccount: "Eliminar Cuenta",
  },
  fr: {
    settings: "Paramètres",
    settingsSubtitle: "Gérez les préférences de votre compte et votre confidentialité",
    saveChanges: "Enregistrer",
    saving: "Enregistrement...",
    notifications: "Notifications",
    dashboard: "Tableau de bord",
    logout: "Déconnexion",
    welcome: "Bienvenue! Voici votre aperçu de santé",
    // Dashboard Cards
    startChat: "Commencez une conversation sur les symptômes respiratoires",
    openAIChatbot: "Ouvrir le Chatbot IA",
    noConsultationHistory: "Pas d'historique de consultation enregistré",
    viewHistory: "Afficher l'historique",
    noUpcomingAppointments: "Aucun rendez-vous programmé",
    viewDetails: "Afficher les détails",
    noRecentPrescriptions: "Aucune ordonnance récente trouvée",
    viewAll: "Afficher tout",
    noSymptomsLogged: "Aucun symptôme enregistré",
    trackSymptoms: "Enregistrer les symptômes",
    patientPortal: "Portail Patient",
    symptomTracker: "Suivi des Symptômes",
    aiChatbot: "Chatbot Symptômes IA",
    medicalHistory: "Dossier Médical",
    prescriptions: "Ordonnances",
    appointments: "Rendez-vous",
    clinicsSpecialists: "Cliniques et Spécialistes",
    knowYourMedicine: "Connaître vos Médicaments",
    profile: "Profil",
    doctorPortal: "Portail Médecin",
    patients: "Patients",
    consultationNotes: "Notes de Consultation",
    diagnosticTests: "Tests Diagnostiques",
    messages: "Messages",
    adminPortal: "Admin PulmoAI",
    clinicsHospitals: "Cliniques et Hôpitaux",
    doctorVerification: "Vérification des Médecins",
    users: "Utilisateurs",
    healthcareAnalytics: "Analytique Santé",
    securityCenter: "Centre de Sécurité",
    reports: "Rapports",
    accountSettings: "Paramètres du Compte",
    securitySettings: "Paramètres de Sécurité",
    notificationPreferences: "Préférences de Notification",
    languageRegion: "Langue et Région",
    themePreferences: "Préférences de Thème",
    preferences: "Préférences",
    language: "Langue",
    timeZone: "Fuseau Horaire",
    dateFormat: "Format de Date",
    darkMode: "Mode Sombre",
    changePassword: "Changer le Mot de Passe",
    deleteAccount: "Supprimer le Compte",
  },
  de: {
    settings: "Einstellungen",
    settingsSubtitle: "Verwalten Sie Ihre Kontoeinstellungen und den Datenschutz",
    saveChanges: "Änderungen speichern",
    saving: "Speichern...",
    notifications: "Benachrichtigungen",
    dashboard: "Übersicht",
    logout: "Abmelden",
    patientPortal: "Patientenportal",
    symptomTracker: "Symptom-Tracker",
    aiChatbot: "KI-Symptom-Chatbot",
    medicalHistory: "Krankengeschichte",
    prescriptions: "Rezepte",
    appointments: "Termine",
    clinicsSpecialists: "Kliniken & Spezialisten",
    knowYourMedicine: "Medikamente kennen",
    profile: "Profil",
    doctorPortal: "Arztportal",
    patients: "Patienten",
    consultationNotes: "Beratungsnotizen",
    diagnosticTests: "Diagnosetests",
    messages: "Nachrichten",
    adminPortal: "PulmoAI Admin",
    clinicsHospitals: "Kliniken & Krankenhäuser",
    doctorVerification: "Arztverifizierung",
    users: "Benutzer",
    healthcareAnalytics: "Gesundheitsanalytik",
    securityCenter: "Sicherheitszentrum",
    reports: "Berichte",
    accountSettings: "Kontoeinstellungen",
    securitySettings: "Sicherheitseinstellungen",
    notificationPreferences: "Benachrichtigungseinstellungen",
    languageRegion: "Sprache & Region",
    themePreferences: "Design-Einstellungen",
    preferences: "Präferenzen",
    language: "Sprache",
    timeZone: "Zeitzone",
    dateFormat: "Datumsformat",
    darkMode: "Dunkelmodus",
    changePassword: "Passwort ändern",
    deleteAccount: "Konto löschen",
  },
};

interface LocaleContextValue {
  language: string;
  langCode: string;
  timeZone: string;
  dateFormat: AppDateFormat;
  setLanguage: (lang: string) => void;
  setTimeZone: (tz: string) => void;
  setDateFormat: (fmt: AppDateFormat) => void;
  t: (key: string, fallback?: string) => string;
  formatDate: (date: string | Date) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  language: "English",
  langCode: "en",
  timeZone: "UTC",
  dateFormat: "MM/DD/YYYY",
  setLanguage: () => {},
  setTimeZone: () => {},
  setDateFormat: () => {},
  t: (key, fallback) => fallback || TRANSLATIONS.en[key] || key,
  formatDate: (d) => String(d),
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>("English");
  const [timeZone, setTimeZoneState] = useState<string>("UTC");
  const [dateFormat, setDateFormatState] = useState<AppDateFormat>("MM/DD/YYYY");
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    // Load from localStorage first
    const savedLang = localStorage.getItem("pulmoai-language");
    const savedTz = localStorage.getItem("pulmoai-timezone");
    const savedFmt = localStorage.getItem("pulmoai-dateformat") as AppDateFormat | null;

    if (savedLang) {
      setLanguageState(savedLang);
      document.documentElement.lang = LANG_CODE_MAP[savedLang] || "en";
    }
    if (savedTz) setTimeZoneState(savedTz);
    if (savedFmt) setDateFormatState(savedFmt);

    // Subscribe to settings changes via browser storage events
    // This allows real-time updates when preferences change
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "pulmoai-language" && e.newValue) {
        setLanguageState(e.newValue);
        document.documentElement.lang = LANG_CODE_MAP[e.newValue] || "en";
        setRenderKey(k => k + 1); // Force re-render of all consuming components
      }
      if (e.key === "pulmoai-timezone" && e.newValue) {
        setTimeZoneState(e.newValue);
        setRenderKey(k => k + 1);
      }
      if (e.key === "pulmoai-dateformat" && e.newValue) {
        setDateFormatState(e.newValue as AppDateFormat);
        setRenderKey(k => k + 1);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("pulmoai-language", lang);
      document.documentElement.lang = LANG_CODE_MAP[lang] || "en";
    }
  }, []);

  const setTimeZone = useCallback((tz: string) => {
    setTimeZoneState(tz);
    if (typeof window !== "undefined") {
      localStorage.setItem("pulmoai-timezone", tz);
    }
  }, []);

  const setDateFormat = useCallback((fmt: AppDateFormat) => {
    setDateFormatState(fmt);
    if (typeof window !== "undefined") {
      localStorage.setItem("pulmoai-dateformat", fmt);
    }
  }, []);

  const langCode = LANG_CODE_MAP[language] || "en";

  const t = useCallback(
    (key: string, fallback?: string) => {
      return TRANSLATIONS[langCode]?.[key] || TRANSLATIONS.en[key] || fallback || key;
    },
    [langCode],
  );

  const formatDate = useCallback(
    (input: string | Date) => {
      const d = input instanceof Date ? input : new Date(input);
      if (Number.isNaN(d.getTime())) return String(input);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      if (dateFormat === "DD/MM/YYYY") return `${dd}/${mm}/${yyyy}`;
      if (dateFormat === "YYYY-MM-DD") return `${yyyy}-${mm}-${dd}`;
      return `${mm}/${dd}/${yyyy}`;
    },
    [dateFormat],
  );

  return (
    <LocaleContext.Provider
      value={{
        language,
        langCode,
        timeZone,
        dateFormat,
        setLanguage,
        setTimeZone,
        setDateFormat,
        t,
        formatDate,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
