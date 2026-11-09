import React from 'react';
import { SettingToggleItemProps } from '@/types/common.types';


export default function SettingToggleItem({
  title,
  description,
  enabled,
  onToggle,
}: SettingToggleItemProps) {
  return (
    <div className="flex items-center justify-between gap-3 sm:gap-4">
      <div>
        <h3 className="text-xs sm:text-sm font-bold text-gray-900">{title}</h3>
        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`w-11 sm:w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer shrink-0 ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            enabled ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}