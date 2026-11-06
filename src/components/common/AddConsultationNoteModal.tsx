"use client";

import { useState, useEffect } from "react";
import { X, Loader2, FileText } from "lucide-react";
import { consultationService } from "@/services/consultation.service";
import api from "@/services/api";
import {ModalProps} from "@/types/modal.types";
import {ConsultationNoteModalProps} from "@/types/modal.types";

export default function AddConsultationNoteModal({ isOpen, onClose, onSave, noteToEdit }: ConsultationNoteModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [patients, setPatients] = useState<any[]>([]); 
  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    primarySymptom: "",
    urgency: "Stable",
    medicalHistory: "",
  });

  useEffect(() => {
    if (isOpen) {
      api.get("/doctor/patient-select").then((res) => {
        setPatients(res.data);
      }).catch((err) => console.error("Failed to load patients list", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (noteToEdit) {
      setFormData({
        patientId: noteToEdit.patientId || "",
        diagnosis: noteToEdit.diagnosis || "",
        primarySymptom: noteToEdit.primarySymptom || noteToEdit.notes || "",
        urgency: noteToEdit.status || "Stable",
        medicalHistory: noteToEdit.medicalHistory || noteToEdit.notes || "",
      });
    } else {
      setFormData({ patientId: "", diagnosis: "", primarySymptom: "", urgency: "Stable", medicalHistory: "" });
    }
  }, [noteToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      let saved;
      if (noteToEdit) {
        saved = await consultationService.updateNote(noteToEdit.id, formData);
      } else {
        saved = await consultationService.createNote(formData);
      }
      onSave(saved);
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save note.");
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
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{noteToEdit ? "Edit Consultation Note" : "New Consultation Note"}</h2>
              <p className="text-xs text-slate-500">Record patient diagnosis and examination notes</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!noteToEdit && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Select Patient</label>
              <select
                required
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">-- Choose Patient --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} 
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Diagnosis / Title</label>
              <input
                type="text"
                required
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="e.g. COPD Stage II — Stable"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Status / Urgency</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Stable">Stable</option>
                <option value="Active">Active</option>
                <option value="Critical">Critical</option>
                <option value="Progressive">Progressive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Primary Symptom</label>
            <input
              type="text"
              required
              value={formData.primarySymptom}
              onChange={(e) => setFormData({ ...formData, primarySymptom: e.target.value })}
              placeholder="e.g. Mild dyspnea on exertion"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Detailed Examination Notes</label>
            <textarea
              rows={3}
              value={formData.medicalHistory}
              onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
              placeholder="Enter comprehensive clinical notes..."
              className="w-full px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {noteToEdit ? "Update Note" : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}