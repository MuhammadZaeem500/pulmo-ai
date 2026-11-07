"use client";

import { useState, useEffect } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import Modal from "@/components/common/Modal";
import { Search, ChevronRight, Loader2, Calendar, Activity, User, Heart, Cake } from "lucide-react";
import { doctorService } from "@/services/doctor.service";

export default function DoctorPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await doctorService.getPatients(searchQuery);
        setPatients(data);
        setError("");
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load patients.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchPatients();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleOpenPatientDetails = (patient: any) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Patients</h1>
      </div>

      <div className="relative max-w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search patients by name or condition..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient, idx) => (
            <DashboardCard 
              key={patient.id || idx} 
              className="hover:border-blue-200 transition-all p-0 overflow-hidden"
            >
              <div 
                onClick={() => handleOpenPatientDetails(patient)}
                className="p-6 cursor-pointer h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      {patient.initials || patient.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${patient.statusColor || 'text-emerald-600 bg-emerald-50'}`}>
                      {patient.status || 'Active'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-900">{patient.name}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {patient.details || `${patient.age || 'N/A'}y · ${patient.gender || 'Patient'}`}
                    </p>
                  </div>

                  <div className="space-y-0.5 mb-6">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
                      {patient.condition || patient.primarySymptom || 'General Consultation'}
                    </div>
                    <p className="text-xs text-slate-400 ml-3">{patient.severity || 'Standard'}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Last: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </DashboardCard>
          ))}

          {patients.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100">
              <p className="text-slate-500 text-sm">No patients found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Patient Complete Details Modal including Full Profile Fields */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Patient Complete Details"
      >
        {selectedPatient && (
          <div className="space-y-6 text-sm">
            {/* Header Profile Info */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-base shadow-sm">
                {selectedPatient.initials || selectedPatient.name?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedPatient.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedPatient.email || selectedPatient.details}</p>
              </div>
              <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${selectedPatient.statusColor || 'text-emerald-600 bg-emerald-50'}`}>
                {selectedPatient.status || 'Active'}
              </span>
            </div>

            {/* Grid Information displaying Full Profile Attributes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  Full Name
                </span>
                <p className="font-semibold text-slate-800">{selectedPatient.name || "N/A"}</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                  Blood Group
                </span>
                <p className="font-semibold text-slate-800">{selectedPatient.bloodGroup || selectedPatient.details?.split("Blood: ")[1] || "N/A"}</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  Gender
                </span>
                <p className="font-semibold text-slate-800">{selectedPatient.gender || selectedPatient.details?.split(" · ")[0] || "N/A"}</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Cake className="w-3.5 h-3.5 text-purple-600" />
                  Date of Birth
                </span>
                <p className="font-semibold text-slate-800">
                  {selectedPatient.dateOfBirth ? new Date(selectedPatient.dateOfBirth).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Condition & Last Visit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Condition</span>
                <p className="font-semibold text-slate-800">{selectedPatient.condition || selectedPatient.primarySymptom || 'General Consultation'}</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  Last Visit Date
                </span>
                <p className="font-semibold text-slate-800">
                  {selectedPatient.lastVisit ? new Date(selectedPatient.lastVisit).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
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