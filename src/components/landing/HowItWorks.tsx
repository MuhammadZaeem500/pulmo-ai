import FeatureCard from "@/components/common/FeatureCard";
import { UserPlus, MessageSquareText, Activity, TrendingUp } from "lucide-react";

const stepsData = [
  {
    stepNumber: "01",
    icon: <UserPlus className="h-6 w-6 text-white" />,
    title: "Sign Up & Create Profile",
    description: "Quick registration with secure pulmonary health data storage",
  },
  {
    stepNumber: "02",
    icon: <MessageSquareText className="h-6 w-6 text-white" />,
    title: "Describe Respiratory Symptoms",
    description: "Chat with our AI or upload X-rays/scans for lung analysis",
  },
  {
    stepNumber: "03",
    icon: <Activity className="h-6 w-6 text-white" />,
    title: "Get Expert Guidance",
    description: "Receive instant pulmonary insights and connect with specialists",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
       
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/10">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>How It Works</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            How It Works
          </h2>

          <p className="mt-4 text-base text-slate-600">
            Get started with PulmoAI in three simple steps
          </p>
        </div>

       
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 relative">
          {stepsData.map((step, index) => (
            <FeatureCard
              key={index}
              stepNumber={step.stepNumber}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}