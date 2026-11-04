import React from 'react';
import { Calendar, ArrowRight, ArrowDown, ArrowUp, LucideIcon } from 'lucide-react';
import { SymptomCardProps } from '@/types/common.types';

const severityConfig = {
  Mild: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Moderate: { bg: 'bg-amber-50', text: 'text-amber-700' },
  Severe: { bg: 'bg-rose-50', text: 'text-rose-700' },
};

const trendIcons: Record<'right' | 'down' | 'up', LucideIcon> = {
  right: ArrowRight,
  down: ArrowDown,
  up: ArrowUp,
};

export default function SymptomCard({
  symptom,
  severity,
  date,
  trendIcon,
  onViewHistory,
}: SymptomCardProps) {
  const TrendIcon = trendIcons[trendIcon];
  const severityStyle = severityConfig[severity] || severityConfig.Mild;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="text-base font-bold text-gray-900">{symptom}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${severityStyle.bg} ${severityStyle.text}`}>
              {severity}
            </span>
            <TrendIcon className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>{date}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onViewHistory}
        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all cursor-pointer"
      >
        View History
      </button>
    </div>
  );
}