// src/components/common/TestimonialCard.tsx
import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;          // e.g., "Asthma Patient" or "COPD Patient"
  avatarInitial: string; // e.g., "J" or "L"
}

export default function TestimonialCard({
  quote,
  name,
  role,
  avatarInitial,
}: TestimonialCardProps) {
  return (
    <div className="relative rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/80 hover:shadow-md hover:ring-blue-500/30 transition-all duration-300 flex flex-col justify-between">
      
      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-teal-400 text-teal-400" />
          ))}
        </div>

        {/* Quote Text */}
        <p className="text-sm text-slate-700 leading-relaxed italic mb-8">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      {/* User Info Footer */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        {/* Avatar Circle */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-teal-400 text-white font-bold text-sm flex items-center justify-center shadow-sm shadow-blue-500/20">
          {avatarInitial}
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900">{name}</h4>
          <p className="text-xs text-slate-500 font-medium">{role}</p>
        </div>
      </div>

    </div>
  );
}
