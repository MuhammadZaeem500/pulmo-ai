import { createElement, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import {FeatureCardProps} from "@/types/common.types";


export default function FeatureCard({
  icon,
  title,
  description,
  badge,
  isPopular,
  linkText,
  stepNumber,
}: FeatureCardProps) {
  return (
    <div
      className={`relative rounded-3xl bg-white p-8 transition-all duration-300 flex flex-col items-start ${
        isPopular
          ? "border-2 border-blue-500 shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/5"
          : "shadow-sm ring-1 ring-slate-200/80 hover:shadow-md hover:ring-blue-500/30"
      }`}
    >
     
      {isPopular && badge && (
        <span className="absolute -top-3.5 left-8 rounded-full bg-gradient-to-r from-blue-600 to-teal-400 px-4 py-1 text-xs font-bold text-white shadow-md">
          {badge}
        </span>
      )}

     
      {stepNumber && (
        <div className="absolute -top-4 left-8 h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-blue-500/25">
          {stepNumber}
        </div>
      )}

     
      <div className="mb-6 mt-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white shadow-md shadow-blue-500/20">
        {typeof icon === "function" ? createElement(icon) : icon}
      </div>

     
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>

     
      <p className="text-sm text-slate-600 leading-relaxed mb-4">{description}</p>

     
      {linkText && (
        <div className="mt-auto pt-2 flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer group">
          <span>{linkText}</span>
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </div>
  );
}