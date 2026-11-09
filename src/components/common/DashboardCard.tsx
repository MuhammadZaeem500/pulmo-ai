import React from "react";
import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";
import { DashboardCardProps } from "@/types/common.types";

export default function DashboardCard({
  title,
  icon: Icon,
  iconGradient = false,
  viewAllLink,
  actionText,
  onAction,
  children,
  className = "",
}: DashboardCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${className}`}>
      <div>
       
        {/* Icon Header */}
        {Icon && iconGradient && (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-linear-to-br from-[#2F80ED] to-[#14B8A6] flex items-center justify-center mb-4 sm:mb-5 text-white shadow-md shadow-blue-500/20 shrink-0">
            {React.isValidElement(Icon) 
              ? Icon 
              : React.createElement(Icon as LucideIcon, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
          </div>
        )}

       
        {/* Title Header */}
        {title && (!iconGradient || !Icon) && (
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              {Icon && !iconGradient && (
                <div className="text-blue-600 shrink-0">
                  {React.isValidElement(Icon) 
                    ? Icon 
                    : React.createElement(Icon as LucideIcon, { className: "w-5 h-5" })}
                </div>
              )}
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
            </div>
            {viewAllLink && (
              <Link href={viewAllLink} className="text-[11px] sm:text-xs font-semibold text-blue-600 hover:underline">
                View all &gt;
              </Link>
            )}
          </div>
        )}

       
        {/* Card Body Text */}
        <div className="text-slate-600 text-xs sm:text-sm space-y-1">
          {children}
        </div>
      </div>

     
      {/* Action Footer Button */}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 sm:mt-6 text-[#2F80ED] text-xs sm:text-sm font-semibold flex items-center gap-1.5 hover:gap-2 transition-all cursor-pointer w-fit"
        >
          {actionText} <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      )}
    </div>
  );
}