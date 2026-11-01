"use client";

import { useState, useEffect } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { Search, ChevronRight, Loader2 } from "lucide-react";
import { doctorService } from "@/services/doctor.service";

export default function DoctorPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Patients</h1>
      </div>

      {/* Search Bar */}
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
            <DashboardCard key={patient.id || idx} className="hover:border-blue-200 transition-all cursor-pointer">
              {/* Top Row: Avatar and Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {patient.initials || patient.name?.substring(0, 2).toUpperCase()}
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${patient.statusColor || 'text-emerald-600 bg-emerald-50'}`}>
                  {patient.status || 'Active'}
                </span>
              </div>

              {/* Patient Name & Demographics */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">{patient.name}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {patient.details || `${patient.age || 'N/A'}y · ${patient.gender || 'Patient'}`}
                </p>
              </div>

              {/* Condition Details */}
              <div className="space-y-0.5 mb-6">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
                  {patient.condition || patient.primarySymptom || 'General Consultation'}
                </div>
                <p className="text-xs text-slate-400 ml-3">{patient.severity || 'Standard'}</p>
              </div>

              {/* Footer: Last Visit & Arrow */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Last: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 hover:text-blue-600 transition-colors" />
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
    </div>
  );
}