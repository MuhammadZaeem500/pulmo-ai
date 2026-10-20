// src/components/common/FeatureCard.tsx
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200/60 hover:shadow-md hover:ring-blue-500/30 transition-all duration-300 flex flex-col items-start">
      {/* Icon Container with gradient/soft background */}
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}