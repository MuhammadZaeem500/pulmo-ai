import { Calendar } from 'lucide-react';
import { AvailableDoctorCardProps } from '@/types/common.types';


export default function AvailableDoctorCard({
  name,
  specialty,
  nextAvailable,
  onBook,
}: AvailableDoctorCardProps) {
  return (
    <div className="p-3.5 sm:p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-0.5">{name}</h3>
        <p className="text-xs text-gray-500 mb-1.5 sm:mb-2">{specialty}</p>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          {/* <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" /> */}
          {/* <span>Next available: {nextAvailable}</span> */}
        </div>
      </div>
      <button
        onClick={onBook}
        className="w-full sm:w-auto px-5 py-2 bg-[#2F80ED] text-white text-xs sm:text-sm font-medium rounded-xl hover:bg-[#2668c7] transition-colors cursor-pointer shadow-xs text-center"
      >
        Book
      </button>
    </div>
  );
}