import React from 'react';
import { Calendar, Clock, MapPin, MessageCircle } from 'lucide-react';
import { PreviousAppointmentCardProps } from '@/types/common.types';

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
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5">{doctor}</h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">{specialty}</p>
          <div className="space-y-1.5 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
              <span>{clinic}</span>
            </div>
          </div>
        </div>
        <span className="self-start px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
          {status}
        </span>
      </div>

      {/* <div className="pt-4 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Consultation Notes</p>
        <p className="text-sm text-gray-700">{notes}</p>
      </div> */}

      <div className="pt-2">
        <button
          onClick={onChat}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2F80ED] text-white text-xs sm:text-sm font-medium rounded-xl hover:bg-[#2668c7] transition-colors cursor-pointer shadow-xs"
        >
          <MessageCircle className="w-4 h-4" />
          Chat with Doctor
        </button>
      </div>
    </div>
  );
}
