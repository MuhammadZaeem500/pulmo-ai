"use client";

import { useState } from "react";
import { X, Loader2, Stethoscope } from "lucide-react";
import { medicalRecordsService } from "@/services/medical-records.service";
import { AddMedicalRecordModalProps } from "@/types/modal.types";

export default function AddMedicalRecordModal({ isOpen, onClose, onSave }: AddMedicalRecordModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    primarySymptom: "",
    durationInDays: 1,
    medicalHistory: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const savedRecord = await medicalRecordsService.createRecord(formData);

      onSave(savedRecord);

      setFormData({ primarySymptom: "", durationInDays: 1, medicalHistory: "" });
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#2F80ED] rounded-xl">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add Medical Record</h2>
              <p className="text-xs text-gray-500">Record primary symptoms and medical history intake</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Primary Symptom
            </label>
            <input
              type="text"
              required
              value={formData.primarySymptom}
              onChange={(e) => setFormData({ ...formData, primarySymptom: e.target.value })}
              placeholder="e.g. Persistent cough, shortness of breath"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Duration (in Days)
            </label>
            <input
              type="number"
              required
              min={1}
              value={formData.durationInDays}
              onChange={(e) => setFormData({ ...formData, durationInDays: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Medical History / Notes
            </label>
            <textarea
              rows={3}
              value={formData.medicalHistory}
              onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
              placeholder="e.g. Previous asthma diagnosis, smoker..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#2F80ED] text-white text-sm font-medium rounded-lg hover:bg-[#2668c7] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Medical Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}