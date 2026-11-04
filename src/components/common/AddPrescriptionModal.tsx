"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Pill } from "lucide-react";
import { prescriptionService } from "@/services/prescription.service";
import api from "@/services/api";
import { AddMedicalRecordModalProps } from "@/types/modal.types";

export default function AddPrescriptionModal({ isOpen, onClose, onSave }: AddMedicalRecordModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    primarySymptom: "",
    medicalHistory: "",
  });

  useEffect(() => {
    if (isOpen) {
      api.get("/doctor/patient-select").then((res) => {
        setPatients(res.data);
      }).catch((err) => console.error("Failed to load patients list", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await prescriptionService.createPrescription(formData);
      onSave(formData);
      setFormData({ patientId: "", diagnosis: "", primarySymptom: "", medicalHistory: "" });
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to issue prescription.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">New Prescription</h2>
              <p className="text-xs text-slate-500">Issue medications and clinical notes for patient</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer">
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
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Choose Patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} 
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Medication / Diagnosis</label>
            <input
              type="text"
              required
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              placeholder="e.g. Tiotropium (Spiriva) 18 mcg"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Dosage & Frequency</label>
            <input
              type="text"
              required
              value={formData.primarySymptom}
              onChange={(e) => setFormData({ ...formData, primarySymptom: e.target.value })}
              placeholder="e.g. Once daily for 3 months"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Instructions / Doctor Note</label>
            <textarea
              rows={3}
              value={formData.medicalHistory}
              onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
              placeholder="Enter patient instructions..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Issue Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}