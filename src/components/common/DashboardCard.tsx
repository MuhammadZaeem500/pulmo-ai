// src/components/common/DashboardCard.tsx
import React, { ReactNode } from "react";
import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

interface DashboardCardProps {
  title?: string;
  icon?: LucideIcon | ReactNode;
  iconGradient?: boolean;
  viewAllLink?: string;
  actionText?: string;
  onAction?: () => void;
  children: ReactNode;
  className?: string;
}

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
    <div className={`bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${className}`}>
      <div>
        {/* Gradient Icon Box */}
        {Icon && iconGradient && (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2F80ED] to-[#14B8A6] flex items-center justify-center mb-5 text-white shadow-md shadow-blue-500/20">
            {React.isValidElement(Icon) 
              ? Icon 
              : React.createElement(Icon as LucideIcon, { className: "w-6 h-6" })}
          </div>
        )}

        {/* Optional Header with Title & View All */}
        {title && (!iconGradient || !Icon) && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {Icon && !iconGradient && (
                <div className="text-blue-600">
                  {React.isValidElement(Icon) 
                    ? Icon 
                    : React.createElement(Icon as LucideIcon, { className: "w-5 h-5" })}
                </div>
              )}
              <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
            </div>
            {viewAllLink && (
              <Link href={viewAllLink} className="text-xs font-semibold text-blue-600 hover:underline">
                View all &gt;
              </Link>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="text-slate-600 text-xs sm:text-sm space-y-1.5">
          {children}
        </div>
      </div>

      {/* Optional Bottom Action Button */}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 text-[#2F80ED] text-xs sm:text-sm font-semibold flex items-center gap-1.5 hover:gap-2 transition-all cursor-pointer w-fit"
        >
          {actionText} <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}