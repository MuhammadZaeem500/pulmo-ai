"use client";

import { useState, useEffect } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { Search, Plus, Pill, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { prescriptionService } from "@/services/prescription.service";
import AddPrescriptionModal from "@/components/common/AddPrescriptionModal";

export default function DoctorPrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await prescriptionService.getPrescriptions(searchQuery);
      setPrescriptions(data);
    } catch (err) {
      console.error("Failed to load prescriptions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchPrescriptions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this prescription?")) {
      try {
        await prescriptionService.deletePrescription(id);
        setPrescriptions((prev) => prev.filter((rx) => rx.id !== id));
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete prescription.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & New Prescription Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Prescriptions</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{prescriptions.length} prescriptions issued</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Prescription
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by patient name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prescriptions.map((rx) => (
            <DashboardCard key={rx.id} className="hover:border-blue-200 transition-all relative group">
              {/* Top Row: Patient Avatar, Name & Status */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {rx.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{rx.patient}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">{rx.date} · {rx.medsCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {rx.status}
                  </div>
                  <button
                    onClick={() => handleDelete(rx.id)}
                    title="Delete Prescription"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Medications List */}
              <div className="space-y-3 mb-4">
                {rx.medicationsList.map((med: any, medIdx: number) => (
                  <div key={medIdx} className="flex items-start justify-between p-2.5 rounded-xl bg-slate-50/60 border border-slate-100">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 mt-0.5">
                        <Pill className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">
                          {med.name} <span className="text-slate-400 font-normal">({med.dosage})</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{med.frequency}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-teal-600">{med.duration}</span>
                  </div>
                ))}
              </div>

              {/* Doctor Note Box */}
              <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-100 text-[11px] text-slate-600 leading-relaxed">
                {rx.note}
              </div>
            </DashboardCard>
          ))}

          {prescriptions.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100">
              <p className="text-slate-500 text-sm">No prescriptions found.</p>
            </div>
          )}
        </div>
      )}

      <AddPrescriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchPrescriptions}
      />
    </div>
  );
}