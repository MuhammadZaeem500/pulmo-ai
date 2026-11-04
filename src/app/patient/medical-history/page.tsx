"use client";

import { useState, useEffect } from "react";
import MedicalRecordCard from "@/components/common/MedicalRecordCard";
import AddMedicalRecordModal from "@/components/common/AddMedicalRecordModal";
import Modal from "@/components/common/Modal";
import { Search, Download, Plus, Loader2, Calendar, AlertTriangle, ShieldCheck, Edit3, Trash2 } from "lucide-react";
import { medicalRecordsService } from "@/services/medical-records.service";

export default function MedicalHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await medicalRecordsService.getMyRecords();
      setMedicalRecords(Array.isArray(data) ? data : data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load medical records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSaveRecord = (savedRecord: any) => {
    setMedicalRecords((prevRecords) => {
      const index = prevRecords.findIndex((r) => r.id === savedRecord.id);
      if (index >= 0) {
        const updated = [...prevRecords];
        updated[index] = savedRecord;
        return updated;
      }
      return [savedRecord, ...prevRecords];
    });
  };

  const handleDeleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this medical record?")) return;
    try {
      setDeleting(true);
      await medicalRecordsService.deleteRecord(id);
      setMedicalRecords((prev) => prev.filter((r) => r.id !== id));
      setIsDetailsModalOpen(false);
      setSelectedRecord(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete record.");
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenDetails = (record: any) => {
    setSelectedRecord(record);
    setIsDetailsModalOpen(true);
  };

  const handleOpenEdit = (record: any) => {
    setRecordToEdit(record);
    setIsDetailsModalOpen(false);
    setIsAddModalOpen(true);
  };

  const filteredRecords = medicalRecords.filter(
    (record) =>
      (record?.diagnosis?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (record?.primarySymptom?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Medical History</h1>
          <p className="text-gray-600">View and manage your complete medical records</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setRecordToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2668c7] transition-colors cursor-pointer shadow-sm font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Disease Record
          </button>
          
          <button className="flex items-center gap-2 px-6 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2668c7] transition-colors cursor-pointer shadow-sm font-medium text-sm">
            <Download className="w-5 h-5" />
            Download Complete Report
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medical history..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 text-sm text-gray-900"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#2F80ED]" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <MedicalRecordCard
              key={record.id}
              date={new Date(record.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
              diagnosis={record.diagnosis || record.primarySymptom}
              symptoms={record.primarySymptom}
              confidence={record.confidenceScore ? `${Math.round(record.confidenceScore * 100)}%` : 'N/A'}
              urgency={record.urgencyLevel || 'Normal'}
              recommendations={record.recommendations || record.medicalHistory || 'None'}
              onViewDetails={() => handleOpenDetails(record)}
              onDownloadReport={() => console.log(`Download report for record ${record.id}`)}
            />
          ))}

          {filteredRecords.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500 text-sm">No medical records found.</p>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Medical Record Modal */}
      <AddMedicalRecordModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setRecordToEdit(null);
        }}
        onSave={handleSaveRecord}
        recordToEdit={recordToEdit}
      />

      {/* View Record Details Modal with Edit & Delete */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Medical Record Details"
      >
        {selectedRecord && (
          <div className="space-y-6 text-sm">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Logged on {new Date(selectedRecord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <p className="text-gray-900 font-semibold text-base">{selectedRecord.primarySymptom || "N/A"}</p>
              {selectedRecord.durationInDays && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600 pt-1">
                  <Calendar className="w-4 h-4 text-[#2F80ED]" />
                  <span>Duration: <strong>{selectedRecord.durationInDays} days</strong></span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Diagnosis Match</span>
                <p className="font-medium text-gray-800">{selectedRecord.diagnosis || "Pending Evaluation"}</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Urgency Level</span>
                <div className="flex items-center gap-1.5 pt-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-gray-800">{selectedRecord.urgencyLevel || 'Normal'}</span>
                </div>
              </div>
            </div>

            {selectedRecord.confidenceScore !== null && selectedRecord.confidenceScore !== undefined && (
              <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 text-blue-900 font-medium">
                  <ShieldCheck className="w-5 h-5 text-[#2F80ED]" />
                  <span>AI Confidence Score</span>
                </div>
                <span className="font-bold text-[#2F80ED] text-base">
                  {Math.round(selectedRecord.confidenceScore * (selectedRecord.confidenceScore <= 1 ? 100 : 1))}%
                </span>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Recommendations</span>
              <div className="p-3.5 bg-gray-50 rounded-xl text-gray-700 text-xs leading-relaxed border border-gray-100">
                {selectedRecord.recommendations || "No specific recommendations provided yet."}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Medical History / Notes</span>
              <div className="p-3.5 bg-gray-50 rounded-xl text-gray-700 text-xs leading-relaxed border border-gray-100">
                {selectedRecord.medicalHistory || "None provided."}
              </div>
            </div>

            {/* Modal Actions: Edit, Delete, Close */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(selectedRecord)}
                  className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-[#2F80ED] text-sm font-medium rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRecord(selectedRecord.id)}
                  disabled={deleting}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-medium rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
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