"use client";

import { useState, useEffect } from "react";
import MedicalRecordCard from "@/components/common/MedicalRecordCard";
import AddMedicalRecordModal from "@/components/common/AddMedicalRecordModal";
import Modal from "@/components/common/Modal";
import {
  Search,
  Download,
  Plus,
  Loader2,
  FileText,
  Stethoscope,
  FlaskConical,
  Trash2,
} from "lucide-react";
import { medicalRecordsService } from "@/services/medical-records.service";

export default function MedicalHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [medicalFiles, setMedicalFiles] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await medicalRecordsService.getCompleteHistory();
      setMedicalRecords(data?.medicalRecords || []);
      setConsultations(data?.consultations || []);
      setTests(data?.tests || []);
      setMedicalFiles(data?.medicalFiles || []);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load medical history.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
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

  const handleOpenDetails = (item: any, type: string) => {
    setSelectedItem({ ...item, type });
    setIsDetailsModalOpen(true);
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm("Are you sure you want to delete this medical record?"))
      return;

    try {
      setDeleting(true);
      await medicalRecordsService.deleteRecord(recordId);
      setMedicalRecords((prev) => prev.filter((r) => r.id !== recordId));
      setIsDetailsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete medical record.");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredRecords = medicalRecords.filter(
    (record) =>
      (record?.diagnosis?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ) ||
      (record?.primarySymptom?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ),
  );

  const filteredConsultations = consultations.filter(
    (c) =>
      (c?.diagnosis?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (c?.chiefComplaint?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ),
  );

  const filteredTests = tests.filter(
    (t) =>
      (t?.testName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (t?.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-2 sm:p-4 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 relative w-full font-sans">
      {/* Sleek Top Header & Action Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            Medical History
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            View and manage your complete medical records and consultations
          </p>
        </div>

        {/* Compact Side-by-Side Action Buttons */}
        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setRecordToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#2F80ED] text-white rounded-xl hover:bg-[#2668c7] transition-colors cursor-pointer shadow-xs font-medium text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Record
          </button>

          <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors cursor-pointer shadow-xs font-medium text-xs">
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>

      {/* Sleek Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medical history..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 text-xs text-gray-900 shadow-xs"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-7 h-7 animate-spin text-[#2F80ED]" />
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* Section 1: Disease Records & Intakes */}
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2.5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2F80ED]" />
              Disease Records & Intakes
            </h2>
            <div className="space-y-2.5">
              {filteredRecords.map((record) => (
                <MedicalRecordCard
                  key={record.id}
                  date={formatDate(record.createdAt)}
                  diagnosis={record.diagnosis || record.primarySymptom}
                  symptoms={record.primarySymptom}
                  urgency={record.urgencyLevel || record.urgency || "Normal"}
                  urgencyLabel="Urgency Level"
                  recommendations={
                    record.recommendations || record.medicalHistory || "None"
                  }
                  onViewDetails={() => handleOpenDetails(record, "record")}
                  onDownloadReport={() =>
                    console.log(`Download report for record ${record.id}`)
                  }
                />
              ))}

              {filteredRecords.length === 0 && (
                <div className="text-center py-6 bg-white rounded-xl border border-gray-100 shadow-xs">
                  <p className="text-gray-400 text-xs">
                    No medical records found.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Doctor Consultations & Notes */}
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2.5 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              Doctor Consultations & Notes
            </h2>
            <div className="space-y-2.5">
              {filteredConsultations.map((consultation) => (
                <MedicalRecordCard
                  key={consultation.id}
                  date={formatDate(consultation.createdAt)}
                  diagnosis={
                    consultation.diagnosis ||
                    consultation.chiefComplaint ||
                    "Consultation Visit"
                  }
                  symptoms={
                    consultation.chiefComplaint || "No chief complaint recorded"
                  }
                  urgency="Stable"
                  urgencyLabel="Status"
                  recommendations={
                    consultation.visitNotes || "No specific notes provided."
                  }
                  onViewDetails={() =>
                    handleOpenDetails(consultation, "consultation")
                  }
                  onDownloadReport={() =>
                    console.log(
                      `Download report for consultation ${consultation.id}`,
                    )
                  }
                />
              ))}

              {filteredConsultations.length === 0 && (
                <div className="text-center py-6 bg-white rounded-xl border border-gray-100 shadow-xs">
                  <p className="text-gray-400 text-xs">
                    No doctor consultations recorded yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Recommended Diagnostic Tests */}
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2.5 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-purple-600" />
              Recommended Diagnostic Tests
            </h2>
            <div className="space-y-2.5">
              {filteredTests.map((test) => (
                <MedicalRecordCard
                  key={test.id}
                  date={formatDate(test.createdAt)}
                  diagnosis={test.testName}
                  symptoms={test.description || "No description provided"}
                  urgency={test.status || "Pending"}
                  urgencyLabel="Test Status"
                  recommendations="Diagnostic Test Recommendation"
                  onViewDetails={() => handleOpenDetails(test, "test")}
                  onDownloadReport={() =>
                    console.log(`Download report for test ${test.id}`)
                  }
                />
              ))}

              {filteredTests.length === 0 && (
                <div className="text-center py-6 bg-white rounded-xl border border-gray-100 shadow-xs">
                  <p className="text-gray-400 text-xs">
                    No recommended diagnostic tests found.
                  </p>
                </div>
              )}
            </div>
          </div>
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

      {/* View Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={
          selectedItem?.type === "consultation"
            ? "Consultation Details"
            : selectedItem?.type === "test"
              ? "Diagnostic Test Details"
              : "Disease Record & Intake Details"
        }
      >
        {selectedItem && (
          <div className="space-y-3.5 text-xs">
            {/* Header timestamp & main title */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Logged on {formatDate(selectedItem.createdAt)}
              </span>
              <p className="text-gray-900 font-semibold text-sm">
                {selectedItem.type === "consultation"
                  ? selectedItem.diagnosis || "Consultation Visit"
                  : selectedItem.type === "test"
                    ? selectedItem.testName
                    : selectedItem.diagnosis || selectedItem.primarySymptom}
              </p>
            </div>

            {selectedItem.type === "consultation" ? (
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border border-gray-100 bg-white space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Chief Complaint / Symptoms
                  </span>
                  <p className="font-medium text-gray-800">
                    {selectedItem.chiefComplaint ||
                      "No chief complaint recorded."}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Visit Notes / Observations
                  </span>
                  <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700 text-xs leading-relaxed border border-gray-100">
                    {selectedItem.visitNotes || "No specific notes provided."}
                  </div>
                </div>
              </div>
            ) : selectedItem.type === "test" ? (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl border border-gray-100 bg-white space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Test Status
                    </span>
                    <p className="font-medium text-purple-600 pt-0.5">
                      {selectedItem.status || "Pending"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-gray-100 bg-white space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Category
                    </span>
                    <p className="font-medium text-gray-800 pt-0.5">
                      Diagnostic Test
                    </p>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Test Description / Instructions
                  </span>
                  <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700 text-xs leading-relaxed border border-gray-100">
                    {selectedItem.description || "No description provided."}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border border-gray-100 bg-white space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Urgency Level
                  </span>
                  <p className="font-medium text-slate-800 pt-0.5">
                    {selectedItem.urgencyLevel ||
                      selectedItem.urgency ||
                      "Normal"}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-gray-100 bg-white space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Symptoms Discussed
                  </span>
                  <p className="font-medium text-gray-800">
                    {selectedItem.primarySymptom || "None"}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Medical Notes & Recommendations
                  </span>
                  <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700 text-xs leading-relaxed border border-gray-100">
                    {selectedItem.recommendations ||
                      selectedItem.medicalHistory ||
                      "No recommendations recorded."}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
              {selectedItem.type === "record" ? (
                <button
                  type="button"
                  onClick={() => handleDeleteRecord(selectedItem.id)}
                  disabled={deleting}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {deleting ? "Deleting..." : "Delete Record"}
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
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