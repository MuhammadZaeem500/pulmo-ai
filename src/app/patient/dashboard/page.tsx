"use client";

import { useRouter } from "next/navigation";
import DashboardCard from "@/components/common/DashboardCard";
import { MessageCircle, FileText, Calendar, Pill, Activity } from "lucide-react";

export default function PatientDashboard() {
  const router = useRouter();
  
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
          onAction={() => router.push('/patient/chatbot')}
        >
          <p>Resume your chat about respiratory symptoms</p>
        </DashboardCard>

       
        {/* Recent Medical History Card */}
        <DashboardCard
          title="Recent Medical History"
          icon={FileText}
          iconGradient={true}
          actionText="View History →"
          onAction={() => router.push('/patient/medical-history')}
        >
          <p>Last consultation: May 25, 2026</p>
          <p>Diagnosis: Mild bronchitis</p>
        </DashboardCard>

       
        {/* Upcoming Appointment Card */}
        <DashboardCard
          title="Upcoming Appointment"
          icon={Calendar}
          iconGradient={true}
          actionText="View Details →"
          onAction={() => router.push('/patient/appointments')}
        >
          <p>Dr. Sarah Johnson</p>
          <p>June 5, 2026 at 2:00 PM</p>
        </DashboardCard>

       
        {/* Recent Prescription Card */}
        <DashboardCard
          title="Recent Prescription"
          icon={Pill}
          iconGradient={true}
          actionText="View All →"
          onAction={() => router.push('/patient/prescriptions')}
        >
          <p>Albuterol Inhaler</p>
          <p>Prescribed: May 25, 2026</p>
        </DashboardCard>

       
        {/* Symptom Tracker Summary Card (Spans full width on medium/large screens) */}
        <DashboardCard
          title="Symptom Tracker Summary"
          icon={Activity}
          iconGradient={true}
          actionText="Track Symptoms →"
          onAction={() => router.push('/patient/symptom-tracker')}
          className="sm:col-span-2 lg:col-span-2"
        >
          <p>Last logged: Shortness of breath (Moderate) - May 28, 2026</p>
        </DashboardCard>
      </div>
    </div>
  );
}