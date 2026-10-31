"use client";

import { useState, useEffect } from "react";
import MedicalRecordCard from "@/components/common/MedicalRecordCard";
import AddMedicalRecordModal from "@/components/common/AddMedicalRecordModal";
import { Search, Download, History, Plus, Loader2 } from "lucide-react";
import { medicalRecordsService } from "@/services/medical-records.service";

export default function MedicalHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await medicalRecordsService.getMyRecords();
      setMedicalRecords(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load medical records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Handles adding the saved record to state so it displays immediately
  const handleSaveRecord = (newRecord: any) => {
    setMedicalRecords((prevRecords) => [newRecord, ...prevRecords]);
  };

  const filteredRecords = medicalRecords.filter(
    (record) =>
      (record.diagnosis?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (record.primarySymptom?.toLowerCase() || "").includes(searchQuery.toLowerCase())
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
            onClick={() => setIsModalOpen(true)}
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medical history..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 text-sm"
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
              confidence={record.confidence || 'N/A'}
              urgency={record.urgency || 'Normal'}
              recommendations={record.recommendations || record.medicalHistory || 'None'}
              onViewDetails={() => console.log(`View details for record ${record.id}`)}
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

      {/* Modal with handleSave integration */}
      <AddMedicalRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecord}
      />
    </div>
  );
}