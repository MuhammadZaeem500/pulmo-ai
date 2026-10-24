// src/components/common/ProfileField.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProfileFieldProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export default function ProfileField({ icon: Icon, label, value }: ProfileFieldProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}