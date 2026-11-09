import { FileText, Calendar } from 'lucide-react';
import { MedicalRecordCardProps } from '@/types/common.types';

// Extend MedicalRecordCardProps and make confidence optional along with urgencyLabel
interface ExtendedCardProps extends Omit<MedicalRecordCardProps, 'confidence'> {
  urgencyLabel?: string;
  confidence?: string;
}

export default function MedicalRecordCard({
  date,
  diagnosis,
  symptoms,
  // confidence = "N/A", // Commented out as requested
  urgency,
  recommendations,
  onViewDetails,
  onDownloadReport,
  urgencyLabel = "Urgency Level", 
}: ExtendedCardProps) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 bg-[#2F80ED]/10 rounded-lg shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#2F80ED]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{diagnosis}</h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{date}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onViewDetails}
          className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-slate-700 transition-colors text-xs sm:text-sm cursor-pointer text-center"
        >
          View Details
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div>
          <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Symptoms Discussed</p>
          <p className="text-xs sm:text-sm font-medium text-gray-800">{symptoms}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Recommendations</p>
          <p className="text-xs sm:text-sm font-medium text-gray-800">{recommendations}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
        {/* Confidence score block commented out */}
        {/* 
        <div>
          <p className="text-xs text-gray-600">Confidence Score</p>
          <p className="text-sm font-bold text-[#14B8A6]">{confidence}</p>
        </div> 
        */}
        <div>
          <p className="text-xs text-gray-600">{urgencyLabel}</p>
          <p className="text-sm font-bold text-gray-800">{urgency}</p>
        </div>
        <button
          onClick={onDownloadReport}
          className="ml-auto text-sm text-[#2F80ED] hover:underline cursor-pointer font-medium"
        >
          Download Report
        </button>
      </div>
    </div>
  );
}