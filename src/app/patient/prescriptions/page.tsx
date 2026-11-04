"use client";

import { useState, useEffect } from "react";
import PrescriptionCard from "@/components/common/PrescriptionCard";
import Modal from "@/components/common/Modal";
import { Loader2, FileText, Calendar, User, Clock, Pill } from "lucide-react";
import { prescriptionService } from "@/services/prescription.service";
import PrescriptionCardProps from "@/types/common.types";

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State for Viewing Full Prescription
  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  async function fetchPrescriptions() {
    try {
      setLoading(true);
      const data = await prescriptionService.getMyPrescriptions();
      setPrescriptions(Array.isArray(data) ? data : data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  }

  const handleViewFull = (prescription: any) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Prescriptions</h1>
        <p className="text-gray-500 text-sm">View and manage all your prescriptions</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#2F80ED]" />
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500 text-sm">No prescriptions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((item) => (
            <PrescriptionCard
              key={item.id}
              medicine={item.medicationName}
              doctor={item.doctor?.fullName || "Assigned Physician"}
              date={new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              dosage={item.dosage || "As directed"}
              duration={item.duration || "N/A"}
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
          <div className="space-y-6 text-sm text-left">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-[#2F80ED] rounded-xl">
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Medication</span>
                <h3 className="text-lg font-bold text-gray-900">{selectedPrescription.medicationName}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Prescribed By</span>
                <p className="font-semibold text-gray-800 flex items-center gap-2 pt-1">
                  <User className="w-4 h-4 text-[#2F80ED]" />
                  {selectedPrescription.doctor?.fullName || "Physician"}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Date Issued</span>
                <p className="font-semibold text-gray-800 flex items-center gap-2 pt-1">
                  <Calendar className="w-4 h-4 text-[#2F80ED]" />
                  {new Date(selectedPrescription.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Dosage</span>
                <p className="font-semibold text-gray-800 pt-1">{selectedPrescription.dosage || "As directed"}</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Duration</span>
                <p className="font-semibold text-gray-800 flex items-center gap-1.5 pt-1">
                  <Clock className="w-4 h-4 text-amber-500" />
                  {selectedPrescription.duration || "N/A"}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Instructions / Notes</span>
              <div className="p-3.5 bg-gray-50 rounded-xl text-gray-700 text-xs leading-relaxed border border-gray-100">
                {selectedPrescription.instructions || "No special instructions provided."}
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
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