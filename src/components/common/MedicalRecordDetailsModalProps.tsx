"use client";

import { X, Calendar, AlertTriangle, ShieldCheck, FileText, Trash2, Edit3, Loader2 } from "lucide-react";
import { useState } from "react";
import { medicalRecordsService } from "@/services/medical-records.service";

interface MedicalRecordDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any | null;
  onEdit: (record: any) => void;
  onDelete: (recordId: string) => void;
}

export default function MedicalRecordDetailsModal({ isOpen, onClose, record, onEdit, onDelete }: MedicalRecordDetailsModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !record) return null;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this medical record?")) return;
    try {
      setDeleting(true);
      await medicalRecordsService.deleteRecord(record.id);
      onDelete(record.id);
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete record.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 space-y-4 sm:space-y-6 text-left max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-blue-50 text-[#2F80ED] rounded-xl shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-950">Medical Record Details</h2>
              <p className="text-xs text-gray-500">
                Logged on {new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Primary Symptom</span>
              <p className="text-gray-950 font-semibold text-base">{record.primarySymptom || "N/A"}</p>
            </div>
            {record.durationInDays && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 pt-1">
                <Calendar className="w-4 h-4 text-[#2F80ED]" />
                <span>Duration: <strong>{record.durationInDays} days</strong></span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Diagnosis Match</span>
              <p className="font-medium text-gray-900">{record.diagnosis || "Pending Evaluation"}</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Urgency Level</span>
              <div className="flex items-center gap-1.5 pt-1">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-gray-900">{record.urgencyLevel || 'Normal'}</span>
              </div>
            </div>
          </div>

          {record.symptomsDiscussed && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Symptoms Discussed</span>
              <div className="p-3 bg-gray-50 rounded-xl text-gray-800 text-xs border border-gray-100">
                {record.symptomsDiscussed}
              </div>
            </div>
          )}

          {record.confidenceScore !== null && record.confidenceScore !== undefined && (
            <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 text-blue-950 font-medium">
                <ShieldCheck className="w-5 h-5 text-[#2F80ED]" />
                <span>AI Confidence Score</span>
              </div>
              <span className="font-bold text-[#2F80ED] text-base">
                {Math.round(record.confidenceScore * (record.confidenceScore <= 1 ? 100 : 1))}%
              </span>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Recommendations</span>
            <div className="p-3.5 bg-gray-50 rounded-xl text-gray-800 text-xs leading-relaxed border border-gray-100">
              {record.recommendations || "No specific recommendations provided yet."}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Medical History / Notes</span>
            <div className="p-3.5 bg-gray-50 rounded-xl text-gray-800 text-xs leading-relaxed border border-gray-100">
              {record.medicalHistory || "None provided."}
            </div>
          </div>
        </div>

        {/* Footer Actions (Edit & Delete) */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(record);
              }}
              className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-[#2F80ED] text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer text-center"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}