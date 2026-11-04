import FeatureCard from "@/components/common/FeatureCard";
import { Brain, ShieldCheck, Zap, Stethoscope, Sparkles } from "lucide-react";

const features = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: "AI-Powered Analysis",
    description: "Advanced respiratory symptom analysis and lung health insights",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Secure & Private",
    description: "HIPAA-compliant encryption for your medical data",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Instant Insights",
    description: "Get pulmonary health insights in seconds",
  },
  {
    icon: <Stethoscope className="h-6 w-6" />,
    title: "Expert Specialists",
    description: "Connect with certified pulmonary specialists",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
       
        <div className="mx-auto max-w-2xl text-center mb-16">
         
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/10">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Why PulmoAI</span>
          </div>

         
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Why Choose PulmoAI?
          </h2>

         
          <p className="mt-4 text-base text-slate-600">
            Advanced AI technology meets pulmonary care expertise for superior respiratory health management
          </p>
        </div>

       
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}