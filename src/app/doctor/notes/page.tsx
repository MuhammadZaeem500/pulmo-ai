"use client";

import { useState } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { Search, FileText, Plus, Edit2, ChevronRight } from "lucide-react";

export default function DoctorConsultationNotesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const notes = [
    {
      patient: "James Wilson",
      date: "2026-06-08",
      diagnosis: "COPD Stage II — Stable",
      description: "Mild dyspnea on exertion, productive cough in mornings, no haemoptysis",
    },
    {
      patient: "Maria Santos",
      date: "2026-06-10",
      diagnosis: "Moderate Persistent Asthma — Partially Controlled",
      description: "Nocturnal cough 3–4 nights/week, wheezing after exercise, morning chest tightness",
    },
    {
      patient: "Robert Kim",
      date: "2026-06-05",
      diagnosis: "IPF — Progressive Decline",
      description: "Worsening dyspnea at rest, dry cough, significant fatigue, reduced exercise tolerance",
    },
  ];

  const filteredNotes = notes.filter(
    (n) =>
      n.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & New Note Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Consultation Notes</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">3 total notes</p>
        </div>
        <button
          onClick={() => alert("Open New Note modal")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search notes by patient or diagnosis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50"
        />
      </div>

      {/* Notes List using Reusable DashboardCard */}
      <div className="space-y-4">
        {filteredNotes.map((note, idx) => (
          <DashboardCard key={idx} className="hover:border-blue-200 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              {/* Left side: Icon, Patient, Diagnosis & Description */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{note.patient}</h3>
                    <span className="text-xs text-slate-400 font-medium">{note.date}</span>
                  </div>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">{note.diagnosis}</p>
                  <p className="text-xs text-slate-500 mt-1">{note.description}</p>
                </div>
              </div>

              {/* Right side: Action icons */}
              <div className="flex items-center gap-3 text-slate-400">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors hover:text-blue-600">
                  <Edit2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}