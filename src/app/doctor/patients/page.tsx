"use client";

import { useState } from "react";
import DashboardCard from "@/components/doctor/DashboardCard";
import { Search, ChevronRight } from "lucide-react";

export default function DoctorPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const patients = [
    {
      initials: "JW",
      name: "James Wilson",
      details: "45y · Male",
      condition: "COPD",
      severity: "Stage II",
      lastVisit: "2026-06-08",
      status: "Stable",
      statusColor: "text-emerald-600 bg-emerald-50",
    },
    {
      initials: "MS",
      name: "Maria Santos",
      details: "32y · Female",
      condition: "Asthma",
      severity: "Moderate",
      lastVisit: "2026-06-10",
      status: "Active",
      statusColor: "text-blue-600 bg-blue-50",
    },
    {
      initials: "RK",
      name: "Robert Kim",
      details: "67y · Male",
      condition: "Pulmonary Fibrosis",
      severity: "Progressive",
      lastVisit: "2026-06-05",
      status: "Critical",
      statusColor: "text-rose-600 bg-rose-50",
    },
    {
      initials: "ET",
      name: "Emma Thompson",
      details: "28y · Female",
      condition: "Chronic Bronchitis",
      severity: "Mild",
      lastVisit: "2026-06-12",
      status: "Stable",
      statusColor: "text-emerald-600 bg-emerald-50",
    },
    {
      initials: "DO",
      name: "David Osei",
      details: "55y · Male",
      condition: "COPD + Sleep Apnea",
      severity: "Moderate",
      lastVisit: "2026-06-01",
      status: "Stable",
      statusColor: "text-emerald-600 bg-emerald-50",
    },
    {
      initials: "PP",
      name: "Priya Patel",
      details: "38y · Female",
      condition: "Asthma",
      severity: "Mild",
      lastVisit: "2026-06-11",
      status: "Active",
      statusColor: "text-blue-600 bg-blue-50",
    },
  ];

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50"
        />
      </div>

      {/* Patients Grid using Reusable DashboardCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient, idx) => (
          <DashboardCard key={idx} className="hover:border-blue-200 transition-all cursor-pointer">
            {/* Top Row: Avatar and Status Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {patient.initials}
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${patient.statusColor}`}>
                {patient.status}
              </span>
            </div>

            {/* Patient Name & Demographics */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900">{patient.name}</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{patient.details}</p>
            </div>

            {/* Condition Details */}
            <div className="space-y-0.5 mb-6">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
                {patient.condition}
              </div>
              <p className="text-xs text-slate-400 ml-3">{patient.severity}</p>
            </div>

            {/* Footer: Last Visit & Arrow */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Last: {patient.lastVisit}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 hover:text-blue-600 transition-colors" />
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}