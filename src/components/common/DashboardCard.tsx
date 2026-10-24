// src/components/common/DashboardCard.tsx
import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  actionText: string;
  onAction: () => void;
  className?: string;
  children: React.ReactNode;
}

export default function DashboardCard({
  title,
  icon: Icon,
  actionText,
  onAction,
  className = '',
  children,
}: DashboardCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-xs border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2F80ED] to-[#14B8A6] flex items-center justify-center mb-4 text-white shadow-xs">
          <Icon className="w-5 h-5" />
        </div>
        
        <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
        <div className="text-gray-500 text-sm space-y-0.5 mb-6">
          {children}
        </div>
      </div>

      <button
        onClick={onAction}
        className="text-[#2F80ED] text-sm font-medium flex items-center gap-1.5 hover:gap-2 transition-all cursor-pointer w-fit"
      >
        {actionText} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}