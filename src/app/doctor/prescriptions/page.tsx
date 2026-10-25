"use client";

import { useState } from "react";
import DashboardCard from "@/components/doctor/DashboardCard";
import { Search, Plus, Pill, CheckCircle2 } from "lucide-react";

export default function DoctorPrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const prescriptions = [
    {
      initials: "JW",
      patient: "James Wilson",
      date: "2026-06-08",
      medsCount: "2 medications",
      status: "Issued",
      medicationsList: [
        { name: "Tiotropium (Spiriva)", dosage: "18 mcg", frequency: "Once daily", duration: "3 months" },
        { name: "Salbutamol (Ventolin)", dosage: "100 mcg/puff × 2", frequency: "PRN (max 4x daily)", duration: "Ongoing" },
      ],
      note: "Use spacer device with Ventolin. Rinse mouth after ICS. Return if increasing reliever use.",
    },
    {
      initials: "MS",
      patient: "Maria Santos",
      date: "2026-06-10",
      medsCount: "3 medications",
      status: "Issued",
      medicationsList: [
        { name: "Fluticasone/Salmeterol (Seretide)", dosage: "250/25 mcg", frequency: "Twice daily", duration: "2 months" },
        { name: "Montelukast", dosage: "10 mg", frequency: "Once daily at bedtime", duration: "2 months" },
        { name: "Salbutamol (Ventolin)", dosage: "100 mcg/puff × 2", frequency: "PRN only", duration: "Ongoing" },
      ],
      note: "Monitor peak flow weekly. Keep asthma action plan updated. Return if worsening or >3 reliever uses/week.",
    },
    {
      initials: "RK",
      patient: "Robert Kim",
      date: "2026-06-05",
      medsCount: "2 medications",
      status: "Issued",
      medicationsList: [
        { name: "Pirfenidone (Esbriet)", dosage: "801 mg", frequency: "Three times daily with food", duration: "3 months" },
        { name: "Prednisolone", dosage: "10 mg", frequency: "Once daily (tapering)", duration: "2 weeks then review" },
      ],
      note: "Take Pirfenidone with food to reduce GI side effects. Avoid prolonged sun exposure. LFTs monthly.",
    },
  ];

  const filteredPrescriptions = prescriptions.filter((p) =>
    p.patient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & New Prescription Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Prescriptions</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">3 prescriptions issued</p>
        </div>
        <button
          onClick={() => alert("Open New Prescription modal")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity shadow-sm"
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

      {/* Prescriptions Grid using Reusable DashboardCard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPrescriptions.map((rx, idx) => (
          <DashboardCard key={idx} className="hover:border-blue-200 transition-all">
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
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {rx.status}
              </div>
            </div>

            {/* Medications List */}
            <div className="space-y-3 mb-4">
              {rx.medicationsList.map((med, medIdx) => (
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
      </div>
    </div>
  );
}