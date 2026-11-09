"use client";

import { useState, useEffect } from "react";
import PrescriptionCard from "@/components/common/PrescriptionCard";
import Modal from "@/components/common/Modal";
import { Loader2, Calendar, User, Clock, Pill } from "lucide-react";
import { prescriptionService } from "@/services/prescription.service";

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  async function fetchPrescriptions() {
    try {
      setLoading(true);
      const data = await prescriptionService.getMyPrescriptions();
      const items = Array.isArray(data) ? data : data?.data || [];
      
      console.log("-> Processed Patient Prescriptions:", items);
      setPrescriptions(items);
    } catch (err: any) {
      console.error("-> Error loading prescriptions:", err);
      setError(err.response?.data?.message || err.message || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  }

  const handleViewFull = (prescription: any) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  return (
    <div className="p-2 sm:p-4 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 relative w-full font-sans">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
          Prescriptions
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          View and manage all your prescriptions
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs sm:text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-[#2F80ED]" />
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-gray-100 shadow-xs">
          <p className="text-gray-400 text-xs sm:text-sm">No prescriptions found.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {prescriptions.map((item) => (
            <PrescriptionCard
              key={item.id}
              medicine={item.medicationName}
              doctor={`${item.doctor?.fullName || "Assigned Physician"}${item.doctor?.specialization ? ` (${item.doctor.specialization})` : ""}`}
              date={new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              dosage={item.dosage}
              duration={item.duration}
              onDownload={() => console.log(`Download prescription ${item.id}`)}
              onViewFull={() => handleViewFull(item)}
            />
          ))}
        </div>
      )}

      {/* View Full Prescription Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Prescription Details"
      >
        {selectedPrescription && (
          <div className="space-y-4 sm:space-y-5 text-xs sm:text-sm text-left">
            <div className="bg-blue-50/50 p-3.5 sm:p-4 rounded-xl border border-blue-100 flex items-center gap-3">
              <div className="p-2.5 sm:p-3 bg-blue-100 text-[#2F80ED] rounded-xl shrink-0">
                <Pill className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-600">Medication</span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{selectedPrescription.medicationName}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-xl border border-gray-100 bg-white space-y-1">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400">Prescribed By</span>
                <p className="font-semibold text-gray-800 flex items-center gap-2 pt-0.5">
                  <User className="w-4 h-4 text-[#2F80ED] shrink-0" />
                  <span className="truncate">{selectedPrescription.doctor?.fullName || "Assigned Physician"}</span>
                  {selectedPrescription.doctor?.specialization && (
                    <span className="text-xs text-gray-400 font-normal truncate">({selectedPrescription.doctor.specialization})</span>
                  )}
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl border border-gray-100 bg-white space-y-1">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400">Date Issued</span>
                <p className="font-semibold text-gray-800 flex items-center gap-2 pt-0.5">
                  <Calendar className="w-4 h-4 text-[#2F80ED] shrink-0" />
                  {new Date(selectedPrescription.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-xl border border-gray-100 bg-white space-y-1">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400">Dosage</span>
                <p className="font-semibold text-gray-800 pt-0.5">{selectedPrescription.dosage || "As directed"}</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl border border-gray-100 bg-white space-y-1">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400">Duration</span>
                <p className="font-semibold text-gray-800 flex items-center gap-1.5 pt-0.5">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  {selectedPrescription.duration || "N/A"}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400">Instructions / Notes</span>
              <div className="p-3 sm:p-3.5 bg-gray-50 rounded-xl text-gray-700 text-xs leading-relaxed border border-gray-100">
                {selectedPrescription.instructions || "No special instructions provided."}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 sm:pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer text-center w-full sm:w-auto"
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