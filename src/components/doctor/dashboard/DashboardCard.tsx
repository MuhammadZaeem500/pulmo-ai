// src/components/doctor/dashboard/DashboardCard.tsx
import React, { ReactNode } from "react";
import Link from "next/link";

interface DashboardCardProps {
  title?: string;
  icon?: ReactNode;
  viewAllLink?: string;
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({
  title,
  icon,
  viewAllLink,
  children,
  className = "",
}: DashboardCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon && <div className="text-blue-600">{icon}</div>}
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
          </div>
          {viewAllLink && (
            <Link href={viewAllLink} className="text-xs font-semibold text-blue-600 hover:underline">
              View all &gt;
            </Link>
          )}
        </div>
      )}
      <div className="space-y-3">{children}</div>
    </div>
  );
}