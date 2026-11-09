"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Stethoscope } from "lucide-react";
import { medicalRecordsService } from "@/services/medical-records.service";
import { AddMedicalRecordModalProps } from "@/types/modal.types";

export default function AddMedicalRecordModal({ isOpen, onClose, onSave, recordToEdit }: AddMedicalRecordModalProps & { recordToEdit?: any }) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    primarySymptom: "",
    durationInDays: 1,
    diagnosis: "",
    symptomsDiscussed: "",
    recommendations: "",
    confidenceScore: 0.95,
    urgencyLevel: "Medium",
    medicalHistory: "",
  });

  useEffect(() => {
    if (recordToEdit) {
      setFormData({
        primarySymptom: recordToEdit.primarySymptom || "",
        durationInDays: recordToEdit.durationInDays || 1,
        diagnosis: recordToEdit.diagnosis || "",
        symptomsDiscussed: recordToEdit.symptomsDiscussed || "",
        recommendations: recordToEdit.recommendations || "",
        confidenceScore: recordToEdit.confidenceScore || 0.95,
        urgencyLevel: recordToEdit.urgencyLevel || "Medium",
        medicalHistory: recordToEdit.medicalHistory || "",
      });
    } else {
      setFormData({
        primarySymptom: "",
        durationInDays: 1,
        diagnosis: "",
        symptomsDiscussed: "",
        recommendations: "",
        confidenceScore: 0.95,
        urgencyLevel: "Medium",
        medicalHistory: "",
      });
    }
  }, [recordToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      let savedRecord;
      if (recordToEdit?.id) {
        savedRecord = await medicalRecordsService.updateRecord(recordToEdit.id, formData);
      } else {
        savedRecord = await medicalRecordsService.createRecord(formData);
      }

      onSave(savedRecord);
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-blue-50 text-[#2F80ED] rounded-xl">
              <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-gray-950 tracking-tight">
                {recordToEdit ? "Edit Medical Record" : "Add Medical Record"}
              </h2>
              <p className="hidden lg:block text-[11px] sm:text-xs text-gray-500">Record comprehensive intake details and AI assessments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 sm:mb-1.5">
                Primary Symptom *
              </label>
              <input
                type="text"
                required
                value={formData.primarySymptom}
                onChange={(e) => setFormData({ ...formData, primarySymptom: e.target.value })}
                placeholder="e.g. Persistent cough"
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-950 focus:outline-none focus:border-[#2F80ED] bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 sm:mb-1.5">
                Duration (Days) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={formData.durationInDays}
                onChange={(e) => setFormData({ ...formData, durationInDays: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-950 focus:outline-none focus:border-[#2F80ED] bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 sm:mb-1.5">
                Diagnosis
              </label>
              <input
                type="text"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="e.g. Mild Bronchitis"
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-950 focus:outline-none focus:border-[#2F80ED] bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 sm:mb-1.5">
                Urgency Level
              </label>
              <select
                value={formData.urgencyLevel}
                onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-950 bg-slate-50/50 focus:outline-none focus:border-[#2F80ED]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 sm:mb-1.5">
              Symptoms Discussed
            </label>
            <input
              type="text"
              value={formData.symptomsDiscussed}
              onChange={(e) => setFormData({ ...formData, symptomsDiscussed: e.target.value })}
              placeholder="e.g. Shortness of breath, fatigue"
              className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-950 focus:outline-none focus:border-[#2F80ED] bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 sm:mb-1.5">
              Recommendations
            </label>
            <textarea
              rows={2}
              value={formData.recommendations}
              onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
              placeholder="e.g. Rest, stay hydrated, use inhaler"
              className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-950 focus:outline-none focus:border-[#2F80ED] bg-slate-50/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 sm:mb-1.5">
              Medical History / Notes
            </label>
            <textarea
              rows={2}
              value={formData.medicalHistory}
              onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
              placeholder="e.g. Previous asthma history"
              className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-950 focus:outline-none focus:border-[#2F80ED] bg-slate-50/50 resize-none"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2F80ED] text-white text-xs sm:text-sm font-medium rounded-xl hover:bg-[#2668c7] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {recordToEdit ? "Update Record" : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}