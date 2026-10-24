// src/components/common/AvailableDoctorCard.tsx
import React from 'react';
import { Calendar } from 'lucide-react';

interface AvailableDoctorCardProps {
  name: string;
  specialty: string;
  nextAvailable: string;
  onBook: () => void;
}

export default function AvailableDoctorCard({
  name,
  specialty,
  nextAvailable,
  onBook,
}: AvailableDoctorCardProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-all bg-white flex items-center justify-between">
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-0.5">{name}</h3>
        <p className="text-xs text-gray-500 mb-2">{specialty}</p>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>Next available: {nextAvailable}</span>
        </div>
      </div>
      <button
        onClick={onBook}
        className="px-5 py-2 bg-[#2F80ED] text-white text-sm font-medium rounded-xl hover:bg-[#2668c7] transition-colors cursor-pointer shadow-xs"
      >
        Book
      </button>
    </div>
  );
}