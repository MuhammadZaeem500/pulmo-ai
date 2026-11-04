import React from 'react';
import { SettingToggleItemProps } from '@/types/common.types';


export default function SettingToggleItem({
  title,
  description,
  enabled,
  onToggle,
}: SettingToggleItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            enabled ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}