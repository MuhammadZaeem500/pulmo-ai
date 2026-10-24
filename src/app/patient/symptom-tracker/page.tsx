// src/app/patient/symptom-tracker/page.tsx
"use client";

import { Plus, TrendingUp } from "lucide-react";
import MetricCard from "@/components/common/MetricCard";
import SymptomCard from "@/components/common/SymptomCard";

export default function SymptomTrackerPage() {
  const symptoms = [
    {
      id: "1",
      symptom: "Shortness of Breath",
      severity: "Moderate" as const,
      date: "May 28, 2026",
      trend: "right" as const,
    },
    {
      id: "2",
      symptom: "Chest Tightness",
      severity: "Mild" as const,
      date: "May 27, 2026",
      trend: "down" as const,
    },
    {
      id: "3",
      symptom: "Persistent Cough",
      severity: "Moderate" as const,
      date: "May 26, 2026",
      trend: "right" as const,
    },
    {
      id: "4",
      symptom: "Wheezing",
      severity: "Mild" as const,
      date: "May 25, 2026",
      trend: "down" as const,
    },
    {
      id: "5",
      symptom: "Fatigue",
      severity: "Severe" as const,
      date: "May 24, 2026",
      trend: "up" as const,
    },
  ];

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
            Symptom Tracker
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor and track your symptoms over time
          </p>
        </div>

        <button
          onClick={() => {}}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          Log Symptom
        </button>
      </div>

      {/* Metric Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Symptoms Logged" value="5" valueColor="text-blue-600" />
        <MetricCard title="Improving" value="2" valueColor="text-[#14B8A6]" />
        <MetricCard title="Need Attention" value="1" valueColor="text-rose-600" />
      </div>

      {/* Symptom Timeline Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 px-1">Symptom Timeline</h2>
        <div className="space-y-3">
          {symptoms.map((item) => (
            <SymptomCard
              key={item.id}
              symptom={item.symptom}
              severity={item.severity}
              date={item.date}
              trendIcon={item.trend}
              onViewHistory={() => console.log(`View history for ${item.symptom}`)}
            />
          ))}
        </div>
      </div>

      {/* Symptom Trends Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-base">
          <TrendingUp className="w-5 h-5" />
          <h3>Symptom Trends</h3>
        </div>
        <p className="text-gray-500 text-sm">
          Track patterns in your symptoms to better understand your health journey and share insights with your healthcare provider.
        </p>
      </div>
    </div>
  );
}