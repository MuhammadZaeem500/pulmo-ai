"use client";

import { useRouter } from "next/navigation";
import DashboardCard from "@/components/common/DashboardCard";
import { MessageCircle, FileText, Calendar, Pill, Activity } from "lucide-react";

export default function PatientDashboard() {
  const router = useRouter();
  
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto">
     
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here&apos;s your health overview</p>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       
        <DashboardCard
          title="Continue Last Conversation"
          icon={MessageCircle}
          iconGradient={true}
          actionText="Open AI Chatbot →"
          onAction={() => router.push('/patient/chatbot')}
        >
          <p>Resume your chat about respiratory symptoms</p>
        </DashboardCard>

       
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

       
        <DashboardCard
          title="Symptom Tracker Summary"
          icon={Activity}
          iconGradient={true}
          actionText="Track Symptoms →"
          onAction={() => router.push('/patient/symptom-tracker')}
          className="md:col-span-2"
        >
          <p>Last logged: Shortness of breath (Moderate) - May 28, 2026</p>
        </DashboardCard>
      </div>
    </div>
  );
}