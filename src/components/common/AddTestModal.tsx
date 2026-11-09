"use client";

import { useState, useEffect } from "react";
import { X, Loader2, FlaskConical } from "lucide-react";
import { testService } from "@/services/test.service";
import api from "@/services/api";
import { AddMedicalRecordModalProps } from "@/types/modal.types";

export default function AddTestModal({ isOpen, onClose, onSave }: AddMedicalRecordModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    patientId: "",
    testName: "",
    description: "",
    status: "Pending",
  });

  useEffect(() => {
    if (isOpen) {
      api.get("/doctor/patient-select").then((res) => {
        setPatients(res.data);
      }).catch((err) => console.error("Failed to load patients", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await testService.createTest(formData);
      onSave(formData);
      setFormData({ patientId: "", testName: "", description: "", status: "Pending" });
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to recommend test.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-teal-50 text-teal-600 rounded-xl shrink-0">
              <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Recommend Diagnostic Test</h2>
              <p className="text-xs text-slate-500">Order lab tests or clinical scans for patient</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Select Patient</label>
            <select
              required
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 focus:outline-none focus:border-teal-500"
            >
              <option value="">-- Choose Patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.details})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Test Name</label>
              <input
                type="text"
                required
                value={formData.testName}
                onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                placeholder="e.g. HRCT Chest"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 focus:outline-none focus:border-teal-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Description / Instructions</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Compare with previous scan from March 2026..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-teal-500 resize-none"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-5 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-xs sm:text-sm font-medium text-slate-600 cursor-pointer text-center">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-600 text-white text-xs sm:text-sm font-medium rounded-xl hover:bg-teal-700 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Test Recommendation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}