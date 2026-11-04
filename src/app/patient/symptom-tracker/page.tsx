"use client";

import { useState, useEffect } from "react";
import { Plus, TrendingUp, Loader2, Trash2, AlertCircle } from "lucide-react";
import SymptomCard from "@/components/common/SymptomCard";
import Modal from "@/components/common/Modal";
import { symptomService } from "@/services/symptom.service";

export default function SymptomTrackerPage() {
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Create Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    symptomText: "",
    urgency: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY",
    recommendedSpecialist: "Pulmonologist",
  });

  // View History Modal state
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  async function fetchSymptoms() {
    try {
      setLoading(true);
      const data = await symptomService.getAssessments();
      setSymptoms(Array.isArray(data) ? data : data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load symptom history");
      setSymptoms([]);
    } finally {
      setLoading(false);
    }
  }

  const handleLogSymptomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.symptomText.trim()) return;

    try {
      setSubmitting(true);
      const newAssessment = await symptomService.createAssessment({
        symptomText: formData.symptomText,
        urgency: formData.urgency,
        recommendedSpecialist: formData.recommendedSpecialist,
        modelName: "PulmoAI-Diagnostic",
        modelVersion: "v1.0",
        predictions: [
          { condition: "Primary Assessment Match", confidence: 0.88, rank: 1 },
          { condition: "Secondary Observation", confidence: 0.65, rank: 2 },
        ],
      });

      setSymptoms((prev) => [newAssessment, ...(prev || [])]);
      setIsCreateModalOpen(false);
      setFormData({ 
        symptomText: "", 
        urgency: "MEDIUM", 
        recommendedSpecialist: "Pulmonologist" 
      });
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to log symptom");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAssessment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this symptom record?")) return;

    try {
      setDeleting(true);
      await symptomService.deleteAssessment(id);
      setSymptoms((prev) => (prev || []).filter((s) => s?.id !== id));
      setIsHistoryModalOpen(false);
      setSelectedAssessment(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete symptom record");
    } finally {
      setDeleting(false);
    }
  };

  const openHistoryModal = (assessment: any) => {
    setSelectedAssessment(assessment);
    setIsHistoryModalOpen(true);
  };

  // Helper functions to format backend enums to UI labels & trends
  const formatSeverityLabel = (urgency: string) => {
    switch (urgency) {
      case "LOW": return "Mild";
      case "MEDIUM": return "Moderate";
      case "HIGH":
      case "EMERGENCY": return "Severe";
      default: return "Moderate";
    }
  };

  const getTrendIconType = (urgency: string): 'right' | 'down' | 'up' => {
    switch (urgency) {
      case "LOW": return "down";
      case "MEDIUM": return "right";
      case "HIGH":
      case "EMERGENCY": return "up";
      default: return "right";
    }
  };

  // Safe filtering and calculations with optional chaining
  const safeSymptoms = Array.isArray(symptoms) ? symptoms.filter(Boolean) : [];
  const totalCount = safeSymptoms.length;
  const improvingCount = safeSymptoms.filter((s) => s?.urgency === "LOW" || s?.urgency === "MEDIUM").length;
  const attentionCount = safeSymptoms.filter((s) => s?.urgency === "HIGH" || s?.urgency === "EMERGENCY").length;

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
            Symptom Tracker
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor and track your symptoms over time
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          Log Symptom
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-sm font-medium text-gray-500">Total Symptoms Logged</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-sm font-medium text-gray-500">Improving / Stable</p>
          <p className="text-3xl font-bold text-[#14B8A6] mt-2">{improvingCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-sm font-medium text-gray-500">Need Attention</p>
          <p className="text-3xl font-bold text-rose-600 mt-2">{attentionCount}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 px-1">Symptom Timeline</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <p className="text-rose-600 text-xs">{error}</p>
        ) : safeSymptoms.length === 0 ? (
          <p className="text-gray-500 text-xs">No symptoms logged yet.</p>
        ) : (
          <div className="space-y-3">
            {safeSymptoms.map((item) => (
              item ? (
                <SymptomCard
                  key={item.id}
                  symptom={item.symptomText}
                  severity={formatSeverityLabel(item.urgency)}
                  date={item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                  trendIcon={getTrendIconType(item.urgency)}
                  onViewHistory={() => openHistoryModal(item)}
                />
              ) : null
            ))}
          </div>
        )}
      </div>

      {/* Trends Footer */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-base">
          <TrendingUp className="w-5 h-5" />
          <h3>Symptom Trends</h3>
        </div>
        <p className="text-gray-500 text-sm">
          Track patterns in your symptoms to better understand your health journey and share insights with your healthcare provider.
        </p>
      </div>

      {/* 1. CREATE SYMPTOM MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Log New Symptom"
      >
        <form onSubmit={handleLogSymptomSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Symptom Description
            </label>
            <textarea
              rows={3}
              value={formData.symptomText}
              onChange={(e) => setFormData({ ...formData, symptomText: e.target.value })}
              placeholder="e.g., Shortness of breath, dry cough..."
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-sm text-gray-900 bg-gray-50/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Severity / Urgency Level
            </label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-sm text-gray-900 bg-gray-50/50"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="EMERGENCY">Emergency</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Recommended Specialist
            </label>
            <input
              type="text"
              value={formData.recommendedSpecialist}
              onChange={(e) => setFormData({ ...formData, recommendedSpecialist: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-sm text-gray-900 bg-gray-50/50"
              placeholder="Pulmonologist"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Symptom
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. VIEW HISTORY & DELETE MODAL */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title="Symptom Assessment Details"
      >
        {selectedAssessment && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Logged on {selectedAssessment.createdAt ? new Date(selectedAssessment.createdAt).toLocaleString() : ""}
              </span>
              <p className="text-gray-900 font-medium text-base">
                "{selectedAssessment.symptomText}"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-gray-500">Urgency:</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  {selectedAssessment.urgency}
                </span>
              </div>
            </div>

            {/* AI Predictions / Specialist section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                AI Diagnostic Predictions
              </h4>
              {selectedAssessment.predictions && selectedAssessment.predictions.length > 0 ? (
                <div className="space-y-2">
                  {selectedAssessment.predictions.map((pred: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-white shadow-2xs">
                      <span className="text-sm font-medium text-gray-800">{pred?.condition}</span>
                      <span className="text-xs font-bold text-teal-600">
                        {pred?.confidence ? Math.round(pred.confidence * 100) : 0}% Match
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No AI predictions attached.</p>
              )}

              {selectedAssessment.recommendedSpecialist && (
                <div className="pt-2 text-xs text-gray-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span>Recommended Specialist: <strong>{selectedAssessment.recommendedSpecialist}</strong></span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => handleDeleteAssessment(selectedAssessment.id)}
                disabled={deleting}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-medium rounded-xl transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Record
              </button>

              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}