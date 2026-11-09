import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { SettingSectionCardProps } from '@/types/common.types';


export default function SettingSectionCard({ icon: Icon, title, children }: SettingSectionCardProps) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-100 shadow-xs space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-gray-100">
        <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {children}
      </div>
    </div>
  );
}