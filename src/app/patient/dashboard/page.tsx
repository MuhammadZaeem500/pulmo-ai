"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardCard from "@/components/common/DashboardCard";
import { MessageCircle, FileText, Calendar, Pill, Activity } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    null
  );
}

function extractList(payload: any, keys: string[]): any[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
    if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  }
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function formatDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface DashboardState {
  chatSessionId?: string;
  chatSummary: string;
  lastConsultationDate: string | null;
  lastDiagnosis: string | null;
  upcomingDoctor: string | null;
  upcomingSchedule: string | null;
  prescriptionName: string | null;
  prescribedDate: string | null;
  symptomSummary: string | null;
}

const INITIAL_STATE: DashboardState = {
  chatSummary: "Resume your chat about respiratory symptoms",
  lastConsultationDate: null,
  lastDiagnosis: null,
  upcomingDoctor: null,
  upcomingSchedule: null,
  prescriptionName: null,
  prescribedDate: null,
  symptomSummary: null,
};

export default function PatientDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchDashboardData() {
      const token = getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const fetchJson = async (path: string) => {
        const res = await fetch(`${API_BASE_URL}${path}`, {
          headers,
          credentials: "include",
        });
        if (!res.ok) return null;
        return res.json();
      };

      const [
        sessionsRaw,
        historyRaw,
        appointmentsRaw,
        prescriptionsRaw,
        symptomsRaw,
      ] = await Promise.allSettled([
        fetchJson("/patient/chatbot/sessions"),
        fetchJson("/patient/medical-records"),
        fetchJson("/patient/appointments"),
        fetchJson("/patient/prescriptions"),
        fetchJson("/patient/symptoms"),
      ]);

      if (!active) return;

      const sessions = extractList(
        sessionsRaw.status === "fulfilled" ? sessionsRaw.value : null,
        ["sessions", "items"]
      );
      const records = extractList(
        historyRaw.status === "fulfilled" ? historyRaw.value : null,
        ["records", "medicalRecords", "consultations", "items"]
      );
      const appointments = extractList(
        appointmentsRaw.status === "fulfilled" ? appointmentsRaw.value : null,
        ["appointments", "items"]
      );
      const prescriptions = extractList(
        prescriptionsRaw.status === "fulfilled" ? prescriptionsRaw.value : null,
        ["prescriptions", "medications", "items"]
      );
      const symptoms = extractList(
        symptomsRaw.status === "fulfilled" ? symptomsRaw.value : null,
        ["symptoms", "logs", "items"]
      );

      const latestSession = sessions[0];
      const latestRecord = records[0];
      const upcomingAppt =
        appointments.find(
          (a) => !["CANCELLED", "COMPLETED"].includes(String(a?.status || "").toUpperCase())
        ) || appointments[0];
      const latestPrescription = prescriptions[0];
      const latestSymptom = symptoms[0];

      const symptomName =
        latestSymptom?.name ||
        latestSymptom?.symptom ||
        latestSymptom?.title ||
        null;
      const symptomSeverity = latestSymptom?.severity
        ? ` (${latestSymptom.severity})`
        : "";
      const symptomDate = formatDate(
        latestSymptom?.loggedAt || latestSymptom?.date || latestSymptom?.createdAt
      );

      setData({
        chatSessionId: latestSession?.id,
        chatSummary:
          latestSession?.title ||
          latestSession?.lastMessage ||
          latestSession?.summary ||
          "Start a chat about respiratory symptoms",
        lastConsultationDate: formatDate(
          latestRecord?.consultationDate ||
            latestRecord?.date ||
            latestRecord?.createdAt
        ),
        lastDiagnosis:
          latestRecord?.diagnosis ||
          latestRecord?.condition ||
          latestRecord?.title ||
          null,
        upcomingDoctor:
          upcomingAppt?.doctor?.name ||
          upcomingAppt?.doctorName ||
          upcomingAppt?.doctor?.fullName ||
          null,
        upcomingSchedule: formatDateTime(
          upcomingAppt?.scheduledAt ||
            upcomingAppt?.appointmentDate ||
            upcomingAppt?.date
        ),
        prescriptionName:
          latestPrescription?.medicationName ||
          latestPrescription?.medication ||
          latestPrescription?.name ||
          null,
        prescribedDate: formatDate(
          latestPrescription?.prescribedAt ||
            latestPrescription?.date ||
            latestPrescription?.createdAt
        ),
        symptomSummary: symptomName
          ? `Last logged: ${symptomName}${symptomSeverity}${
              symptomDate ? ` - ${symptomDate}` : ""
            }`
          : null,
      });

      setLoading(false);
    }

    fetchDashboardData();
    return () => {
      active = false;
    };
  }, []);

  const handleOpenChatbot = () => {
    if (data.chatSessionId) {
      router.push(`/patient/chatbot?sessionId=${encodeURIComponent(data.chatSessionId)}`);
    } else {
      router.push("/patient/chatbot");
    }
  };

  return (
    <div className="p-2 sm:p-4 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          Dashboard
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          Welcome back! Here&apos;s your health overview
        </p>
      </div>

      {/* Responsive Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Continue Conversation Card */}
        <DashboardCard
          title="Continue Last Conversation"
          icon={MessageCircle}
          iconGradient={true}
          actionText="Open AI Chatbot →"
          onAction={handleOpenChatbot}
        >
          <p>{loading ? "Loading latest session..." : data.chatSummary}</p>
        </DashboardCard>

        {/* Recent Medical History Card */}
        <DashboardCard
          title="Recent Medical History"
          icon={FileText}
          iconGradient={true}
          actionText="View History →"
          onAction={() => router.push("/patient/medical-history")}
        >
          {loading ? (
            <p>Loading medical history...</p>
          ) : data.lastConsultationDate || data.lastDiagnosis ? (
            <>
              <p>Last consultation: {data.lastConsultationDate || "N/A"}</p>
              <p>Diagnosis: {data.lastDiagnosis || "Pending review"}</p>
            </>
          ) : (
            <p>No consultation history recorded yet</p>
          )}
        </DashboardCard>

        {/* Upcoming Appointment Card */}
        <DashboardCard
          title="Upcoming Appointment"
          icon={Calendar}
          iconGradient={true}
          actionText="View Details →"
          onAction={() => router.push("/patient/appointments")}
        >
          {loading ? (
            <p>Loading appointment...</p>
          ) : data.upcomingDoctor || data.upcomingSchedule ? (
            <>
              <p>{data.upcomingDoctor || "Assigned Doctor"}</p>
              <p>{data.upcomingSchedule || "Schedule pending"}</p>
            </>
          ) : (
            <p>No upcoming appointments scheduled</p>
          )}
        </DashboardCard>

        {/* Recent Prescription Card */}
        <DashboardCard
          title="Recent Prescription"
          icon={Pill}
          iconGradient={true}
          actionText="View All →"
          onAction={() => router.push("/patient/prescriptions")}
        >
          {loading ? (
            <p>Loading prescription...</p>
          ) : data.prescriptionName || data.prescribedDate ? (
            <>
              <p>{data.prescriptionName || "Prescription"}</p>
              <p>Prescribed: {data.prescribedDate || "N/A"}</p>
            </>
          ) : (
            <p>No recent prescriptions found</p>
          )}
        </DashboardCard>

        {/* Symptom Tracker Summary Card (Spans full width on medium/large screens) */}
        <DashboardCard
          title="Symptom Tracker Summary"
          icon={Activity}
          iconGradient={true}
          actionText="Track Symptoms →"
          onAction={() => router.push("/patient/symptom-tracker")}
          className="sm:col-span-2 lg:col-span-2"
        >
          <p>
            {loading
              ? "Loading symptom logs..."
              : data.symptomSummary || "No symptoms logged yet"}
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}