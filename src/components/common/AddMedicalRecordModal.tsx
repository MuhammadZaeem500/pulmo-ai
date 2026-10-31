"use client";

import { useState } from "react";
import { X, Loader2, Stethoscope } from "lucide-react";
import { medicalRecordsService } from "@/services/medical-records.service";

interface AddMedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newRecord: any) => void;
}

export default function AddMedicalRecordModal({ isOpen, onClose, onSave }: AddMedicalRecordModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: "",
    primarySymptom: "",
    confidence: "95%",
    urgency: "Normal",
    recommendations: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      // Call your backend API to save the record in PostgreSQL
      const savedRecord = await medicalRecordsService.createRecord(formData);

      // Pass the saved record back to parent component to update the UI instantly
      onSave(savedRecord);

      // Reset form and close modal
      setFormData({ diagnosis: "", primarySymptom: "", confidence: "95%", urgency: "Normal", recommendations: "" });
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
              <p className="text-xs text-gray-500">Record diagnosis, symptoms, and clinical recommendations</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Diagnosis / Title
              </label>
              <input
                type="text"
                required
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="e.g. Mild Bronchitis"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Confidence Score
              </label>
              <input
                type="text"
                value={formData.confidence}
                onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
                placeholder="e.g. 92%"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Symptoms Discussed
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
              Urgency Level
            </label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="Moderate">Moderate</option>
              <option value="Urgent">Urgent</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Recommendations
            </label>
            <textarea
              rows={3}
              value={formData.recommendations}
              onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
              placeholder="e.g. Rest, stay hydrated, use prescribed inhaler"
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