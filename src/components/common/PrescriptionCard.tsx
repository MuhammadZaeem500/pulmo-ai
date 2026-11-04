import { FileText, User, Calendar, Download } from 'lucide-react';
import {PrescriptionCardProps} from '@/types/common.types';


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
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#14B8A6] flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{medicine}</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="w-4 h-4 text-gray-400" />
                <span>Prescribed by {doctor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{date}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-gray-400" />
          Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Dosage</p>
          <p className="text-sm font-medium text-gray-800">{dosage}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Duration</p>
          <p className="text-sm font-medium text-gray-800">{duration}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={onViewFull}
          className="text-sm font-medium text-[#2F80ED] hover:underline cursor-pointer"
        >
          View Full Prescription
        </button>
      </div>
    </div>
  );
}