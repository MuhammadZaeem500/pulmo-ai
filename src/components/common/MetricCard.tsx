import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import MetricCardProps from "@/types/common.types";

export default function MetricCard({
  title,
  value,
  valueColor = "text-slate-900",
  trend,
  trendColor = "text-emerald-600",
  icon: Icon,
  iconBgColor = "bg-blue-50 text-blue-600",
  className = "",
}: MetricCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${className}`}>
     
      {Icon ? (
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
            {title}
          </span>
          <div className={`p-2 rounded-xl ${iconBgColor}`}>
            {React.isValidElement(Icon) 
              ? Icon 
              : React.createElement(Icon as LucideIcon, { className: "w-4 h-4" })}
          </div>
        </div>
      ) : (
        <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
      )}

     
      <div>
        <h3 className={`text-2xl lg:text-3xl font-bold tracking-tight ${valueColor}`}>
          {value}
        </h3>
        {trend && (
          <p className={`text-[11px] font-semibold mt-1 ${trendColor}`}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}