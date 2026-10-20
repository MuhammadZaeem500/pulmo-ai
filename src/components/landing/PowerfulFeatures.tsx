// src/components/landing/PowerfulFeatures.tsx
import FeatureCard from "@/components/common/FeatureCard";
import { 
  MessageSquare, 
  FileText, 
  Activity, 
  Pill, 
  Stethoscope, 
  Calendar, 
  Zap 
} from "lucide-react";

const featuresData = [
  {
    icon: <MessageSquare className="h-6 w-6 text-white" />,
    title: "AI Pulmonary Chatbot",
    description: "Instant respiratory symptom analysis and breathing guidance powered by advanced AI",
    isPopular: true,
    badge: "Popular",
  },
  {
    icon: <FileText className="h-6 w-6 text-white" />,
    title: "Medical History",
    description: "Complete pulmonary health records and consultation history accessible anytime",
  },
  {
    icon: <Activity className="h-6 w-6 text-white" />,
    title: "Respiratory Symptom Tracker",
    description: "Monitor breathing patterns, cough severity, and lung health over time",
  },
  {
    icon: <Pill className="h-6 w-6 text-white" />,
    title: "Smart Prescriptions",
    description: "Respiratory medication management with dosage reminders",
  },
  {
    icon: <Stethoscope className="h-6 w-6 text-white" />,
    title: "Know Your Medicine",
    description: "Identify inhalers and respiratory medications with detailed usage info",
  },
  {
    icon: <Calendar className="h-6 w-6 text-white" />,
    title: "Specialist Appointments",
    description: "Book pulmonary specialists and manage consultations seamlessly",
  },
];

export default function PowerfulFeatures() {
  return (
    <section className="py-24 lg:py-32 bg-slate-50/60 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/10">
            <Zap className="h-3.5 w-3.5" />
            <span>Features</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Powerful Features
          </h2>

          <p className="mt-4 text-base text-slate-600">
            Everything you need for comprehensive pulmonary health management in one platform
          </p>
        </div>

        {/* Feature Cards Grid (3 columns layout as shown in screenshots) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              isPopular={feature.isPopular}
              badge={feature.badge}
            />
          ))}
        </div>

      </div>
    </section>
  );
}