// src/components/common/DoctorClinicCard.tsx
import { ReactNode } from "react";
import { Star } from "lucide-react";

interface DoctorClinicCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  metaText: string;     // e.g., "2.3 km away" or "15 years exp"
  rating: string;       // e.g., "4.8/5" or "4.9"
  actionText?: string;  // e.g., "Book Now"
  onActionClick?: () => void;
}

export default function DoctorClinicCard({
  icon,
  title,
  subtitle,
  metaText,
  rating,
  actionText,
  onActionClick,
}: DoctorClinicCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 hover:shadow-md hover:ring-blue-500/30 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Row: Icon + Title/Subtitle + Optional Button */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Icon Box */}
          <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
            {icon}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
          </div>
        </div>

        {/* Action Button (e.g. Book Now) */}
        {actionText && (
          <button
            onClick={onActionClick}
            className="rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-teal-500/20 hover:from-teal-500 hover:to-teal-600 transition"
          >
            {actionText}
          </button>
        )}
      </div>

      {/* Bottom Row: Distance/Exp + Star Rating */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
        <span className="text-slate-500 font-medium">{metaText}</span>
        <div className="flex items-center gap-1 text-teal-600 font-bold">
          <Star className="h-3.5 w-3.5 fill-teal-500 text-teal-500" />
          <span>{rating}</span>
        </div>
      </div>

    </div>
  );
}