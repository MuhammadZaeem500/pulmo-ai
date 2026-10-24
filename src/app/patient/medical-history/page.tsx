"use client";

import { useState } from "react";
import MedicalRecordCard from "@/components/common/MedicalRecordCard";
import { Search, Download } from "lucide-react";

export default function MedicalHistory() {
  const [searchQuery, setSearchQuery] = useState("");

  const medicalRecords = [
    {
      id: 1,
      date: 'May 25, 2026',
      diagnosis: 'Mild Bronchitis',
      symptoms: 'Persistent cough, shortness of breath',
      confidence: '92%',
      urgency: 'Low',
      recommendations: 'Rest, stay hydrated, use prescribed inhaler',
    },
    {
      id: 2,
      date: 'May 15, 2026',
      diagnosis: 'Upper Respiratory Infection',
      symptoms: 'Sore throat, nasal congestion, mild fever',
      confidence: '88%',
      urgency: 'Low',
      recommendations: 'Over-the-counter medication, plenty of fluids',
    },
    {
      id: 3,
      date: 'April 10, 2026',
      diagnosis: 'Seasonal Allergies',
      symptoms: 'Sneezing, watery eyes, runny nose',
      confidence: '95%',
      urgency: 'Very Low',
      recommendations: 'Antihistamine medication, avoid allergens',
    },
  ];

  const filteredRecords = medicalRecords.filter(
    (record) =>
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.symptoms.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Medical History</h1>
          <p className="text-gray-600">View and manage your complete medical records</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2668c7] transition-colors cursor-pointer w-fit shadow-sm">
          <Download className="w-5 h-5" />
          Download Complete Report
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medical history..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 text-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <MedicalRecordCard
            key={record.id}
            date={record.date}
            diagnosis={record.diagnosis}
            symptoms={record.symptoms}
            confidence={record.confidence}
            urgency={record.urgency}
            recommendations={record.recommendations}
            onViewDetails={() => console.log(`View details for record ${record.id}`)}
            onDownloadReport={() => console.log(`Download report for record ${record.id}`)}
          />
        ))}

        {filteredRecords.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500 text-sm">No medical records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}