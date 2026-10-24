// src/components/common/MedicineShapeCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MedicineShapeCardProps {
  label: string;
  icon: LucideIcon;
  isSelected?: boolean;
  onClick: () => void;
}

export default function MedicineShapeCard({
  label,
  icon: Icon,
  isSelected = false,
  onClick,
}: MedicineShapeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 border transition-all flex flex-col items-center justify-center gap-4 cursor-pointer h-36 ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-sm'
          : 'border-gray-200 hover:border-gray-300 shadow-xs'
      }`}
    >
      <Icon className="w-8 h-8 text-gray-400 stroke-[1.5]" />
      <span className="text-sm font-medium text-gray-900">{label}</span>
    </button>
  );
}