"use client";

import { useState, useEffect } from "react";
import DoctorClinicCard from "@/components/common/DoctorClinicCard";
import { Search, Building2, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClinicsSpecialistsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"clinics" | "specialists">(
    "clinics",
  );

  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const endpoint =
          activeTab === "clinics"
            ? "http://localhost:3000/patient/directory/clinics"
            : "http://localhost:3000/patient/directory/doctors";

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch directory data");
        }

        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const filteredData = data.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    if (activeTab === "clinics") {
      return (
        item.name?.toLowerCase().includes(searchLower) ||
        item.address?.toLowerCase().includes(searchLower) ||
        item.city?.toLowerCase().includes(searchLower)
      );
    } else {
      return (
        item.fullName?.toLowerCase().includes(searchLower) ||
        item.specialization?.toLowerCase().includes(searchLower)
      );
    }
  });

  return (
    <div className="p-2 sm:p-4 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Clinics & Specialists
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          Find nearby clinics and pulmonary specialists
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, location, or specialty..."
          className="w-full bg-white pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-hidden focus:border-blue-500 transition-all shadow-xs"
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <button
          onClick={() => {
            setActiveTab("clinics");
            setSearchQuery("");
          }}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer shadow-xs text-center ${
            activeTab === "clinics"
              ? "bg-[#2F80ED] text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Nearby Clinics
        </button>
        <button
          onClick={() => {
            setActiveTab("specialists");
            setSearchQuery("");
          }}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer text-center ${
            activeTab === "specialists"
              ? "bg-[#2F80ED] text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Specialists
        </button>
      </div>

      <div className="space-y-4 relative min-h-50">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((item) => (
            <DoctorClinicCard
              key={item.id}
              icon={
                activeTab === "clinics" ? (
                  <Building2 className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )
              }
              title={activeTab === "clinics" ? item.name : item.fullName}
              subtitle={
                activeTab === "clinics"
                  ? `${item.address || "Address unavailable"} • ${item.city || ""}`
                  : item.specialization
              }
              metaText={
                activeTab === "clinics"
                  ? "Verified Clinic"
                  : `License: ${item.licenseNumber || "N/A"}`
              }
              availability={
                activeTab === "specialists"
                  ? "Available for Booking"
                  : undefined
              }
              rating="4.8"
              actionText={
                activeTab === "clinics"
                  ? "View Details & Book"
                  : "Book Appointment"
              }
              onActionClick={() => {
                router.push(`/patient/appointments`);
              }}
            />
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
            <p className="text-gray-500 text-sm">
              No matching {activeTab} found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
