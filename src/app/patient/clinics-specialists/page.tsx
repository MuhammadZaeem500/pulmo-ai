"use client";

import { useState } from "react";
import DoctorClinicCard from "@/components/common/DoctorClinicCard";
import { Search, Building2, User } from "lucide-react";
import ItemData from "@/types/patient.types";


export default function ClinicsSpecialistsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"clinics" | "specialists">("clinics");

  const clinics: ItemData[] = [
    {
      id: 1,
      title: "City Medical Center",
      subtitle: "123 Main St, Downtown • +1 (555) 123-4567",
      metaText: "2.3 km away",
      rating: "4.8",
      actionText: "View Details & Book",
    },
    {
      id: 2,
      title: "Respiratory Care Clinic",
      subtitle: "456 Health Ave, Medical District • +1 (555) 234-5678",
      metaText: "3.1 km away",
      rating: "4.9",
      actionText: "View Details & Book",
    },
  ];

  const specialists: ItemData[] = [
    {
      id: 1,
      title: "Dr. Sarah Johnson",
      subtitle: "Pulmonologist",
      metaText: "15 years experience • City Medical Center",
      availability: "Available: Mon, Wed, Fri",
      rating: "4.9",
      actionText: "Book Appointment",
    },
    {
      id: 2,
      title: "Dr. Michael Chen",
      subtitle: "Respiratory Specialist",
      metaText: "12 years experience • Respiratory Care Clinic",
      availability: "Available: Tue, Thu, Sat",
      rating: "4.8",
      actionText: "Book Appointment",
    },
  ];

  const currentData = activeTab === "clinics" ? clinics : specialists;

  const filteredData = currentData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
     
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Clinics & Specialists</h1>
        <p className="text-gray-500 text-sm">Find nearby clinics and pulmonary specialists</p>
      </div>

     
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, location, or specialty..."
          className="w-full bg-white pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 outline-hidden focus:border-blue-500 transition-all shadow-xs"
        />
      </div>

     
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab("clinics")}
          className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer shadow-xs ${
            activeTab === "clinics"
              ? "bg-[#2F80ED] text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Nearby Clinics
        </button>
        <button
          onClick={() => setActiveTab("specialists")}
          className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === "specialists"
              ? "bg-[#2F80ED] text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Specialists
        </button>
      </div>

     
      <div className="space-y-4">
        {filteredData.map((item) => (
          <DoctorClinicCard
            key={item.id}
            icon={activeTab === "clinics" ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
            title={item.title}
            subtitle={item.subtitle}
            metaText={item.metaText}
            availability={item.availability}
            rating={item.rating}
            actionText={item.actionText}
            onActionClick={() => console.log(`Action clicked for ${item.title}`)}
          />
        ))}
      </div>
    </div>
  );
}