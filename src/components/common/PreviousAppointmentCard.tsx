// src/components/common/PreviousAppointmentCard.tsx
import React from 'react';
import { Calendar, Clock, MapPin, MessageCircle } from 'lucide-react';

interface PreviousAppointmentCardProps {
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  clinic: string;
  status: string;
  notes: string;
  onChat: () => void;
}

export default function PreviousAppointmentCard({
  doctor,
  specialty,
  date,
  time,
  clinic,
  status,
  notes,
  onChat,
}: PreviousAppointmentCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-0.5">{doctor}</h3>
          <p className="text-sm text-gray-500 mb-3">{specialty}</p>
          <div className="space-y-1.5 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{clinic}</span>
            </div>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
          {status}
        </span>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Consultation Notes</p>
        <p className="text-sm text-gray-700">{notes}</p>
      </div>

      <div className="pt-2">
        <button
          onClick={onChat}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2F80ED] text-white text-sm font-medium rounded-xl hover:bg-[#2668c7] transition-colors cursor-pointer shadow-xs"
        >
          <MessageCircle className="w-4 h-4" />
          Chat with Doctor
        </button>
      </div>
    </div>
  );
}
