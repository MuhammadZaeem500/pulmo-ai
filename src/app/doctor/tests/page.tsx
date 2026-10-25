"use client";

import { useState } from "react";
import DashboardCard from "@/components/doctor/dashboard/DashboardCard";
import { Search, Plus, TestTube } from "lucide-react";

export default function DoctorRecommendedTestsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const testRecommendations = [
    {
      initials: "RK",
      patient: "Robert Kim",
      date: "2026-06-05",
      testsCount: "4 tests",
      status: "Pending",
      statusColor: "text-amber-600 bg-amber-50",
      testsList: [
        { name: "HRCT Chest", description: "Compare with previous scan from March 2026. Look for honeycombing progression." },
        { name: "Pulmonary Function Test", description: "Full spirometry with DLCO. Pre and post-bronchodilator." },
        { name: "ABG Analysis", description: "Fasting morning sample. Assess PO2, PCO2, pH." },
        { name: "6-Minute Walk Test", description: "With continuous pulse oximetry. Assess oxygen requirements on exertion." },
      ],
    },
    {
      initials: "JW",
      patient: "James Wilson",
      date: "2026-06-08",
      testsCount: "2 tests",
      status: "Completed",
      statusColor: "text-emerald-600 bg-emerald-50",
      testsList: [
        { name: "Spirometry", description: "Post-bronchodilator spirometry to assess response." },
        { name: "6-Minute Walk Test", description: "Baseline measurement with oximetry." },
      ],
    },
    {
      initials: "MS",
      patient: "Maria Santos",
      date: "2026-06-10",
      testsCount: "3 tests",
      status: "In-Progress",
      statusColor: "text-blue-600 bg-blue-50",
      testsList: [
        { name: "Fractional Exhaled Nitric Oxide (FeNO)", description: "Assess airway inflammation." },
        { name: "Allergy Panel (RAST)", description: "Test for dust mites, pollen, mould, pet dander." },
        { name: "Chest X-ray", description: "Baseline — rule out other pathology." },
      ],
    },
  ];

  const filteredTests = testRecommendations.filter((item) =>
    item.patient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Add Tests Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Recommended Tests</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">3 recommendations issued</p>
        </div>
        <button
          onClick={() => alert("Open Add Tests modal")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Tests
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by patient..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50"
        />
      </div>

      {/* Recommended Tests Grid using Reusable DashboardCard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTests.map((rec, idx) => (
          <DashboardCard key={idx} className="hover:border-blue-200 transition-all">
            {/* Top Row: Patient Avatar, Name & Status */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {rec.initials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{rec.patient}</h3>
                  <p className="text-[11px] text-slate-400 font-medium">{rec.date} · {rec.testsCount}</p>
                </div>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${rec.statusColor}`}>
                ● {rec.status}
              </span>
            </div>

            {/* Tests List */}
            <div className="space-y-3">
              {rec.testsList.map((test, testIdx) => (
                <div key={testIdx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/60 border border-slate-100">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                    <TestTube className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{test.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{test.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}