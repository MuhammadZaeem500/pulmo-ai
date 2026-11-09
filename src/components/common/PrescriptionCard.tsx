import React from 'react';
import { FileText, User, Calendar, Download } from 'lucide-react';
import { PrescriptionCardProps } from '@/types/common.types';

export default function PrescriptionCard({
  medicine,
  doctor,
  date,
  dosage,
  duration,
  onDownload,
  onViewFull,
}: PrescriptionCardProps) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-xs hover:shadow-md transition-all w-full overflow-hidden">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-50 text-[#14B8A6] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 break-words tracking-tight">
              {medicine}
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 min-w-0">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                <span className="truncate">Prescribed by {doctor}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                <span>{date}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onDownload}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium text-xs sm:text-sm hover:bg-gray-50 transition-all cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
          Download
        </button>
      </div>

      {/* Dosage & Duration Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
        <div>
          <p className="text-[10px] sm:text-xs font-semibold text-gray-400 tracking-wider uppercase mb-0.5">Dosage</p>
          <p className="text-xs sm:text-sm font-medium text-gray-800 break-words">{dosage}</p>
        </div>
        <div>
          <p className="text-[10px] sm:text-xs font-semibold text-gray-400 tracking-wider uppercase mb-0.5">Duration</p>
          <p className="text-xs sm:text-sm font-medium text-gray-800 break-words">{duration}</p>
        </div>
      </div>

      {/* View Full Prescription Action */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
        <button
          onClick={onViewFull}
          className="text-xs sm:text-sm font-medium text-[#2F80ED] hover:underline cursor-pointer"
        >
          View Full Prescription
        </button>
      </div>
    </div>
  );
}